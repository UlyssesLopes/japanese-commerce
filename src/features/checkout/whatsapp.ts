import { formatPrice } from "@/lib/currency";

export type WhatsAppOrderLine = {
  brand: string;
  name: string;
  quantity: number;
  unitPriceCents: number;
};

/**
 * Monta o texto que o cliente envia pelo WhatsApp. Não contém dados
 * pessoais: nome, endereço e pagamento são combinados na conversa.
 */
export function buildOrderMessage(lines: WhatsAppOrderLine[]): string {
  const items = lines.map(
    (l) =>
      `• ${l.quantity}x ${l.brand} ${l.name} — ${formatPrice(l.unitPriceCents * l.quantity)}`,
  );
  const subtotal = lines.reduce(
    (sum, l) => sum + l.unitPriceCents * l.quantity,
    0,
  );

  return [
    "Olá! Tenho interesse nestes produtos:",
    "",
    ...items,
    "",
    `Subtotal: ${formatPrice(subtotal)}`,
    "",
    "Podemos combinar entrega e pagamento?",
  ].join("\n");
}

export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  const digits = phoneNumber.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
