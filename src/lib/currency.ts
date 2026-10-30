const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export const PRICE_PENDING_LABEL = "Preço em definição";

export function formatPrice(cents: number | null): string {
  if (cents === null) return PRICE_PENDING_LABEL;
  return brl.format(cents / 100);
}
