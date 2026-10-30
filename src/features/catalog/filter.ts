import {
  productCategorySchema,
  type Product,
  type ProductCategory,
} from "@/types/product";

/** Lê `?categoria=` da URL. Valor ausente ou desconhecido = todas. */
export function parseCategory(
  value: string | null | undefined,
): ProductCategory | null {
  const parsed = productCategorySchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export function filterByCategory(
  products: Product[],
  category: ProductCategory | null,
): Product[] {
  return category ? products.filter((p) => p.category === category) : products;
}

export function countByCategory(
  products: Product[],
): Record<ProductCategory, number> {
  const counts: Record<ProductCategory, number> = {
    cabelos: 0,
    skincare: 0,
    maquiagem: 0,
    kits: 0,
  };
  for (const p of products) counts[p.category] += 1;
  return counts;
}
