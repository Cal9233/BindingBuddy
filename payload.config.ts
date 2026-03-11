import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";
import { Users } from "./src/collections/Users";
import { Media } from "./src/collections/Media";
import { Products } from "./src/collections/Products";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || "",
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "",
  }),
  editor: lexicalEditor(),
  sharp,
  collections: [Users, Media, Products],
  admin: {
    user: Users.slug,
    theme: "dark",
    meta: {
      titleSuffix: " | Binding Buddy",
    },
    components: {
      graphics: {
        Logo: "/src/components/admin/Logo",
        Icon: "/src/components/admin/Icon",
      },
      beforeLogin: ["/src/components/admin/BeforeLogin"],
      beforeDashboard: ["/src/components/admin/BeforeDashboard"],
      providers: ["/src/components/admin/TOTPProvider"],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  typescript: {
    outputFile: path.resolve(dirname, "src/payload-types.ts"),
  },
});
