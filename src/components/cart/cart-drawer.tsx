"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { useCart } from "@/features/cart/store";

import { CartContents } from "./cart-contents";

/** Sacola lateral com o <dialog> nativo (foco preso, Esc fecha). */
export function CartDrawer() {
  const ref = useRef<HTMLDialogElement>(null);
  const isOpen = useCart((s) => s.isOpen);
  const close = useCart((s) => s.close);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="sacola-titulo"
      onClose={close}
      onClick={(e) => {
        // Clique no fundo escurecido fecha.
        if (e.target === e.currentTarget) close();
      }}
      className="bg-surface text-ink backdrop:bg-ink/40 fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-md overflow-y-auto overscroll-contain p-0"
    >
      <div className="flex min-h-full flex-col px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <h2 id="sacola-titulo" className="font-display text-[2rem]">
            Sacola
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Fechar sacola"
            className="hover:text-brand -mr-2 flex size-11 items-center justify-center text-2xl"
          >
            ×
          </button>
        </div>
        <div className="mt-4 flex-1">
          <CartContents onNavigate={close} />
        </div>
        <Link
          href="/sacola"
          onClick={close}
          className="text-small text-ink-muted hover:text-ink mt-6 self-start underline underline-offset-4"
        >
          Abrir a sacola em página inteira
        </Link>
      </div>
    </dialog>
  );
}
