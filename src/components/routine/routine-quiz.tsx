"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { answersToSearch, parseAnswers } from "@/features/routine/answers";
import { nextQuestion, type Answers } from "@/features/routine/recommend";
import type { Question } from "@/features/routine/taxonomy";
import type { Product } from "@/types/product";

import { RoutineResult } from "./routine-result";

/**
 * Uma pergunta por tela. Cada resposta vai para a URL: o botão voltar do
 * navegador desfaz a última e o resultado pode ser compartilhado.
 */
export function RoutineQuiz({
  products,
  quiz,
}: {
  products: Product[];
  quiz: Question[];
}) {
  const answers = parseAnswers(quiz, Object.fromEntries(useSearchParams()));
  const question = nextQuestion(quiz, answers);
  const answered = quiz.filter((q) => answers[q.id]);

  const href = (next: Answers) => {
    const search = answersToSearch(quiz, next);
    return search ? `/descobrir?${search}` : "/descobrir";
  };

  // Ao trocar de pergunta, o leitor de tela e o teclado vão junto.
  const titleRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  useEffect(() => {
    if (!moved.current) {
      moved.current = true;
      return;
    }
    titleRef.current?.focus({ preventScroll: true });
    titleRef.current?.scrollIntoView({ block: "nearest" });
  }, [question?.id]);

  if (!question) {
    return (
      <RoutineResult
        products={products}
        quiz={quiz}
        answers={answers}
        titleRef={titleRef}
      />
    );
  }

  // Colunas só com rótulos curtos ("Pele", "Cabelo"); frases ficam uma por
  // linha, para nenhuma quebrar em mais linhas que as outras.
  const short = question.options.every((o) => o.label.length <= 12);
  const columns = !short
    ? ""
    : question.options.length === 3
      ? "sm:grid-cols-3"
      : "sm:grid-cols-2";

  const last = answered.at(-1);
  const previous = { ...answers };
  if (last) delete previous[last.id];

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-5">
        <h1 className="font-display text-head">Descubra sua rotina</h1>
        <p className="text-lead text-ink-muted mt-4 max-w-[40ch]">
          Responda{" "}
          {quiz.length > 1 ? `até ${quiz.length} perguntas` : "uma pergunta"} e
          veja os produtos da loja que combinam com você, na ordem de uso.
        </p>
        <p className="text-small text-ink-muted mt-4 max-w-[44ch]">
          É uma sugestão a partir da indicação de cada produto, não uma
          avaliação da sua pele.
        </p>
      </div>

      <section
        aria-labelledby="pergunta"
        className="bg-surface-raised p-5 sm:p-8 lg:col-span-7"
      >
        <div className="flex items-center justify-between gap-4">
          <p className="text-small text-ink-muted">
            Pergunta {answered.length + 1}
          </p>
          {last && (
            <Link
              href={href(previous)}
              scroll={false}
              className="text-small text-ink-muted hover:text-ink underline-offset-4 hover:underline"
            >
              <span aria-hidden="true">← </span>Voltar
            </Link>
          )}
        </div>

        <div key={question.id} className="animate-fade">
          <h2
            id="pergunta"
            ref={titleRef}
            tabIndex={-1}
            className="font-display mt-3 text-[1.75rem] leading-tight text-balance outline-none sm:text-[2.25rem]"
          >
            {question.title}
          </h2>
          <ul className={`mt-6 grid gap-3 ${columns}`}>
            {question.options.map((o, i, all) => (
              <li
                key={o.value}
                // Em 2 colunas com número ímpar, a última opção ocupa a linha.
                className={
                  columns === "sm:grid-cols-2" &&
                  all.length % 2 === 1 &&
                  i === all.length - 1
                    ? "sm:col-span-2"
                    : undefined
                }
              >
                <Link
                  href={href({ ...answers, [question.id]: o.value })}
                  scroll={false}
                  className="bg-surface hover:bg-placeholder group flex h-full min-h-16 w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors"
                >
                  <span className="text-lead">{o.label}</span>
                  <span
                    aria-hidden="true"
                    className="text-brand transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
