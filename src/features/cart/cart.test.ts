import { describe, expect, it } from "vitest";

import { fixtureProduct } from "@/features/catalog/fixtures";

import { addItems, maxQuantity, resolveCart, toOrderLines } from "./cart";

const a = { ...fixtureProduct, id: "a", slug: "a", priceCents: 5000 };
const b = {
  ...fixtureProduct,
  id: "b",
  slug: "b",
  priceCents: 2500,
  inventoryQuantity: 3,
  availableQuantity: 3,
};
const draft = {
  ...fixtureProduct,
  id: "c",
  slug: "c",
  publicationStatus: "draft" as const,
};

describe("maxQuantity", () => {
  it("é o disponível para itens à venda e zero para os outros", () => {
    expect(maxQuantity(b)).toBe(3);
    expect(maxQuantity(draft)).toBe(0);
  });
});

describe("resolveCart", () => {
  it("calcula linhas, subtotal e contagem a partir do catálogo", () => {
    const cart = resolveCart(
      [
        { slug: "a", quantity: 1 },
        { slug: "b", quantity: 2 },
      ],
      [a, b],
    );
    expect(cart.subtotalCents).toBe(10000);
    expect(cart.count).toBe(3);
    expect(cart.removed).toEqual([]);
  });

  it("remove itens que sumiram ou saíram de venda", () => {
    const cart = resolveCart(
      [
        { slug: "sumiu", quantity: 1 },
        { slug: "c", quantity: 1 },
        { slug: "a", quantity: 1 },
      ],
      [a, draft],
    );
    expect(cart.lines.map((l) => l.product.slug)).toEqual(["a"]);
    expect(cart.removed).toEqual(["sumiu", "c"]);
  });

  it("limita a quantidade ao estoque disponível", () => {
    const cart = resolveCart([{ slug: "b", quantity: 9 }], [b]);
    expect(cart.lines[0].quantity).toBe(3);
    expect(cart.adjusted).toEqual(["b"]);
  });

  it("corrige quantidades inválidas para pelo menos 1", () => {
    const cart = resolveCart([{ slug: "b", quantity: 0 }], [b]);
    expect(cart.lines[0].quantity).toBe(1);
  });

  it("usa o preço do catálogo, não o salvo", () => {
    const cart = resolveCart(
      [{ slug: "a", quantity: 1 }],
      [{ ...a, priceCents: 7000 }],
    );
    expect(cart.subtotalCents).toBe(7000);
  });
});

describe("toOrderLines", () => {
  it("junta nome e variante para a mensagem", () => {
    const cart = resolveCart(
      [{ slug: "a", quantity: 1 }],
      [{ ...a, subtitle: "Refil" }],
    );
    expect(toOrderLines(cart.lines)).toEqual([
      {
        brand: "Marca de exemplo",
        name: "Produto de exemplo Refil",
        quantity: 1,
        unitPriceCents: 5000,
      },
    ]);
  });
});

describe("addItems", () => {
  const a = { ...fixtureProduct, slug: "a" };
  const b = { ...fixtureProduct, slug: "b" };
  const esgotado = { ...fixtureProduct, slug: "c", availableQuantity: 0 };

  it("junta o que falta, sem mexer no que já está na sacola", () => {
    expect(addItems([{ slug: "a", quantity: 2 }], [a, b, b, esgotado])).toEqual(
      [
        { slug: "a", quantity: 2 },
        { slug: "b", quantity: 1 },
      ],
    );
  });
});
