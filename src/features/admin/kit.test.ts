import { describe, expect, it } from "vitest";

import { kitAvailability, kitItemsTotal } from "./kit";

const products = new Map(
  [
    { id: "a", name: "Máscara", priceCents: 19990, availableQuantity: 3 },
    { id: "b", name: "Pad", priceCents: 24990, availableQuantity: 1 },
    { id: "c", name: "Sem preço", priceCents: null, availableQuantity: 2 },
  ].map((p) => [p.id, p]),
);

describe("kitAvailability", () => {
  it("menor número de kits completos e quem limita", () => {
    const result = kitAvailability(
      [
        { productId: "a", quantity: 2 },
        { productId: "b", quantity: 1 },
      ],
      products,
    );
    expect(result.quantity).toBe(1);
    expect(result.limitedBy?.id).toBe("a");
  });

  it("kit vazio ou com produto que sumiu não vende", () => {
    expect(kitAvailability([], products).quantity).toBe(0);
    expect(
      kitAvailability([{ productId: "x", quantity: 1 }], products).quantity,
    ).toBe(0);
  });
});

describe("kitItemsTotal", () => {
  it("soma preço vezes quantidade", () => {
    expect(
      kitItemsTotal(
        [
          { productId: "a", quantity: 2 },
          { productId: "b", quantity: 1 },
        ],
        products,
      ),
    ).toBe(64970);
  });

  it("nula se algum item está sem preço", () => {
    expect(
      kitItemsTotal([{ productId: "c", quantity: 1 }], products),
    ).toBeNull();
  });
});
