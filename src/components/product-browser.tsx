"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { categories } from "@/features/catalog/categories";
import { filterByCategory, parseCategory } from "@/features/catalog/filter";
import type { Product } from "@/types/product";

import { ProductGrid } from "./product-grid";

/** Filtro por categoria sincronizado com `?categoria=` na URL. */
export function ProductBrowser({ products }: { products: Product[] }) {
  const active = parseCategory(useSearchParams().get("categoria"));
  const visible = filterByCategory(products, active);

  return (
    <>
      <CategoryChips active={active} />
      <p className="text-small text-ink-muted mt-6" aria-live="polite">
        {visible.length} {visible.length === 1 ? "produto" : "produtos"}
      </p>
      <div className="mt-4">
        <ProductGrid products={visible} />
      </div>
    </>
  );
}

export function CategoryChips({ active }: { active: string | null }) {
  const options = [{ slug: null, label: "Todos" }, ...categories];
  return (
    <nav aria-label="Filtrar por categoria">
      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {options.map((c) => {
          const selected = c.slug === active;
          return (
            <li key={c.label} className="shrink-0">
              <Link
                href={c.slug ? `/?categoria=${c.slug}#produtos` : "/#produtos"}
                scroll={false}
                aria-current={selected ? "page" : undefined}
                className={`inline-flex h-10 items-center rounded-full px-5 transition-colors ${
                  selected
                    ? "bg-brand text-brand-ink"
                    : "bg-surface text-ink hover:bg-placeholder"
                }`}
              >
                {c.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
