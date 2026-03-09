export interface ProductVariant {
  id: string;
  name: string;
  priceModifier?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  category: "engraved-binder" | "engraving-only";
  featured: boolean;
  stock: number;
  pokemon?: string;
  binderType?: string;
  variants?: ProductVariant[];
  badge?: "New" | "Limited" | "Best Seller";
}
