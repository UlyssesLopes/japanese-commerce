"use client";

import { useCart } from "@/features/cart/store";

import { useResolvedCart } from "./cart-provider";

function BagIcon() {
  return (
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
    >
      <path d="M5 8h14l-1 12H6L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export function CartButton() {
  const open = useCart((s) => s.open);
  const { count } = useResolvedCart();

  return (
    <button
      type="button"
      onClick={open}
      className="text-ink hover:text-brand -mr-2 flex h-11 items-center gap-2 px-2"
      aria-label={
        count === 0
          ? "Sacola, vazia"
          : `Sacola, ${count} ${count === 1 ? "item" : "itens"}`
      }
    >
      <BagIcon />
      <span className="tabular-nums">{count}</span>
    </button>
  );
}
