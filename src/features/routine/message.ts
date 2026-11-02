import { formatPrice } from "@/lib/currency";

import type { AreaRoutine, Answers } from "./recommend";
import { NO_FOCUS, type Question } from "./taxonomy";

const areaTitles = { pele: "Pele", cabelo: "Cabelo" } as const;

export function areaTitle(area: AreaRoutine["area"]): string {
  return areaTitles[area];
}

/** Respostas em texto curto ("Seca, repuxando", "Manchas..."), sem a área. */
export function answerSummary(quiz: Question[], answers: Answers): string[] {
  return quiz.flatMap((q) => {
    const value = answers[q.id];
    if (q.id === "para" || !value || value === NO_FOCUS) return [];
    const option = q.options.find((o) => o.value === value);
    return option ? [option.label] : [];
  });
}

/**
 * Mensagem para tirar dúvida sobre a rotina no WhatsApp. Só produtos e
 * respostas do questionário; nenhum dado pessoal.
 */
export function buildRoutineMessage(
  routines: AreaRoutine[],
  summary: string[],
): string {
  const about = summary.length ? ` (${summary.join(", ")})` : "";
  const blocks = routines.map((r) => {
    const steps = r.steps.map(
      (s, i) =>
        `${i + 1}. ${s.stepLabel}: ${s.product.brand} ${s.product.name} (${formatPrice(s.product.priceCents)})`,
    );
    const kits = r.kits.map(
      (k) => `Kit: ${k.name} (${formatPrice(k.priceCents)})`,
    );
    return [areaTitle(r.area), ...steps, ...kits].join("\n");
  });
  return [
    `Olá! Fiz o "Descubra sua rotina" no site${about} e me interessei por:`,
    "",
    blocks.join("\n\n"),
    "",
    "Pode me ajudar?",
  ].join("\n");
}
