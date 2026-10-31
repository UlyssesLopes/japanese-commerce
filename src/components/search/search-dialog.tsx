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
        className="bg-surface text-ink backdrop:bg-ink/40 fixed inset-x-0 top-0 m-0 max-h-dvh w-full max-w-none overflow-y-auto p-0 md:top-6 md:mx-auto md:max-h-[85dvh] md:max-w-2xl"
      >
        <div className="focus-within:border-ink border-placeholder flex items-center gap-3 border-b-2 px-4 py-3 transition-colors md:px-6">
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
          <button
            type="button"
            onClick={close}
            aria-label="Fechar busca"
            className="hover:text-brand -mr-2 flex size-11 items-center justify-center text-2xl"
          >
            ×
          </button>
        </div>

        <div className="bg-surface-raised px-4 py-4 md:px-6">
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
                      className="bg-surface hover:bg-placeholder inline-flex h-10 items-center rounded-full px-4 transition-colors"
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
              <ul className="mt-3 flex flex-col gap-2">
                {results.map((p) => {
                  const image = displayImage(p);
                  return (
                    <li key={p.id}>
                      <Link
                        href={`/produtos/${p.slug}`}
                        onClick={close}
                        className="bg-surface hover:bg-placeholder flex items-center gap-4 p-2 transition-colors"
                      >
                        <span className="bg-surface-raised relative size-16 shrink-0 overflow-hidden">
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
