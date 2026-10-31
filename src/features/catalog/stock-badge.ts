import type { Product } from "@/types/product";

/**
 * Texto do aviso de poucas unidades na foto. Só aparece quando o dono liga o
 * aviso no backoffice, e o texto vem do estoque disponível de verdade: nunca
 * anuncia uma escassez que o estoque não confirma (regra 5 do CLAUDE.md).
 */
export function stockBadge(
  product: Pick<Product, "lowStockBadge" | "availableQuantity">,
): string | null {
  if (!product.lowStockBadge || product.availableQuantity <= 0) return null;
  return product.availableQuantity === 1
    ? "Última unidade"
    : "Últimas unidades";
}
