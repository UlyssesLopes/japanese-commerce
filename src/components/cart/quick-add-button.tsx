"use client";

import { useEffect, useState } from "react";

import { maxQuantity } from "@/features/cart/cart";
import { useCart } from "@/features/cart/store";
import type { Product } from "@/types/product";

import { useResolvedCart } from "./cart-provider";

/**
 * Botão "+" sobre a foto do card: adiciona à sacola sem abrir o produto.
 * Translúcido como as setas da vitrine; no desktop aparece com o mouse em
 * cima do card, no celular fica sempre visível.
 */
export function QuickAddButton({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const { lines } = useResolvedCart();
  const max = maxQuantity(product);
  const inCart =
    lines.find((l) => l.product.slug === product.slug)?.quantity ?? 0;
  const full = inCart >= max;
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const id = window.setTimeout(() => setJustAdded(false), 1400);
    return () => window.clearTimeout(id);
  }, [justAdded]);

  const label = full
    ? `${product.name} já está na sacola`
    : `Adicionar ${product.name} à sacola`;

  return (
    <button
      type="button"
      disabled={full}
      onClick={() => {
        add(product.slug, max);
        setJustAdded(true);
      }}
      aria-label={label}
      title={full ? "Na sacola" : "Adicionar à sacola"}
      className="bg-ink/35 hover:bg-ink/55 absolute right-2 bottom-2 z-10 flex size-11 items-center justify-center rounded-full text-white transition-[opacity,background-color,scale] duration-300 focus-visible:opacity-100 active:scale-90 disabled:cursor-default md:opacity-0 md:group-hover:opacity-100"
    >
      <svg
        aria-hidden="true"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow"
      >
        {justAdded || full ? (
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        ) : (
          <path d="M12 5v14M5 12h14" />
        )}
      </svg>
    </button>
  );
}
