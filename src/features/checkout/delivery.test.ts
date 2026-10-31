import { describe, expect, it } from "vitest";

import { quoteDelivery } from "./delivery";

const settings = { freeDeliveryFromCents: 20000, deliveryFeePercent: 5 };

describe("quoteDelivery", () => {
  it("retirada não paga", () => {
    expect(quoteDelivery(9990, "retirada", settings)).toEqual({ feeCents: 0 });
  });

  it("entrega abaixo do frete grátis paga 5%, arredondado ao centavo", () => {
    // 5% de R$ 139,90 = R$ 6,995 → R$ 7,00
    expect(quoteDelivery(13990, "entrega", settings)).toEqual({
      feeCents: 700,
      missingForFreeCents: 6010,
    });
  });

  it("a partir do valor do frete grátis, entrega sai de graça", () => {
    expect(quoteDelivery(20000, "entrega", settings)).toEqual({ feeCents: 0 });
    expect(quoteDelivery(24990, "entrega", settings)).toEqual({ feeCents: 0 });
  });

  it("sem valor de frete grátis definido, sempre cobra a taxa", () => {
    expect(quoteDelivery(99990, "entrega", { deliveryFeePercent: 5 })).toEqual({
      feeCents: 5000,
    });
  });

  it("taxa zero ou sacola vazia não cobram nada", () => {
    expect(quoteDelivery(13990, "entrega", { deliveryFeePercent: 0 })).toEqual({
      feeCents: 0,
    });
    expect(quoteDelivery(0, "entrega", settings)).toEqual({ feeCents: 0 });
  });
});
