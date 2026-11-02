"use client";

import { useEffect, useState } from "react";

import { maxQuantity } from "@/features/cart/cart";
import { useCart } from "@/features/cart/store";
import type { Product } from "@/types/product";

import { useResolvedCart } from "./cart-provider";

export function AddToCartButton({
  product,
  className = "",
  variant = "primary",
}: {
  product: Product;
  className?: string;
  /** "secondary": claro, quando outro botão da tela é o principal. */
  variant?: "primary" | "secondary";
}) {
  const add = useCart((s) => s.add);
  const { lines } = useResolvedCart();
  const max = maxQuantity(product);
  const inCart =
    lines.find((l) => l.product.slug === product.slug)?.quantity ?? 0;
  const full = inCart >= max;
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const id = window.setTimeout(() => setJustAdded(false), 1600);
    return () => window.clearTimeout(id);
  }, [justAdded]);

  return (
    <button
      type="button"
      disabled={full}
      onClick={() => {
        add(product.slug, max);
        setJustAdded(true);
      }}
      className={`${variant === "primary" ? "bg-brand text-brand-ink hover:bg-brand-hover disabled:bg-surface-raised" : "bg-surface text-brand hover:bg-placeholder disabled:bg-surface"} disabled:text-ink-muted h-11 w-full px-4 font-medium transition-colors disabled:cursor-not-allowed ${className}`}
    >
      <span key={String(justAdded)} className="animate-fade inline-block">
        {justAdded
          ? "Adicionado à sacola"
          : full
            ? "Na sacola"
            : "Adicionar à sacola"}
      </span>
    </button>
  );
}
