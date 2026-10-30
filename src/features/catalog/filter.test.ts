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
