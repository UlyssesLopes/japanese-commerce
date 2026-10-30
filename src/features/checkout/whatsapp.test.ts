import { describe, expect, it } from "vitest";

import { buildOrderMessage, buildWhatsAppUrl } from "./whatsapp";

describe("buildOrderMessage", () => {
  const message = buildOrderMessage([
    { brand: "IHADA", name: "Lotion", quantity: 1, unitPriceCents: 8900 },
    { brand: "&honey", name: "Shampoo", quantity: 2, unitPriceCents: 5000 },
  ]);

  it("lista cada item com quantidade e total da linha", () => {
    expect(message).toContain("• 1x IHADA Lotion — R$ 89,00");
    expect(message).toContain("• 2x &honey Shampoo — R$ 100,00");
  });

  it("inclui o subtotal em centavos inteiros", () => {
    expect(message).toContain("Subtotal: R$ 189,00");
  });
});

describe("buildWhatsAppUrl", () => {
  it("usa só dígitos no número e codifica o texto", () => {
    const url = buildWhatsAppUrl("+55 (11) 99999-9999", "Olá & tchau");
    expect(url).toBe("https://wa.me/5511999999999?text=Ol%C3%A1%20%26%20tchau");
  });
});
