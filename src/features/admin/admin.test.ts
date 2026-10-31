import { describe, expect, it } from "vitest";

import { isPurchasable } from "@/features/catalog/eligibility";
import { fixtureProduct, fixtureStates } from "@/features/catalog/fixtures";

import { couponStatus } from "./coupon-status";
import { formatMoneyInput, parseMoney } from "./money";
import { missingForSale } from "./readiness";
import { slugify } from "./slug";

describe("parseMoney", () => {
  it.each([
    ["249,90", 24990],
    ["R$ 249,90", 24990],
    ["249.90", 24990],
    ["79", 7900],
    ["54,9", 5490],
    ["1.249,90", 124990],
    ["1249,90", 124990],
    ["0", 0],
  ])("%s → %i centavos", (input, cents) => {
    expect(parseMoney(input)).toEqual({ ok: true, cents });
  });

  it("vazio é preço em definição", () => {
    expect(parseMoney("  ")).toEqual({ ok: true, cents: null });
  });

  it.each(["abc", "12,345", "-10", "1,2,3"])("recusa %s", (input) => {
    expect(parseMoney(input)).toEqual({ ok: false });
  });

  it("volta para o campo sem perder centavos", () => {
    expect(formatMoneyInput(24990)).toBe("249,90");
    expect(formatMoneyInput(5405)).toBe("54,05");
    expect(formatMoneyInput(null)).toBe("");
    expect(parseMoney(formatMoneyInput(8890))).toEqual({
      ok: true,
      cents: 8890,
    });
  });
});

describe("slugify", () => {
  it("tira acentos, símbolos e espaços", () => {
    expect(slugify("Devé Cleansing Oil")).toBe("deve-cleansing-oil");
    expect(slugify("&honey Rich Luxe")).toBe("and-honey-rich-luxe");
    expect(slugify("  Kit  Verão!! ")).toBe("kit-verao");
  });
});

describe("missingForSale", () => {
  it("vazio exatamente quando isPurchasable", () => {
    for (const { product } of fixtureStates) {
      expect(missingForSale(product).length === 0).toBe(isPurchasable(product));
    }
  });

  it("diz o que falta em palavras", () => {
    expect(
      missingForSale({
        ...fixtureProduct,
        priceCents: null,
        purchaseEnabled: false,
        publicationStatus: "preview",
      }),
    ).toEqual(["Sem preço", "Não publicado", "Venda não liberada"]);
  });
});

describe("couponStatus", () => {
  const natal = {
    code: "NATAL",
    type: "percent" as const,
    value: 15,
    active: true,
    startsAt: "2026-12-01",
    endsAt: "2026-12-25",
  };

  it("datas inclusivas", () => {
    expect(couponStatus(natal, "2026-11-30")).toBe("scheduled");
    expect(couponStatus(natal, "2026-12-01")).toBe("active");
    expect(couponStatus(natal, "2026-12-25")).toBe("active");
    expect(couponStatus(natal, "2026-12-26")).toBe("expired");
  });

  it("desativado vence as datas", () => {
    expect(couponStatus({ ...natal, active: false }, "2026-12-10")).toBe("off");
  });
});
