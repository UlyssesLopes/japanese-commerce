import { describe, expect, it } from "vitest";

import { fixtureProduct } from "@/features/catalog/fixtures";
import { formatPrice } from "@/lib/currency";

import { answerSummary, buildRoutineMessage } from "./message";
import { buildQuiz } from "./recommend";

const serum = {
  ...fixtureProduct,
  slug: "serum",
  brand: "anciente",
  name: "Sérum",
  priceCents: 8990,
  routineStep: "tratamento",
  concerns: ["manchas", "pele-seca"],
};

describe("answerSummary", () => {
  it("lista as respostas sem a área e sem 'só quero cuidar'", () => {
    const quiz = buildQuiz([serum]);
    expect(answerSummary(quiz, { pele: "pele-seca", foco: "cuidar" })).toEqual([
      "Seca, repuxando",
    ]);
  });
});

describe("buildRoutineMessage", () => {
  it("lista os passos com preço, sem dado pessoal", () => {
    const message = buildRoutineMessage(
      [
        {
          area: "pele",
          steps: [
            {
              step: "tratamento",
              stepLabel: "Tratar",
              product: serum,
              matched: ["manchas"],
              alternatives: [],
            },
          ],
          kits: [],
        },
      ],
      ["Seca, repuxando", "Manchas ou tom irregular"],
    );
    expect(message).toBe(
      [
        'Olá! Fiz o "Descubra sua rotina" no site (Seca, repuxando, Manchas ou tom irregular) e me interessei por:',
        "",
        "Pele",
        `1. Tratar: anciente Sérum (${formatPrice(8990)})`,
        "",
        "Pode me ajudar?",
      ].join("\n"),
    );
  });
});
