import { describe, expect, it } from "vitest";

import { formatPrice, PRICE_PENDING_LABEL } from "./currency";

describe("formatPrice", () => {
  it("formata centavos em reais no padrão brasileiro", () => {
    expect(formatPrice(123456)).toBe("R$ 1.234,56");
  });

  it("mostra o aviso quando o preço ainda não foi definido", () => {
    expect(formatPrice(null)).toBe(PRICE_PENDING_LABEL);
  });
});
