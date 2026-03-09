export const dynamic = "force-dynamic";

import { getAllProducts } from "@/lib/products";
import ProductsGrid from "./ProductsGrid";

export default async function ProductsPage() {
  const products = await getAllProducts();

  return <ProductsGrid products={products} />;
}
