import { describe, expect, it } from "vitest";

import { countByCategory, filterByCategory, parseCategory } from "./filter";
import { fixtureProduct } from "./fixtures";

const hair = { ...fixtureProduct, id: "h", category: "cabelos" as const };
const skin = { ...fixtureProduct, id: "s", category: "skincare" as const };

describe("parseCategory", () => {
  it("aceita uma categoria conhecida", () => {
    expect(parseCategory("cabelos")).toBe("cabelos");
  });

  it.each([null, undefined, "", "perfumes", "CABELOS"])(
    "trata %s como todas",
    (value) => {
      expect(parseCategory(value)).toBeNull();
    },
  );
});

describe("filterByCategory", () => {
  it("sem categoria devolve tudo", () => {
    expect(filterByCategory([hair, skin], null)).toEqual([hair, skin]);
  });

  it("filtra pela categoria", () => {
    expect(filterByCategory([hair, skin], "skincare")).toEqual([skin]);
  });
});

describe("countByCategory", () => {
  it("conta cada categoria, inclusive as vazias", () => {
    expect(countByCategory([hair, hair, skin])).toEqual({
      cabelos: 2,
      skincare: 1,
      maquiagem: 0,
      kits: 0,
    });
  });
});

describe("produto em mais de uma categoria", () => {
  const kit = {
    ...hair,
    id: "kit",
    slug: "kit-tsubaki",
    category: "kits" as const,
    extraCategories: ["cabelos" as const],
  };

  it("aparece no filtro da principal e da extra", () => {
    expect(filterByCategory([kit, skin], "kits")).toEqual([kit]);
    expect(filterByCategory([kit, skin], "cabelos")).toEqual([kit]);
    expect(filterByCategory([kit, skin], "skincare")).toEqual([skin]);
  });

  it("conta em cada categoria em que aparece", () => {
    expect(countByCategory([kit, skin])).toEqual({
      cabelos: 1,
      skincare: 1,
      maquiagem: 0,
      kits: 1,
    });
  });

  it("extra igual à principal ou repetida não conta duas vezes", () => {
    const repetido = {
      ...kit,
      extraCategories: [
        "kits" as const,
        "cabelos" as const,
        "cabelos" as const,
      ],
    };
    expect(countByCategory([repetido]).cabelos).toBe(1);
    expect(countByCategory([repetido]).kits).toBe(1);
  });
});
