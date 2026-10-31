"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { formatPrice } from "@/lib/currency";

export type ShowcaseItem = {
  slug: string;
  brand: string;
  name: string;
  priceCents: number | null;
  image: { src: string; alt: string };
};

const INTERVAL_MS = 4500;

/**
 * Vitrine da abertura: alterna as fotos reais dos produtos com transição
 * suave. Pausa com o mouse em cima, com a aba escondida e com
 * "reduzir movimento"; os pontinhos permitem escolher a foto.
 */
export function HeroShowcase({ items }: { items: ShowcaseItem[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (paused || reduce.matches || items.length < 2) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setCurrent((i) => (i + 1) % items.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused, items.length]);

  if (items.length === 0) return null;
  const item = items[current];
  const go = (step: number) =>
    setCurrent((i) => (i + step + items.length) % items.length);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative">
        <Link
          href={`/produtos/${item.slug}`}
          className="group bg-surface-raised relative block aspect-square overflow-hidden md:aspect-[5/4]"
          aria-label={`Ver ${item.brand} ${item.name}`}
        >
          {items.map((it, i) => (
            <Image
              key={it.slug}
              src={it.image.src}
              alt={i === current ? it.image.alt : ""}
              fill
              priority={i === 0}
              sizes="(min-width: 768px) 50vw, 100vw"
              className={`object-cover transition-[opacity,scale] ease-out ${
                i === current
                  ? "scale-[1.06] opacity-100 duration-[1200ms,6000ms]"
                  : "scale-100 opacity-0 duration-[1200ms,0ms]"
              }`}
            />
          ))}
          <span
            key={item.slug}
            className="bg-surface animate-rise absolute bottom-3 left-3 z-10 max-w-[85%] px-3 py-2"
          >
            <span translate="no" className="text-small text-ink-muted block">
              {item.brand}
            </span>
            <span className="block leading-snug">{item.name}</span>
            {item.priceCents !== null && (
              <span className="block font-semibold tabular-nums">
                {formatPrice(item.priceCents)}
              </span>
            )}
          </span>
        </Link>
        {items.length > 1 && (
          <>
            <ArrowButton direction="prev" onClick={() => go(-1)} />
            <ArrowButton direction="next" onClick={() => go(1)} />
          </>
        )}
      </div>

      {items.length > 1 && (
        <div className="mt-3 flex gap-1.5" role="group" aria-label="Fotos">
          {items.map((it, i) => (
            <button
              key={it.slug}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Mostrar ${it.brand} ${it.name}`}
              aria-current={i === current}
              className="flex h-6 items-center"
            >
              <span
                className={`block h-1 rounded-full transition-all duration-300 ${
                  i === current ? "bg-brand w-6" : "bg-placeholder w-3"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ArrowButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  const prev = direction === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={prev ? "Produto anterior" : "Próximo produto"}
      style={{
        backgroundImage: `linear-gradient(to ${prev ? "right" : "left"}, rgb(20 18 14 / 0.6), rgb(20 18 14 / 0.25) 45%, transparent)`,
      }}
      // Faixa da altura da vitrine, com degradê do escuro para o transparente.
      className={`group/arrow absolute inset-y-0 flex w-16 items-center text-white transition-opacity duration-300 hover:opacity-90 md:w-28 ${prev ? "left-0 justify-start pl-3" : "right-0 justify-end pr-3"}`}
    >
      <svg
        aria-hidden="true"
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className={`drop-shadow transition-transform duration-300 ${prev ? "group-hover/arrow:-translate-x-1" : "group-hover/arrow:translate-x-1"}`}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={prev ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
      </svg>
    </button>
  );
}
