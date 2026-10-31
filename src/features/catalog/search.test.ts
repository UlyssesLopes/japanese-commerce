import { describe, expect, it } from "vitest";

import { fixtureProduct } from "./fixtures";
import { normalize, searchProducts } from "./search";

const shampoo = {
  ...fixtureProduct,
  id: "a",
  slug: "a",
  brand: "&honey",
  name: "Rich Luxe Repair Shampoo",
  category: "cabelos" as const,
};
const serum = {
  ...fixtureProduct,
  id: "b",
  slug: "b",
  brand: "anciente",
  name: "Vitamin C + Glutathione Sérum Facial",
  category: "skincare" as const,
  description: "Deixa a pele mais iluminada.",
};
const lotion = {
  ...fixtureProduct,
  id: "c",
  slug: "c",
  brand: "IHADA",
  name: "Very Moist Lotion Refil",
  category: "skincare" as const,
  description: "Loção hidratante com textura leve.",
};
const all = [shampoo, serum, lotion];

describe("normalize", () => {
  it("tira acentos e caixa", () => {
    expect(normalize("Loção SÉRUM")).toBe("locao serum");
  });
});

describe("searchProducts", () => {
  it("busca vazia não devolve nada", () => {
    expect(searchProducts(all, "   ")).toEqual([]);
  });

  it("acha pela marca", () => {
    expect(searchProducts(all, "honey")).toEqual([shampoo]);
  });

  it("acha pela categoria", () => {
    expect(searchProducts(all, "skincare").map((p) => p.id)).toEqual([
      "b",
      "c",
    ]);
  });

  it("ignora acentos", () => {
    expect(searchProducts(all, "serum")).toEqual([serum]);
    expect(searchProducts(all, "locao")).toEqual([lotion]);
  });

  it("exige todas as palavras", () => {
    expect(searchProducts(all, "vitamin c")).toEqual([serum]);
    expect(searchProducts(all, "vitamin shampoo")).toEqual([]);
  });

  it("nome e marca vêm antes da descrição", () => {
    const byDescription = { ...shampoo, id: "d", description: "Tem lotion." };
    expect(searchProducts([byDescription, lotion], "lotion")[0]).toBe(lotion);
  });
});
