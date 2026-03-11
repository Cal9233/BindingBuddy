import { getPayload } from "payload";
import config from "@payload-config";
import type { Product } from "@/types/product";

function resolveImageUrl(img: unknown): string {
  if (!img) return "/images/placeholder.jpg";
  if (typeof img === "string") return img;
  const media = img as Record<string, unknown>;
  const sizes = media.sizes as Record<string, { url?: string }> | undefined;
  return sizes?.card?.url || (media.url as string) || "/images/placeholder.jpg";
}

function normalizeProduct(doc: Record<string, unknown>): Product {
  const images = doc.images as Array<{ image: unknown }> | undefined;
  return {
    id: String(doc.id),
    slug: doc.slug as string,
    name: doc.name as string,
    description: (doc.description as string) || "",
    price: doc.price as number,
    image: resolveImageUrl(doc.image),
    images: images?.map((i) => resolveImageUrl(i.image)) || [],
    category: doc.category as Product["category"],
    featured: (doc.featured as boolean) || false,
    stock: (doc.stock as number) ?? 0,
    pokemon: (doc.pokemon as string) || undefined,
    binderType: (doc.binderType as string) || undefined,
    variants: (doc.variants as Product["variants"]) || undefined,
    badge: (doc.badge as Product["badge"]) || undefined,
  };
}

async function getPayloadClient() {
  return getPayload({ config });
}

export async function getAllProducts(): Promise<Product[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "products",
    limit: 200,
    sort: "-createdAt",
  });
  return result.docs.map((doc) => normalizeProduct(doc as unknown as Record<string, unknown>));
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "products",
    where: { featured: { equals: true } },
    limit: 20,
  });
  return result.docs.map((doc) => normalizeProduct(doc as unknown as Record<string, unknown>));
}

export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "products",
    where: { slug: { equals: slug } },
    limit: 1,
  });
  const doc = result.docs[0];
  return doc
    ? normalizeProduct(doc as unknown as Record<string, unknown>)
    : undefined;
}

export async function getProductsByCategory(
  category: Product["category"]
): Promise<Product[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "products",
    where: { category: { equals: category } },
    limit: 100,
  });
  return result.docs.map((doc) => normalizeProduct(doc as unknown as Record<string, unknown>));
}

export { formatPrice } from "./format-price";
