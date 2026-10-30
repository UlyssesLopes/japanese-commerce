import { isPurchasable } from "@/features/catalog/eligibility";
import type { WhatsAppOrderLine } from "@/features/checkout/whatsapp";
import type { Product } from "@/types/product";

/** O que fica salvo no navegador: só o produto e a quantidade. */
export type CartItem = { slug: string; quantity: number };

export type CartLine = {
  product: Product;
  quantity: number;
  lineTotalCents: number;
};

export type ResolvedCart = {
  lines: CartLine[];
  /** Itens salvos que não podem mais ser comprados (saíram de venda). */
  removed: string[];
  /** Itens cuja quantidade foi reduzida ao estoque disponível. */
  adjusted: string[];
  subtotalCents: number;
  count: number;
};

/** Quantas unidades de um produto podem estar na sacola. */
export function maxQuantity(product: Product): number {
  return isPurchasable(product) ? product.availableQuantity : 0;
}

/**
 * Revalida a sacola salva contra o catálogo atual. Preço e disponibilidade
 * sempre vêm do catálogo, nunca do que foi salvo no navegador.
 */
export function resolveCart(
  items: CartItem[],
  catalog: Product[],
): ResolvedCart {
  const bySlug = new Map(catalog.map((p) => [p.slug, p]));
  const lines: CartLine[] = [];
  const removed: string[] = [];
  const adjusted: string[] = [];

  for (const item of items) {
    const product = bySlug.get(item.slug);
    const max = product ? maxQuantity(product) : 0;
    if (!product || max === 0 || product.priceCents === null) {
      removed.push(item.slug);
      continue;
    }
    const quantity = Math.min(Math.max(1, Math.floor(item.quantity)), max);
    if (quantity !== item.quantity) adjusted.push(item.slug);
    lines.push({
      product,
      quantity,
      lineTotalCents: product.priceCents * quantity,
    });
  }

  return {
    lines,
    removed,
    adjusted,
    subtotalCents: lines.reduce((sum, l) => sum + l.lineTotalCents, 0),
    count: lines.reduce((sum, l) => sum + l.quantity, 0),
  };
}

export function toOrderLines(lines: CartLine[]): WhatsAppOrderLine[] {
  return lines.map((l) => ({
    brand: l.product.brand,
    name: [l.product.name, l.product.subtitle].filter(Boolean).join(" "),
    quantity: l.quantity,
    // resolveCart já descartou itens sem preço.
    unitPriceCents: l.product.priceCents ?? 0,
  }));
}
