import { describe, expect, it } from "vitest";

import { stockBadge } from "./stock-badge";

describe("stockBadge", () => {
  it("desligado no backoffice, não mostra nada", () => {
    expect(
      stockBadge({ lowStockBadge: false, availableQuantity: 1 }),
    ).toBeNull();
    expect(stockBadge({ availableQuantity: 1 })).toBeNull();
  });

  it("o texto segue o estoque disponível", () => {
    expect(stockBadge({ lowStockBadge: true, availableQuantity: 1 })).toBe(
      "Última unidade",
    );
    expect(stockBadge({ lowStockBadge: true, availableQuantity: 3 })).toBe(
      "Últimas unidades",
    );
  });

  it("sem unidade disponível, some", () => {
    expect(
      stockBadge({ lowStockBadge: true, availableQuantity: 0 }),
    ).toBeNull();
  });
});
