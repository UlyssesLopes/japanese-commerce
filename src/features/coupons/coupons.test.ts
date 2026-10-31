import { describe, expect, it } from "vitest";

import { formatPrice } from "@/lib/currency";
import { couponSchema, type Coupon } from "@/types/coupon";

import {
  applyCoupon,
  checkCoupon,
  couponLabel,
  normalizeCode,
} from "./coupons";

const percent: Coupon = {
  code: "DEZ",
  type: "percent",
  value: 10,
  active: true,
};
const fixed: Coupon = {
  code: "VINTE",
  type: "fixed",
  value: 2000,
  minSubtotalCents: 10000,
  active: true,
};
const all: Coupon[] = [
  percent,
  fixed,
  { code: "OFF", type: "percent", value: 5, active: false },
  {
    code: "NATAL",
    type: "percent",
    value: 15,
    active: true,
    startsAt: "2026-12-01",
    endsAt: "2026-12-25",
  },
];

describe("normalizeCode", () => {
  it("ignora caixa e espaços", () => {
    expect(normalizeCode("  de z ")).toBe("DEZ");
  });
});

describe("checkCoupon", () => {
  it("aceita um cupom ativo", () => {
    expect(checkCoupon(all, "dez", "2026-10-31")).toEqual({
      ok: true,
      coupon: percent,
    });
  });

  it.each([
    ["inexistente", "NADA", "2026-10-31", "Cupom não encontrado."],
    ["desativado", "OFF", "2026-10-31", "Cupom não encontrado."],
    [
      "antes do início",
      "NATAL",
      "2026-11-30",
      "Este cupom ainda não está valendo.",
    ],
    ["depois do fim", "NATAL", "2026-12-26", "Este cupom expirou."],
  ])("recusa cupom %s", (_, code, today, reason) => {
    expect(checkCoupon(all, code, today)).toEqual({ ok: false, reason });
  });

  it("vale no primeiro e no último dia", () => {
    expect(checkCoupon(all, "NATAL", "2026-12-01").ok).toBe(true);
    expect(checkCoupon(all, "NATAL", "2026-12-25").ok).toBe(true);
  });
});

describe("applyCoupon", () => {
  it("percentual arredonda para baixo, em centavos inteiros", () => {
    expect(applyCoupon(24990, percent)).toEqual({
      discountCents: 2499,
      totalCents: 22491,
    });
    expect(applyCoupon(999, percent).discountCents).toBe(99);
  });

  it("valor fixo respeita o mínimo", () => {
    expect(applyCoupon(15000, fixed)).toEqual({
      discountCents: 2000,
      totalCents: 13000,
    });
    expect(applyCoupon(9990, fixed)).toMatchObject({
      discountCents: 0,
      totalCents: 9990,
      blockedReason: `Vale para compras a partir de ${formatPrice(10000)}.`,
    });
  });

  it("nunca deixa o total negativo", () => {
    const big: Coupon = {
      code: "GRANDE",
      type: "fixed",
      value: 99999,
      active: true,
    };
    expect(applyCoupon(5000, big)).toEqual({
      discountCents: 5000,
      totalCents: 0,
    });
  });

  it("sem cupom, não muda nada", () => {
    expect(applyCoupon(5000, null)).toEqual({
      discountCents: 0,
      totalCents: 5000,
    });
  });
});

describe("couponLabel", () => {
  it("descreve percentual e valor fixo", () => {
    expect(couponLabel(percent)).toBe("10% de desconto");
    expect(couponLabel(fixed)).toBe(`${formatPrice(2000)} de desconto`);
  });
});

describe("couponSchema", () => {
  it("recusa percentual acima de 100 e código com espaço", () => {
    expect(couponSchema.safeParse({ ...percent, value: 120 }).success).toBe(
      false,
    );
    expect(couponSchema.safeParse({ ...percent, code: "DE Z" }).success).toBe(
      false,
    );
  });
});
