import { describe, expect, it } from "vitest";

import { products } from "@/data/products";
import { productSchema, type Product } from "@/types/product";

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

describe("seed de produtos", () => {
  it("todo produto do seed passa no schema", () => {
    for (const p of products)
      expect(() => productSchema.parse(p)).not.toThrow();
  });

  it("nenhum produto real está liberado para venda antes da verificação", () => {
    for (const p of products) {
      if (!p.contentVerified) expect(isPurchasable(p)).toBe(false);
    }
  });

  it("produto publicado tem conteúdo verificado e foto própria", () => {
    for (const p of products) {
      if (p.publicationStatus !== "published") continue;
      expect(p.contentVerified, p.slug).toBe(true);
      expect(p.images.length, p.slug).toBeGreaterThan(0);
    }
  });

  it("slugs são únicos", () => {
    const slugs = products.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
