import type { Answers } from "./recommend";
import type { Question } from "./taxonomy";

type SearchParams = Record<string, string | string[] | undefined>;

/**
 * Lê as respostas do endereço (`?para=pele&pele=pele-seca`), para o
 * resultado poder ser compartilhado. Só aceita perguntas e opções que o
 * questionário de agora oferece; o resto é descartado.
 */
export function parseAnswers(quiz: Question[], params: SearchParams): Answers {
  const answers: Answers = {};
  for (const q of quiz) {
    const raw = params[q.id];
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (value && q.options.some((o) => o.value === value)) {
      answers[q.id] = value;
    }
  }
  return answers;
}

/** Respostas como query string, na ordem das perguntas. */
export function answersToSearch(quiz: Question[], answers: Answers): string {
  const params = new URLSearchParams();
  for (const q of quiz) {
    const value = answers[q.id];
    if (value) params.set(q.id, value);
  }
  return params.toString();
}
