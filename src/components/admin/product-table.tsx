"use client";

import Link from "next/link";
import { useState } from "react";

import { categories } from "@/features/catalog/categories";
import { missingForSale } from "@/features/admin/readiness";
import type { AdminProduct } from "@/features/admin/types";
import { formatPrice } from "@/lib/currency";

import { inputClass, Pill, StatusPill, Thumb } from "./ui";

const filters = [
  { value: "all", label: "Todos" },
  { value: "published", label: "Publicados" },
  { value: "preview", label: "Prévia" },
  { value: "draft", label: "Rascunhos" },
] as const;

const categoryLabel = Object.fromEntries(
  categories.map((c) => [c.slug, c.label]),
);

function normalize(text: string) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function SaleState({ product }: { product: AdminProduct }) {
  const missing = missingForSale(product).filter(
    // O status já aparece na coluna ao lado.
    (m) => m !== "Não publicado",
  );
  if (missing.length === 0) return <Pill tone="positive">À venda</Pill>;
  return (
    <span className="text-ink-muted text-[0.8125rem]">
      {missing.join(" · ")}
    </span>
  );
}

export function ProductTable({ products }: { products: AdminProduct[] }) {
  const [filter, setFilter] =
    useState<(typeof filters)[number]["value"]>("all");
  const [query, setQuery] = useState("");

  const q = normalize(query.trim());
  const visible = products.filter(
    (p) =>
      (filter === "all" || p.publicationStatus === filter) &&
      (!q || normalize(`${p.brand} ${p.name} ${p.sku}`).includes(q)),
  );
  const countOf = (value: string) =>
    value === "all"
      ? products.length
      : products.filter((p) => p.publicationStatus === value).length;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Filtrar por status"
          className="-mx-1 flex gap-1 overflow-x-auto px-1"
        >
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              aria-pressed={filter === f.value}
              onClick={() => setFilter(f.value)}
              className={`h-8 flex-none rounded-md px-3 text-sm whitespace-nowrap ${
                filter === f.value
                  ? "bg-surface-raised text-ink font-medium"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {f.label}{" "}
              <span className="tabular-nums opacity-70">
                {countOf(f.value)}
              </span>
            </button>
          ))}
        </div>
        <input
          type="search"
          aria-label="Buscar produto"
          placeholder="Buscar por nome, marca ou SKU…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`${inputClass} h-9 w-full py-0 sm:w-72`}
        />
      </div>

      {visible.length === 0 ? (
        <p className="border-line text-ink-muted rounded-lg border border-dashed px-4 py-3 text-sm">
          Nenhum produto encontrado.
        </p>
      ) : (
        <>
          {/* Tabela no computador */}
          <table className="hidden w-full text-left md:table">
            <thead>
              <tr className="text-ink-muted border-line border-b text-[0.8125rem]">
                <th className="py-2 pr-4 font-normal">Produto</th>
                <th className="py-2 pr-4 font-normal">Categoria</th>
                <th className="py-2 pr-4 text-right font-normal">Preço</th>
                <th className="py-2 pr-4 text-right font-normal">Unidades</th>
                <th className="py-2 pr-4 font-normal">Status</th>
                <th className="py-2 font-normal">Para vender</th>
              </tr>
            </thead>
            <tbody className="divide-rule divide-y">
              {visible.map((p) => (
                <tr key={p.id} className="align-middle">
                  <td className="py-3 pr-4">
                    <Link
                      href={`/admin/produtos/${p.id}`}
                      className="group flex items-center gap-3"
                    >
                      <Thumb src={p.images[0]?.src} />
                      <span className="min-w-0">
                        <span className="block font-medium group-hover:underline">
                          {p.name}
                          {p.subtitle ? ` — ${p.subtitle}` : ""}
                        </span>
                        <span className="text-ink-muted block text-[0.8125rem]">
                          {p.brand}
                          {p.volume ? ` · ${p.volume}` : ""}
                        </span>
                      </span>
                    </Link>
                  </td>
                  <td className="text-ink-muted py-3 pr-4 text-sm">
                    {categoryLabel[p.category]}
                  </td>
                  <td
                    className={`py-3 pr-4 text-right whitespace-nowrap tabular-nums ${
                      p.priceCents === null ? "text-ink-muted text-sm" : ""
                    }`}
                  >
                    {p.priceCents === null ? "—" : formatPrice(p.priceCents)}
                  </td>
                  <td className="py-3 pr-4 text-right tabular-nums">
                    {p.availableQuantity}
                    <span className="text-ink-muted">
                      {" "}
                      / {p.inventoryQuantity}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <StatusPill status={p.publicationStatus} />
                  </td>
                  <td className="py-3">
                    <SaleState product={p} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Lista no celular */}
          <ul className="divide-rule border-line divide-y border-y md:hidden">
            {visible.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/admin/produtos/${p.id}`}
                  className="flex items-center gap-3 py-3"
                >
                  <Thumb src={p.images[0]?.src} size={48} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="truncate font-medium">{p.name}</span>
                      <span className="flex-none tabular-nums">
                        {p.priceCents === null
                          ? "—"
                          : formatPrice(p.priceCents)}
                      </span>
                    </span>
                    <span className="text-ink-muted mt-0.5 flex items-center justify-between gap-3 text-[0.8125rem]">
                      <span className="truncate">
                        {p.brand} · {p.availableQuantity}/{p.inventoryQuantity}{" "}
                        un.
                      </span>
                      <StatusPill status={p.publicationStatus} />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
