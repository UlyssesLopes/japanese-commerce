import type { Product } from "@/types/product";

/**
 * O que falta para o produto poder entrar na sacola, em palavras, para o
 * backoffice. Lista vazia ⇔ `isPurchasable()` (testado junto). Quem decide
 * a venda continua sendo só `isPurchasable()`.
 */
export function missingForSale(product: Product): string[] {
  const missing: string[] = [];
  if (product.priceCents === null) missing.push("Sem preço");
  if (product.publicationStatus !== "published") missing.push("Não publicado");
  if (product.availableQuantity === 0) missing.push("Sem unidade disponível");
  if (product.availableQuantity > product.inventoryQuantity)
    missing.push("Disponível acima do estoque");
  if (!product.purchaseEnabled) missing.push("Venda não liberada");
  return missing;
}
