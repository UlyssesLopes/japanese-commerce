"use client";

import { useState, useTransition } from "react";

import type { ActionState } from "@/features/admin/types";

import { buttonClass, ErrorNote } from "./ui";

/** Barra de salvar, presa ao pé da tela enquanto o formulário rola. */
export function SaveBar({
  state,
  pending,
  label = "Salvar",
}: {
  state: ActionState;
  pending: boolean;
  label?: string;
}) {
  return (
    <div className="bg-sheet/95 border-line sticky bottom-0 z-10 -mx-4 mt-8 flex flex-wrap items-center justify-end gap-4 border-t px-4 py-3 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
      <div aria-live="polite" className="mr-auto min-w-0 text-sm">
        {state.error ? (
          <ErrorNote>{state.error}</ErrorNote>
        ) : state.saved && !pending ? (
          <span className="text-positive">Alterações salvas.</span>
        ) : null}
      </div>
      <button type="submit" disabled={pending} className={buttonClass.primary}>
        {pending ? "Salvando…" : label}
      </button>
    </div>
  );
}

/** Apagar de vez, com confirmação na própria tela (sem janela do navegador). */
export function DeleteZone({
  what,
  consequence,
  action,
}: {
  what: string;
  consequence: string;
  action: () => Promise<ActionState>;
}) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  return (
    <section className="border-rule mt-12 grid gap-4 border-t pt-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10">
      <div>
        <h2 className="text-base font-semibold">Apagar</h2>
        <p className="text-ink-muted mt-1 text-sm">{consequence}</p>
      </div>
      <div className="grid content-start gap-3">
        {error && <ErrorNote>{error}</ErrorNote>}
        {confirming ? (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm">Apagar {what} de vez?</span>
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  const result = await action();
                  if (result?.error) {
                    setError(result.error);
                    setConfirming(false);
                  }
                })
              }
              className={`${buttonClass.danger} bg-negative-soft`}
            >
              {pending ? "Apagando…" : "Sim, apagar"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className={buttonClass.text}
            >
              Cancelar
            </button>
          </div>
        ) : (
          <div>
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className={buttonClass.danger}
            >
              Apagar {what}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
