import { describe, expect, it } from "vitest";

import { formatPhone } from "./phone";

describe("formatPhone", () => {
  it("formata celular e fixo com DDD", () => {
    expect(formatPhone("5551992279106")).toBe("(51) 99227-9106");
    expect(formatPhone("+55 51 3333-4444")).toBe("(51) 3333-4444");
  });

  it("devolve como veio quando não reconhece", () => {
    expect(formatPhone("123")).toBe("123");
  });
});
