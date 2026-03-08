export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number; // in cents
  image: string;
  category: "engraved-binder" | "engraving-only";
  featured: boolean;
  stock: number; // -1 = unlimited
  pokemon?: string;    // e.g. "Charizard" — shown on card and detail page
  binderType?: string; // e.g. "9-Pocket", "Zipper" — for engraved-binder products
}
