import type { Product } from "@/types/product";

/**
 * Contas do kit enquanto ele é montado no backoffice. Mesmas regras do
 * backend (KitRules.java), que é quem decide ao salvar.
 */

export type KitLine = { productId: string; quantity: number };

type Stock = Pick<Product, "id" | "name" | "priceCents" | "availableQuantity">;

/** Quantos kits completos dá para vender e qual produto limita. */
export function kitAvailability(
  lines: KitLine[],
  products: Map<string, Stock>,
): { quantity: number; limitedBy?: Stock } {
  let best: { quantity: number; limitedBy?: Stock } | undefined;
  for (const line of lines) {
    const product = products.get(line.productId);
    if (!product) return { quantity: 0 };
    const quantity = Math.floor(product.availableQuantity / line.quantity);
    if (!best || quantity < best.quantity)
      best = { quantity, limitedBy: product };
  }
  return best ?? { quantity: 0 };
}

/** Soma dos preços avulsos; null se algum item não tem preço. */
export function kitItemsTotal(
  lines: KitLine[],
  products: Map<string, Stock>,
): number | null {
  let total = 0;
  for (const line of lines) {
    const price = products.get(line.productId)?.priceCents;
    if (price === null || price === undefined) return null;
    total += price * line.quantity;
  }
  return total;
}
