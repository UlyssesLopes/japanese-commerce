import type { Product, ProductCategory } from "@/types/product";

/** Ordem e nomes das categorias como aparecem no site. */
export const categories: { slug: ProductCategory; label: string }[] = [
  { slug: "cabelos", label: "Cabelos" },
  { slug: "skincare", label: "Skincare" },
  { slug: "maquiagem", label: "Maquiagem" },
  { slug: "kits", label: "Kits" },
];

/** Categoria principal primeiro, depois as outras em que o produto aparece. */
export function productCategories(
  product: Pick<Product, "category" | "extraCategories">,
): ProductCategory[] {
  const extra = (product.extraCategories ?? []).filter(
    (c) => c !== product.category,
  );
  return [product.category, ...new Set(extra)];
}

/** O produto aparece nesta categoria (principal ou extra)? */
export function inCategory(
  product: Pick<Product, "category" | "extraCategories">,
  category: ProductCategory,
): boolean {
  return productCategories(product).includes(category);
}
