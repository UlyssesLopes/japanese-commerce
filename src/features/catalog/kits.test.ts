import { describe, expect, it } from "vitest";

import { productSchema } from "@/types/product";

import { isPurchasable } from "./eligibility";
import { fixtureProduct } from "./fixtures";
import { kitToProduct, mergeCatalog, type ApiKit } from "./kits";

const kit: ApiKit = {
  id: "95a35272-6b96-4243-b3a8-054a6db2090a",
  slug: "kit-cabelo-e-pele",
  name: "Kit cabelo e pele",
  priceCents: 39990,
  availableQuantity: 1,
  publicationStatus: "published",
  purchaseEnabled: true,
  featured: false,
  images: [{ src: "/produtos/x.jpg", alt: "Kit", width: 800, height: 800 }],
  items: [
    { slug: "fino", brand: "fino", name: "Máscara", quantity: 2 },
    { slug: "pad", brand: "medicube", name: "Pad", quantity: 1 },
  ],
};

describe("kitToProduct", () => {
  it("vira um produto válido da categoria kits", () => {
    const product = kitToProduct(kit);
    expect(() => productSchema.parse(product)).not.toThrow();
    expect(product).toMatchObject({
      id: "kit-95a35272-6b96-4243-b3a8-054a6db2090a",
      category: "kits",
      priceCents: 39990,
      availableQuantity: 1,
      inventoryQuantity: 1,
      kitItems: [
        { slug: "fino", quantity: 2 },
        { slug: "pad", quantity: 1 },
      ],
    });
  });

  it("segue as regras de venda de qualquer produto", () => {
    expect(isPurchasable(kitToProduct(kit))).toBe(true);
    expect(isPurchasable(kitToProduct({ ...kit, availableQuantity: 0 }))).toBe(
      false,
    );
    const semPreco = kitToProduct({ ...kit, priceCents: undefined });
    expect(semPreco.priceCents).toBeNull();
    expect(isPurchasable(semPreco)).toBe(false);
  });
});

describe("mergeCatalog", () => {
  it("produto vence kit com o mesmo endereço", () => {
    const product = { ...fixtureProduct, slug: "kit-cabelo-e-pele" };
    const merged = mergeCatalog([product], [kitToProduct(kit)]);
    expect(merged).toEqual([product]);
  });
});
