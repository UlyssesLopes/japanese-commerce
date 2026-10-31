import { describe, expect, it } from "vitest";

import type { Product } from "@/types/product";

import { isPurchasable, isVisible } from "./eligibility";

const purchasable: Product = {
  id: "test-001",
  slug: "produto-teste",
  sku: "TEST-001",
  brand: "Marca Teste",
  name: "Produto Teste",
  category: "skincare",
  images: [],
  priceCents: 9900,
  inventoryQuantity: 1,
  availableQuantity: 1,
  contentVerified: true,
  publicationStatus: "published",
  purchaseEnabled: true,
  featured: false,
};

describe("isPurchasable", () => {
  it("aceita um produto publicado, liberado, com preço e estoque", () => {
    expect(isPurchasable(purchasable)).toBe(true);
  });

  it.each([
    ["sem preço", { priceCents: null }],
    ["sem liberação manual", { purchaseEnabled: false }],
    ["em preview", { publicationStatus: "preview" as const }],
    ["sem unidades disponíveis", { availableQuantity: 0 }],
    ["disponível acima do estoque físico", { availableQuantity: 2 }],
  ])("recusa produto %s", (_, override) => {
    expect(isPurchasable({ ...purchasable, ...override })).toBe(false);
  });
});

describe("isVisible", () => {
  it("esconde rascunhos", () => {
    expect(isVisible({ ...purchasable, publicationStatus: "draft" })).toBe(
      false,
    );
  });

  it("mostra preview e publicado", () => {
    expect(isVisible({ ...purchasable, publicationStatus: "preview" })).toBe(
      true,
    );
    expect(isVisible(purchasable)).toBe(true);
  });

  it("mostra rascunhos só quando pedido explicitamente", () => {
    const draft = { ...purchasable, publicationStatus: "draft" as const };
    expect(isVisible(draft, { includeDrafts: true })).toBe(true);
    expect(isVisible(draft, { includeDrafts: false })).toBe(false);
  });
});
