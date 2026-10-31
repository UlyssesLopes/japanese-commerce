import type { Product } from "@/types/product";

/**
 * Aviso "Últimas unidades" na foto. Só aparece quando o dono marca o produto
 * no backoffice. O texto é sempre o mesmo, de propósito: o cliente não deve
 * saber se há 1 ou mais unidades. Some quando o produto esgota.
 */
export function stockBadge(
  product: Pick<Product, "lowStockBadge" | "availableQuantity">,
): string | null {
  if (!product.lowStockBadge || product.availableQuantity <= 0) return null;
  return "Últimas unidades";
}
