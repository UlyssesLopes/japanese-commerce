import type { ProductImage } from "@/types/product";

/** Configurações da loja (API `/api/settings`, editadas no backoffice). */
export type StoreSettings = {
  deliveryArea?: string;
  pickupLocation?: string;
  deliveryLeadTime?: string;
  /** Pedido a partir deste valor (já com desconto) tem entrega grátis. */
  freeDeliveryFromCents?: number;
  /** Taxa de entrega, em % do pedido, abaixo do valor do frete grátis. */
  deliveryFeePercent: number;
  sellerName?: string;
  sellerBio?: string;
  sellerPhoto?: ProductImage;
};

export type DeliveryMethod = "entrega" | "retirada";

export type DeliveryQuote = {
  feeCents: number;
  /** Quanto falta para a entrega sair grátis (só quando há taxa). */
  missingForFreeCents?: number;
};

/**
 * Taxa de entrega em centavos inteiros. Retirada não paga. Entrega paga a %
 * do pedido (arredondada ao centavo) até o valor do frete grátis.
 */
export function quoteDelivery(
  totalCents: number,
  method: DeliveryMethod,
  settings: Pick<StoreSettings, "freeDeliveryFromCents" | "deliveryFeePercent">,
): DeliveryQuote {
  if (method === "retirada" || totalCents <= 0) return { feeCents: 0 };
  const free = settings.freeDeliveryFromCents;
  if (free !== undefined && totalCents >= free) return { feeCents: 0 };
  const feeCents = Math.round((totalCents * settings.deliveryFeePercent) / 100);
  return feeCents > 0 && free !== undefined
    ? { feeCents, missingForFreeCents: free - totalCents }
    : { feeCents };
}
