/**
 * migrate-media-to-blob.ts
 *
 * One-time migration script: uploads all local media files from /media/ to
 * Vercel Blob Store and updates MongoDB documents with the new blob URLs.
 *
 * Usage:
 *   BLOB_READ_WRITE_TOKEN=... DATABASE_URI=... npx ts-node --esm scripts/migrate-media-to-blob.ts
 *   -- or with dotenv loaded --
 *   npx ts-node --esm scripts/migrate-media-to-blob.ts
 *
 * Idempotent: documents whose url field already starts with "https://…blob.vercel-storage.com"
 * are skipped. Safe to re-run after partial failures.
 *
 * Author: backend-engineer
 * Date: 2026-03-19
 */

import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { MongoClient, Db, Collection, Document } from "mongodb";
import { put } from "@vercel/blob";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), override: true });

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const DATABASE_URI = process.env.DATABASE_URI;
const MEDIA_DIR = path.resolve(process.cwd(), "media");

if (!BLOB_TOKEN) {
  console.error("ERROR: BLOB_READ_WRITE_TOKEN environment variable is required");
  process.exit(1);
}

if (!DATABASE_URI) {
  console.error("ERROR: DATABASE_URI environment variable is required");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Size suffix patterns for Payload's generated image derivatives
// ---------------------------------------------------------------------------

const SIZE_SUFFIXES: Record<string, string> = {
  thumbnail: "-160x160",
  card: "-480x480",
  full: "-1200x",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Derives the derivative filename for a given size from the original filename.
 * Payload appends the size suffix before the extension.
 * e.g. "my-photo.jpg" + "-160x160" → "my-photo-160x160.jpg"
 *
 * For the "full" size the width-only pattern means we search the media dir
 * for any file matching `<base>-1200x*.<ext>`.
 */
function deriveDerivativeFilename(
  originalFilename: string,
  suffix: string
): string | null {
  const ext = path.extname(originalFilename);
  const base = path.basename(originalFilename, ext);

  if (suffix.endsWith("x")) {
    // width-only suffix: search for matching file
    const files = fs.readdirSync(MEDIA_DIR);
    const pattern = `${base}${suffix}`;
    const match = files.find((f) => f.startsWith(pattern) && f.endsWith(ext));
    return match ?? null;
  }

  return `${base}${suffix}${ext}`;
}

/**
 * Upload a single file to Vercel Blob. Returns the public URL.
 * Uses the filename as the blob pathname so URLs are deterministic.
 */
async function uploadToBlob(localPath: string, filename: string): Promise<string> {
  const fileBuffer = fs.readFileSync(localPath);
  const blob = await put(filename, fileBuffer, {
    access: "public",
    token: BLOB_TOKEN as string,
    // Overwrite existing blob with the same pathname to keep migration idempotent
    // at the blob level (already-uploaded files get a stable URL regardless).
    addRandomSuffix: false,
  });
  return blob.url;
}

/**
 * Determines the MIME type from the file extension (basic set for images).
 */
function mimeFromExt(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const map: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".avif": "image/avif",
  };
  return map[ext] ?? "application/octet-stream";
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log("Connecting to MongoDB...");
  const client = new MongoClient(DATABASE_URI as string);
  await client.connect();

  // Payload stores collections under the database inferred from the URI.
  // The mongoose adapter uses the db name in the URI; we read it from there.
  const dbName = new URL(DATABASE_URI as string).pathname.replace(/^\//, "").split("?")[0];
  const db: Db = client.db(dbName || undefined);
  const mediaCollection: Collection<Document> = db.collection("media");

  console.log(`Connected. Database: ${db.databaseName}`);

  const documents = await mediaCollection.find({}).toArray();
  console.log(`Found ${documents.length} media documents.`);

  let skipped = 0;
  let migrated = 0;
  let errors = 0;

  for (const doc of documents) {
    const filename: string = doc.filename as string;
    if (!filename) {
      console.warn(`  [SKIP] Document ${doc._id} has no filename — skipping`);
      skipped++;
      continue;
    }

    // Skip if already migrated (url already points to Vercel Blob)
    if (
      typeof doc.url === "string" &&
      doc.url.startsWith("https://") &&
      doc.url.includes("blob.vercel-storage.com")
    ) {
      console.log(`  [SKIP] ${filename} — already on Vercel Blob`);
      skipped++;
      continue;
    }

    const originalPath = path.join(MEDIA_DIR, filename);
    if (!fs.existsSync(originalPath)) {
      console.warn(`  [WARN] ${filename} — file not found on disk, skipping`);
      skipped++;
      continue;
    }

    console.log(`  [UPLOAD] ${filename}`);

    try {
      // Upload original
      const originalUrl = await uploadToBlob(originalPath, filename);
      console.log(`    original → ${originalUrl}`);

      // Upload derivatives and collect their URLs
      const sizeUpdates: Record<string, Record<string, string>> = {};

      for (const [sizeName, suffix] of Object.entries(SIZE_SUFFIXES)) {
        const derivativeFilename = deriveDerivativeFilename(filename, suffix);
        if (!derivativeFilename) {
          console.log(`    ${sizeName} — no derivative file found, skipping size`);
          continue;
        }

        const derivativePath = path.join(MEDIA_DIR, derivativeFilename);
        if (!fs.existsSync(derivativePath)) {
          console.log(`    ${sizeName} (${derivativeFilename}) — not on disk, skipping`);
          continue;
        }

        const derivativeUrl = await uploadToBlob(derivativePath, derivativeFilename);
        console.log(`    ${sizeName} → ${derivativeUrl}`);

        sizeUpdates[sizeName] = {
          url: derivativeUrl,
          filename: derivativeFilename,
        };
      }

      // Build the MongoDB $set payload
      const setPayload: Record<string, unknown> = {
        url: originalUrl,
      };

      // thumbnailURL is a top-level convenience field Payload sometimes writes
      if (sizeUpdates.thumbnail) {
        setPayload["thumbnailURL"] = sizeUpdates.thumbnail.url;
      }

      for (const [sizeName, fields] of Object.entries(sizeUpdates)) {
        setPayload[`sizes.${sizeName}.url`] = fields.url;
        setPayload[`sizes.${sizeName}.filename`] = fields.filename;
      }

      await mediaCollection.updateOne(
        { _id: doc._id },
        { $set: setPayload }
      );

      migrated++;
    } catch (err) {
      console.error(`  [ERROR] ${filename}:`, err instanceof Error ? err.message : err);
      errors++;
    }
  }

  await client.close();

  console.log("\n--- Migration complete ---");
  console.log(`  Migrated : ${migrated}`);
  console.log(`  Skipped  : ${skipped}`);
  console.log(`  Errors   : ${errors}`);

  if (errors > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
