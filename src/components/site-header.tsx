import Link from "next/link";

import { siteConfig } from "@/config/site";
import { categories } from "@/features/catalog/categories";

import { Container } from "./container";

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

export function SiteHeader() {
  return (
    <header className="bg-surface">
      <Container className="flex h-16 items-center justify-between gap-6 lg:h-20">
        <Link
          href="/"
          className="font-display text-brand text-[1.625rem] leading-none tracking-[-0.01em] lg:text-[1.875rem]"
        >
          {siteConfig.name}
        </Link>

        <nav aria-label="Categorias" className="hidden md:block">
          <ul className="flex gap-8">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/#${c.slug}`}
                  className="underline-offset-[0.3em] hover:underline"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* A sacola ganha estado e drawer na fase 4. */}
        <button
          type="button"
          className="text-ink hover:text-brand -mr-2 flex h-11 items-center gap-2 px-2"
          aria-label="Sacola, vazia"
        >
          <BagIcon />
          <span className="tabular-nums">0</span>
        </button>
      </Container>

      <nav aria-label="Categorias" className="md:hidden">
        <ul className="flex gap-6 overflow-x-auto px-4 pb-3 sm:px-8">
          {categories.map((c) => (
            <li key={c.slug} className="shrink-0">
              <Link href={`/#${c.slug}`} className="inline-block py-1">
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
