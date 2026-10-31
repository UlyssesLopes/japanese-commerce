import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { todayInStore } = await import("./queries");

describe("todayInStore", () => {
  it("usa o fuso de São Paulo", () => {
    // 31/10 às 01:00 UTC ainda é 30/10 em São Paulo (UTC−3).
    expect(todayInStore(new Date("2026-10-31T01:00:00Z"))).toBe("2026-10-30");
  });
});
