import Link from "next/link";

import type { Question } from "@/features/routine/taxonomy";

import { Container } from "../container";

/**
 * Convite da home: a primeira pergunta já aparece aqui, para um toque levar
 * direto à seguinte. Sem perguntas (nada etiquetado à venda), não aparece.
 */
export function RoutineInvite({ quiz }: { quiz: Question[] }) {
  if (quiz.length === 0) return null;
  const first = quiz[0];
  const options =
    first.id === "para"
      ? first.options.map((o) => ({
          href: `/descobrir?para=${o.value}`,
          label: o.label,
        }))
      : [{ href: "/descobrir", label: "Começar" }];

  return (
    <Container className="mt-8 lg:mt-12">
      <section
        aria-labelledby="descobrir-titulo"
        className="border-placeholder reveal grid gap-6 border-y py-8 lg:grid-cols-12 lg:items-center lg:gap-12"
      >
        <div className="lg:col-span-6">
          <h2
            id="descobrir-titulo"
            className="font-display text-[1.75rem] leading-tight sm:text-[2.25rem]"
          >
            Não sabe por onde começar?
          </h2>
          <p className="text-ink-muted mt-2 max-w-[48ch]">
            Responda{" "}
            {quiz.length > 1 ? `até ${quiz.length} perguntas` : "uma pergunta"}{" "}
            e veja uma rotina com os produtos da loja que combinam com você.
          </p>
        </div>
        <div className="lg:col-span-6">
          {first.id === "para" && (
            <p className="text-small text-ink-muted mb-3">{first.title}</p>
          )}
          <ul
            className={
              options.length === 3
                ? "grid grid-cols-3 gap-2 sm:flex"
                : "flex flex-wrap gap-2"
            }
          >
            {options.map((o) => (
              <li key={o.href}>
                <Link
                  href={o.href}
                  className="bg-brand text-brand-ink hover:bg-brand-hover group flex h-11 items-center justify-center gap-2 px-4 font-medium transition-colors sm:inline-flex sm:gap-3 sm:px-6"
                >
                  {o.label}
                  <span
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Container>
  );
}
