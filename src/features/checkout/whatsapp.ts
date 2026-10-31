import { formatPrice } from "@/lib/currency";

export type WhatsAppOrderLine = {
  brand: string;
  name: string;
  quantity: number;
  unitPriceCents: number;
};

export type WhatsAppCoupon = { code: string; discountCents: number };

/** Entrega escolhida na sacola. `place` é a região ou o local de retirada. */
export type WhatsAppDelivery = {
  method: "entrega" | "retirada";
  place?: string;
  feeCents: number;
};

function deliveryLine(d: WhatsAppDelivery): string {
  const where = d.place ? ` (${d.place})` : "";
  if (d.method === "retirada") return `Retirada${where}: sem custo`;
  return `Entrega em mãos${where}: ${
    d.feeCents > 0 ? formatPrice(d.feeCents) : "grátis"
  }`;
}

/**
 * Monta o texto que o cliente envia pelo WhatsApp. Não contém dados
 * pessoais: nome, endereço e pagamento são combinados na conversa.
 */
export function buildOrderMessage(
  lines: WhatsAppOrderLine[],
  coupon?: WhatsAppCoupon,
  delivery?: WhatsAppDelivery,
): string {
  const items = lines.map(
    (l) =>
      `• ${l.quantity}x ${l.brand} ${l.name} — ${formatPrice(l.unitPriceCents * l.quantity)}`,
  );
  const subtotal = lines.reduce(
    (sum, l) => sum + l.unitPriceCents * l.quantity,
    0,
  );
  const discount = coupon && coupon.discountCents > 0 ? coupon : undefined;
  const total =
    subtotal - (discount?.discountCents ?? 0) + (delivery?.feeCents ?? 0);

  return [
    "Olá! Tenho interesse nestes produtos:",
    "",
    ...items,
    "",
    `Subtotal: ${formatPrice(subtotal)}`,
    ...(discount
      ? [`Cupom ${discount.code}: −${formatPrice(discount.discountCents)}`]
      : []),
    ...(delivery ? [deliveryLine(delivery)] : []),
    ...(discount || delivery ? [`Total: ${formatPrice(total)}`] : []),
    "",
    delivery
      ? "Podemos combinar o pagamento e o dia?"
      : "Podemos combinar entrega e pagamento?",
  ].join("\n");
}

export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  const digits = phoneNumber.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
