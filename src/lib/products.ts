import { getPayload } from "payload";
import config from "@payload-config";

export type PayloadProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  description?: string | null;
  image?: { url?: string | null } | string | null;
  images?: Array<{ image?: { url?: string | null } | string | null }> | null;
  category: "engraved-binder" | "engraving-only";
  featured?: boolean | null;
  stock?: number | null;
  pokemon?: string | null;
  binderType?: string | null;
  badge?: "New" | "Limited" | "Best Seller" | null;
  variants?: Array<{ label: string; stock?: number | null }> | null;
  inStock?: boolean | null;
};

function resolveImageUrl(
  field: { url?: string | null } | string | null | undefined
): string {
  if (!field) return "/images/placeholder.jpg";
  if (typeof field === "string") return field;
  return field.url || "/images/placeholder.jpg";
}

export function normalizeProduct(doc: PayloadProduct) {
  return {
    id: doc.id,
    slug: doc.slug,
    name: doc.name,
    description: doc.description || "",
    price: doc.price,
    image: resolveImageUrl(doc.image),
    images: doc.images?.map((i) => resolveImageUrl(i.image)) ?? [],
    category: doc.category,
    featured: doc.featured ?? false,
    stock: doc.stock ?? 0,
    pokemon: doc.pokemon ?? undefined,
    binderType: doc.binderType ?? undefined,
    badge: doc.badge ?? undefined,
    variants: doc.variants ?? undefined,
    inStock: doc.inStock ?? true,
  };
}

export type Product = ReturnType<typeof normalizeProduct>;

async function getPayloadClient() {
  return getPayload({ config });
}

export async function getAllProducts(): Promise<Product[]> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "products",
    limit: 100,
    sort: "name",
  });
  return docs.map((d) => normalizeProduct(d as unknown as PayloadProduct));
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "products",
    where: { featured: { equals: true } },
    limit: 20,
  });
  return docs.map((d) => normalizeProduct(d as unknown as PayloadProduct));
}

export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "products",
    where: { slug: { equals: slug } },
    limit: 1,
  });
  if (docs.length === 0) return undefined;
  return normalizeProduct(docs[0] as unknown as PayloadProduct);
}

export async function getProductsByCategory(
  category: Product["category"]
): Promise<Product[]> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "products",
    where: { category: { equals: category } },
    limit: 100,
  });
  return docs.map((d) => normalizeProduct(d as unknown as PayloadProduct));
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
