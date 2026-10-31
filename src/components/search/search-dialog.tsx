"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { displayImage } from "@/features/catalog/example-images";
import { searchProducts } from "@/features/catalog/search";
import { formatPrice } from "@/lib/currency";

import { useSearchCatalog } from "../cart/cart-provider";

const SUGGESTIONS = ["Shampoo", "Sérum", "Vitamina C", "Refil", "Maquiagem"];

function SearchIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

/** Lupa no cabeçalho que abre a busca de produtos (dialog nativo). */
export function SearchButton() {
  const ref = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const catalog = useSearchCatalog();
  const results = useMemo(
    () => searchProducts(catalog, query),
    [catalog, query],
  );

  const open = () => {
    ref.current?.showModal();
    inputRef.current?.focus();
  };
  const close = () => ref.current?.close();

  // Atalho "/" abre a busca, como em muitas lojas.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (e.key !== "/" || target.closest("input, textarea")) return;
      e.preventDefault();
      open();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label="Buscar produtos"
        className="text-ink hover:text-brand flex size-11 items-center justify-center"
      >
        <SearchIcon />
      </button>

      <dialog
        ref={ref}
        aria-label="Buscar produtos"
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        className="bg-surface text-ink backdrop:bg-ink/30 open:animate-rise fixed inset-x-0 top-0 m-0 max-h-dvh w-full max-w-none overflow-y-auto rounded-b-3xl p-3 shadow-[0_24px_60px_-24px_rgb(36_35_31/0.45)] md:top-8 md:mx-auto md:max-h-[85dvh] md:max-w-2xl md:rounded-3xl md:p-4"
      >
        <div className="flex items-center gap-2">
          <div className="bg-surface-raised focus-within:ring-brand/40 flex h-14 min-w-0 flex-1 items-center gap-3 rounded-full px-5 ring-2 ring-transparent transition-shadow">
            <span className="text-ink-muted">
              <SearchIcon />
            </span>
            <input
              ref={inputRef}
              type="search"
              name="busca"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por marca, produto ou categoria…"
              aria-label="Buscar produtos"
              autoComplete="off"
              spellCheck={false}
              className="text-lead placeholder:text-ink-muted h-12 min-w-0 flex-1 bg-transparent outline-none focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Fechar busca"
            className="hover:bg-surface-raised flex size-12 shrink-0 items-center justify-center rounded-full text-2xl transition-colors"
          >
            ×
          </button>
        </div>

        <div className="px-2 pt-4 pb-2">
          {query.trim() === "" ? (
            <div>
              <p className="text-small text-ink-muted">Sugestões</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => {
                        setQuery(s);
                        inputRef.current?.focus();
                      }}
                      className="bg-surface-raised hover:bg-placeholder inline-flex h-10 items-center rounded-full px-4 transition-colors"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <>
              <p className="text-small text-ink-muted" aria-live="polite">
                {results.length === 0
                  ? `Nenhum produto encontrado para “${query.trim()}”.`
                  : `${results.length} ${results.length === 1 ? "produto" : "produtos"}`}
              </p>
              <ul className="mt-2 flex flex-col gap-1">
                {results.map((p) => {
                  const image = displayImage(p);
                  return (
                    <li key={p.id}>
                      <Link
                        href={`/produtos/${p.slug}`}
                        onClick={close}
                        className="hover:bg-surface-raised flex items-center gap-4 rounded-2xl p-2 transition-colors"
                      >
                        <span className="bg-surface-raised relative size-16 shrink-0 overflow-hidden rounded-xl">
                          <Image
                            src={image.src}
                            alt=""
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span
                            translate="no"
                            className="text-small text-ink-muted block"
                          >
                            {p.brand}
                          </span>
                          <span className="line-clamp-2 block leading-snug">
                            {p.name}
                          </span>
                        </span>
                        <span
                          className={`shrink-0 pr-2 text-right tabular-nums ${p.priceCents === null ? "text-small text-ink-muted max-w-24" : "font-semibold"}`}
                        >
                          {formatPrice(p.priceCents)}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
