import { describe, expect, it } from "vitest";

import { fixtureProduct } from "@/features/catalog/fixtures";
import type { Product } from "@/types/product";

import { answersToSearch, parseAnswers } from "./answers";
import { buildQuiz, nextQuestion, recommend } from "./recommend";

function product(slug: string, extra: Partial<Product>): Product {
  return { ...fixtureProduct, id: slug, slug, name: slug, ...extra };
}

const shampoo = product("shampoo", {
  category: "cabelos",
  routineStep: "limpeza",
  concerns: ["cabelo-ressecado", "cabelo-danificado"],
});
const shampooRefil = product("shampoo-refil", {
  category: "cabelos",
  routineStep: "limpeza",
  concerns: ["cabelo-ressecado"],
});
const oleo = product("oleo", {
  category: "cabelos",
  routineStep: "finalizacao",
  concerns: ["cabelo-ressecado", "cabelo-sem-brilho"],
});
const limpeza = product("oleo-de-limpeza", {
  routineStep: "limpeza",
  concerns: ["poros"],
});
const serum = product("serum", {
  routineStep: "tratamento",
  concerns: ["manchas", "vico"],
});
const hidratanteSeca = product("hidratante-seca", {
  routineStep: "hidratacao",
  concerns: ["pele-seca", "pele-sensivel"],
});
const hidratanteOleosa = product("hidratante-oleosa", {
  routineStep: "hidratacao",
  concerns: ["pele-oleosa", "poros"],
});
const kit = product("kit", {
  category: "kits",
  kitItems: [
    { slug: "shampoo", brand: "x", name: "x", quantity: 1 },
    { slug: "oleo", brand: "x", name: "x", quantity: 1 },
  ],
});

const catalog = [
  shampoo,
  shampooRefil,
  oleo,
  limpeza,
  serum,
  hidratanteSeca,
  hidratanteOleosa,
  kit,
];

const values = (q: { options: { value: string }[] }) =>
  q.options.map((o) => o.value);

describe("buildQuiz", () => {
  it("só oferece opções que têm produto à venda", () => {
    const quiz = buildQuiz(catalog);
    const cabelo = quiz.find((q) => q.id === "cabelo")!;
    expect(values(cabelo)).toEqual([
      "cabelo-ressecado",
      "cabelo-danificado",
      "cabelo-sem-brilho",
    ]);
    const foco = quiz.find((q) => q.id === "foco")!;
    expect(values(foco)).toEqual(["manchas", "poros", "vico", "cuidar"]);
  });

  it("ignora produto que não pode ser comprado", () => {
    const quiz = buildQuiz([
      ...catalog,
      product("esgotado", {
        routineStep: "tratamento",
        concerns: ["linhas-finas"],
        availableQuantity: 0,
      }),
    ]);
    expect(values(quiz.find((q) => q.id === "foco")!)).not.toContain(
      "linhas-finas",
    );
  });

  it("ignora produto sem passo e etiqueta desconhecida", () => {
    const quiz = buildQuiz([
      product("sem-passo", { concerns: ["cabelo-sem-volume"] }),
      product("etiqueta-nova", {
        routineStep: "limpeza",
        concerns: ["cabelo-oleoso"],
      }),
    ]);
    expect(quiz).toEqual([]);
  });

  it("pula a primeira pergunta quando só uma área tem produtos", () => {
    const quiz = buildQuiz([shampoo, oleo]);
    expect(quiz.map((q) => q.id)).toEqual(["cabelo"]);
  });

  it("oferece 'Os dois' só quando as duas áreas têm produtos", () => {
    expect(values(buildQuiz(catalog)[0])).toEqual([
      "pele",
      "cabelo",
      "os-dois",
    ]);
  });

  it("tira o foco quando só sobraria 'só quero cuidar'", () => {
    const quiz = buildQuiz([hidratanteSeca, shampoo]);
    expect(quiz.map((q) => q.id)).toEqual(["para", "pele", "cabelo"]);
  });
});

describe("nextQuestion", () => {
  const quiz = buildQuiz(catalog);

  it("segue só as perguntas da área escolhida", () => {
    expect(nextQuestion(quiz, {})?.id).toBe("para");
    expect(nextQuestion(quiz, { para: "cabelo" })?.id).toBe("cabelo");
    expect(
      nextQuestion(quiz, { para: "cabelo", cabelo: "cabelo-ressecado" }),
    ).toBeNull();
  });

  it("com 'Os dois', pergunta pele e depois cabelo", () => {
    const answers = { para: "os-dois", pele: "pele-seca", foco: "manchas" };
    expect(nextQuestion(quiz, answers)?.id).toBe("cabelo");
  });
});

describe("recommend", () => {
  const quiz = buildQuiz(catalog);

  it("monta a rotina em ordem de uso, com o que mais combina primeiro", () => {
    const [cabelo] = recommend(catalog, quiz, {
      para: "cabelo",
      cabelo: "cabelo-ressecado",
    });
    expect(cabelo.steps.map((s) => [s.stepLabel, s.product.slug])).toEqual([
      ["Lavar", "shampoo"],
      ["Finalizar", "oleo"],
    ]);
    expect(cabelo.steps[0].alternatives.map((p) => p.slug)).toEqual([
      "shampoo-refil",
    ]);
    expect(cabelo.steps[0].matched).toEqual(["cabelo-ressecado"]);
  });

  it("não recomenda produto marcado para outro tipo de pele", () => {
    const [pele] = recommend(catalog, quiz, {
      para: "pele",
      pele: "pele-seca",
      foco: "poros",
    });
    const slugs = pele.steps.map((s) => s.product.slug);
    expect(slugs).toContain("hidratante-seca");
    expect(slugs).not.toContain("hidratante-oleosa");
    expect(slugs).toContain("oleo-de-limpeza");
  });

  it("'só quero cuidar' recomenda pelo tipo de pele", () => {
    const [pele] = recommend(catalog, quiz, {
      para: "pele",
      pele: "pele-oleosa",
      foco: "cuidar",
    });
    expect(pele.steps.map((s) => s.product.slug)).toEqual([
      "hidratante-oleosa",
    ]);
  });

  it("sugere o kit quando todos os itens combinam", () => {
    const answers = { para: "cabelo", cabelo: "cabelo-ressecado" };
    expect(recommend(catalog, quiz, answers)[0].kits).toEqual([kit]);

    const danificado = { para: "cabelo", cabelo: "cabelo-danificado" };
    expect(recommend(catalog, quiz, danificado)[0].kits).toEqual([]);
  });

  it("com 'Os dois', devolve uma rotina por área", () => {
    const result = recommend(catalog, quiz, {
      para: "os-dois",
      pele: "pele-seca",
      foco: "manchas",
      cabelo: "cabelo-sem-brilho",
    });
    expect(result.map((r) => r.area)).toEqual(["pele", "cabelo"]);
  });
});

describe("respostas no endereço", () => {
  const quiz = buildQuiz(catalog);

  it("vai e volta pela query string", () => {
    const answers = { para: "pele", pele: "pele-seca", foco: "manchas" };
    const search = answersToSearch(quiz, answers);
    expect(search).toBe("para=pele&pele=pele-seca&foco=manchas");
    expect(
      parseAnswers(quiz, Object.fromEntries(new URLSearchParams(search))),
    ).toEqual(answers);
  });

  it("descarta opção que o estoque não oferece mais", () => {
    expect(
      parseAnswers(quiz, { para: "cabelo", cabelo: "cabelo-sem-volume" }),
    ).toEqual({ para: "cabelo" });
  });
});
