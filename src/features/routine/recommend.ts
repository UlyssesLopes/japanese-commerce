import { isPurchasable } from "@/features/catalog/eligibility";
import type { Product } from "@/types/product";

import {
  isConcern,
  isRoutineStep,
  NO_FOCUS,
  questions,
  routineSteps,
  type ConcernValue,
  type Question,
  type RoutineArea,
  type RoutineStep,
} from "./taxonomy";

/** Respostas por id de pergunta (ex.: `{ para: "pele", pele: "pele-seca" }`). */
export type Answers = Partial<Record<Question["id"], string>>;

/** Etiquetas conhecidas do produto (as desconhecidas são ignoradas). */
function productConcerns(product: Product): ConcernValue[] {
  return (product.concerns ?? []).filter(isConcern);
}

/** Tipos de pele: se o produto marca algum, precisa marcar o da pessoa. */
const skinTypes = new Set<string>(
  questions.find((q) => q.id === "pele")!.options.map((o) => o.value),
);

/** Produtos que podem aparecer numa rotina: à venda, com passo e etiquetas. */
function routineProducts(products: Product[]): Product[] {
  return products.filter(
    (p) =>
      isPurchasable(p) &&
      isRoutineStep(p.routineStep) &&
      productConcerns(p).length > 0,
  );
}

/**
 * Perguntas que fazem sentido com o estoque de agora: cada opção precisa de
 * pelo menos um produto à venda com aquela etiqueta. Pergunta sem opção some;
 * a primeira pergunta some quando só uma área tem produtos.
 */
export function buildQuiz(products: Product[]): Question[] {
  const available = new Set<string>(
    routineProducts(products).flatMap(productConcerns),
  );

  const byArea = questions
    .filter((q) => q.area)
    .map((q) => {
      const options = q.options.filter((o) => available.has(o.value));
      // "Só quero cuidar" só vale se houver outra opção real ao lado.
      const focusFallback = q.options.find((o) => o.value === NO_FOCUS);
      if (options.length > 0 && focusFallback) options.push(focusFallback);
      return { ...q, options };
    })
    .filter((q) => q.options.length > 0);

  const areas = new Set(byArea.map((q) => q.area!));
  const first = questions.find((q) => q.id === "para")!;
  const firstOptions = first.options.filter((o) =>
    o.value === "os-dois" ? areas.size > 1 : areas.has(o.value as RoutineArea),
  );

  return firstOptions.length > 1
    ? [{ ...first, options: firstOptions }, ...byArea]
    : byArea;
}

/** Áreas escolhidas, ou a única área do questionário quando não há escolha. */
export function chosenAreas(quiz: Question[], answers: Answers): RoutineArea[] {
  const quizAreas = [...new Set(quiz.flatMap((q) => (q.area ? [q.area] : [])))];
  if (!quiz.some((q) => q.id === "para")) return quizAreas;
  if (answers.para === "os-dois") return quizAreas;
  return quizAreas.filter((a) => a === answers.para);
}

/** Próxima pergunta sem resposta, ou `null` quando já dá para recomendar. */
export function nextQuestion(
  quiz: Question[],
  answers: Answers,
): Question | null {
  const areas = chosenAreas(quiz, answers);
  return (
    quiz.find(
      (q) => !answers[q.id] && (q.id === "para" || areas.includes(q.area!)),
    ) ?? null
  );
}

export type RoutinePick = {
  step: RoutineStep;
  /** Nome do passo para a área ("Lavar", "Limpar"...). */
  stepLabel: string;
  product: Product;
  /** Etiquetas do produto que bateram com as respostas. */
  matched: ConcernValue[];
  /** Outros produtos à venda que também servem neste passo. */
  alternatives: Product[];
};

export type AreaRoutine = {
  area: RoutineArea;
  steps: RoutinePick[];
  /** Kits à venda em que todos os itens combinam com as respostas. */
  kits: Product[];
};

function wantedConcerns(area: RoutineArea, answers: Answers): string[] {
  const wanted =
    area === "pele" ? [answers.pele, answers.foco] : [answers.cabelo];
  return wanted.filter((v): v is string => !!v && v !== NO_FOCUS);
}

/** Etiquetas que batem, ou `null` se o produto não serve para a pessoa. */
function match(product: Product, wanted: string[]): ConcernValue[] | null {
  const tags = productConcerns(product);
  const types = tags.filter((t) => skinTypes.has(t));
  if (types.length > 0 && !types.some((t) => wanted.includes(t))) return null;
  const matched = tags.filter((t) => wanted.includes(t));
  return matched.length > 0 ? matched : null;
}

/**
 * Monta a rotina de cada área escolhida: um produto por passo (o que mais
 * combina; empate vai para o destaque e depois para a ordem do catálogo) e
 * os kits que combinam por inteiro.
 */
export function recommend(
  products: Product[],
  quiz: Question[],
  answers: Answers,
): AreaRoutine[] {
  const candidates = routineProducts(products);
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  return chosenAreas(quiz, answers)
    .map((area) => {
      const wanted = wantedConcerns(area, answers);
      const scored = candidates
        .map((product) => ({ product, matched: match(product, wanted) }))
        .filter(
          (s): s is { product: Product; matched: ConcernValue[] } =>
            s.matched !== null,
        )
        .sort(
          (a, b) =>
            b.matched.length - a.matched.length ||
            Number(b.product.featured) - Number(a.product.featured),
        );

      const steps = routineSteps.flatMap(({ value, labels }) => {
        const [best, ...rest] = scored.filter(
          (s) => s.product.routineStep === value,
        );
        if (!best) return [];
        return [
          {
            step: value,
            stepLabel: labels[area],
            product: best.product,
            matched: best.matched,
            alternatives: rest.map((s) => s.product),
          },
        ];
      });

      const kits = products.filter((kit) => {
        if (!isPurchasable(kit) || !kit.kitItems?.length) return false;
        return kit.kitItems.every((item) => {
          const product = bySlug.get(item.slug);
          return !!product && match(product, wanted) !== null;
        });
      });

      return { area, steps, kits };
    })
    .filter((r) => r.steps.length > 0 || r.kits.length > 0);
}
