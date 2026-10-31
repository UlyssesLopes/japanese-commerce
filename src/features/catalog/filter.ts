import {
  productCategorySchema,
  type Product,
  type ProductCategory,
} from "@/types/product";

import { inCategory, productCategories } from "./categories";

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
  return category ? products.filter((p) => inCategory(p, category)) : products;
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
  for (const p of products)
    for (const c of productCategories(p)) counts[c] += 1;
  return counts;
}
