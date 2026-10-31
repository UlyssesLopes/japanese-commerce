"use client";

import { useActionState, useMemo, useState } from "react";

import { deleteKit, saveKit } from "@/app/admin/actions";
import {
  kitAvailability,
  kitItemsTotal,
  type KitLine,
} from "@/features/admin/kit";
import { formatMoneyInput, parseMoney } from "@/features/admin/money";
import { slugify } from "@/features/admin/slug";
import type { AdminKit, AdminProduct } from "@/features/admin/types";
import { formatPrice } from "@/lib/currency";
import type { Product } from "@/types/product";

import { DeleteZone, SaveBar, submitKeepingValues } from "./form-parts";
import { ImageManager } from "./image-manager";
import { Check, Field, inputClass, textareaClass, Section, Thumb } from "./ui";

function normalize(text: string) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

const statusOptions: { value: Product["publicationStatus"]; label: string }[] =
  [
    { value: "draft", label: "Rascunho — não aparece no site" },
    { value: "preview", label: "Prévia — aparece, sem botão de compra" },
    { value: "published", label: "Publicado" },
  ];

export function KitForm({
  kit,
  products,
}: {
  kit?: AdminKit;
  products: AdminProduct[];
}) {
  const [state, action, pending] = useActionState(
    saveKit.bind(null, kit?.id ?? null),
    {},
  );
  const byId = useMemo(
    () => new Map(products.map((p) => [p.id, p])),
    [products],
  );

  const [name, setName] = useState(kit?.name ?? "");
  const [slug, setSlug] = useState(kit?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(kit));
  const [price, setPrice] = useState(formatMoneyInput(kit?.priceCents));
  const [lines, setLines] = useState<KitLine[]>(
    kit?.items.map((i) => ({ productId: i.productId, quantity: i.quantity })) ??
      [],
  );
  const [query, setQuery] = useState("");

  const currentSlug = slugTouched ? slug : slugify(name);
  const parsedPrice = parseMoney(price);
  const total = kitItemsTotal(lines, byId);
  const availability = kitAvailability(lines, byId);
  const kitPrice = parsedPrice.ok ? parsedPrice.cents : null;

  const q = normalize(query.trim());
  const results = q
    ? products
        .filter(
          (p) =>
            !lines.some((l) => l.productId === p.id) &&
            normalize(`${p.brand} ${p.name}`).includes(q),
        )
        .slice(0, 6)
    : [];

  function setQuantity(productId: string, quantity: number) {
    setLines((list) =>
      list.map((l) => (l.productId === productId ? { ...l, quantity } : l)),
    );
  }

  return (
    <form onSubmit={submitKeepingValues(action)}>
      <input type="hidden" name="items" value={JSON.stringify(lines)} />

      <Section title="Kit" description="Nome e texto que aparecem na vitrine.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome do kit" htmlFor="name">
            <input
              id="name"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: Kit cabelo hidratado"
              className={inputClass}
            />
          </Field>
          <Field
            label="Endereço da página"
            htmlFor="slug"
            hint={`zivora…/kits/${currentSlug || "…"}`}
          >
            <input
              id="slug"
              name="slug"
              required
              pattern="[a-z0-9-]+"
              value={currentSlug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value) || e.target.value);
              }}
              className={`${inputClass} font-mono text-sm`}
            />
          </Field>
        </div>
        <Field label="Descrição" htmlFor="description">
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={kit?.description}
            className={textareaClass}
          />
        </Field>
      </Section>

      <Section
        title="Produtos do kit"
        description="O kit usa as mesmas unidades dos produtos avulsos: vendeu um, o outro diminui."
      >
        <div className="relative">
          <label
            htmlFor="kit-search"
            className="mb-2 block text-sm font-medium"
          >
            Adicionar produto
          </label>
          <input
            id="kit-search"
            type="search"
            autoComplete="off"
            placeholder="Buscar por nome ou marca…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={inputClass}
          />
          {q && (
            <ul className="bg-sheet border-line absolute inset-x-0 top-full z-20 mt-1 max-h-80 overflow-auto rounded-lg border shadow-[0_8px_24px_rgb(0_0_0/0.08)]">
              {results.length === 0 ? (
                <li className="text-ink-muted px-4 py-3 text-sm">
                  Nenhum produto encontrado.
                </li>
              ) : (
                results.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setLines((list) => [
                          ...list,
                          { productId: p.id, quantity: 1 },
                        ]);
                        setQuery("");
                      }}
                      className="hover:bg-surface flex w-full items-center gap-3 px-3 py-2 text-left"
                    >
                      <Thumb src={p.images[0]?.src} size={36} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">
                          {p.name}
                        </span>
                        <span className="text-ink-muted block truncate text-[0.8125rem]">
                          {p.brand} · {p.availableQuantity} disponível
                          {p.availableQuantity === 1 ? "" : "s"}
                        </span>
                      </span>
                      <span className="text-sm tabular-nums">
                        {p.priceCents === null
                          ? "—"
                          : formatPrice(p.priceCents)}
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        {lines.length === 0 ? (
          <p className="border-line text-ink-muted rounded-lg border border-dashed px-4 py-3 text-sm">
            Busque acima e adicione os produtos que vão no kit.
          </p>
        ) : (
          <ul className="border-line divide-rule divide-y rounded-lg border">
            {lines.map((line) => {
              const p = byId.get(line.productId);
              if (!p) return null;
              const max = Math.max(1, p.inventoryQuantity);
              return (
                <li
                  key={line.productId}
                  className="flex flex-wrap items-center gap-3 px-4 py-3"
                >
                  <Thumb src={p.images[0]?.src} />
                  <span className="min-w-40 flex-1">
                    <span className="block font-medium">{p.name}</span>
                    <span className="text-ink-muted block text-[0.8125rem]">
                      {p.brand} ·{" "}
                      {p.priceCents === null
                        ? "sem preço"
                        : `${formatPrice(p.priceCents)} cada`}{" "}
                      · {p.inventoryQuantity} em estoque
                    </span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span
                      role="group"
                      aria-label={`Quantidade de ${p.name}`}
                      className="border-field flex h-9 items-center rounded-md border"
                    >
                      <button
                        type="button"
                        aria-label="Diminuir"
                        disabled={line.quantity <= 1}
                        onClick={() => setQuantity(p.id, line.quantity - 1)}
                        className="h-full w-9 disabled:opacity-30"
                      >
                        −
                      </button>
                      <span className="w-8 text-center tabular-nums">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Aumentar"
                        disabled={line.quantity >= max}
                        onClick={() => setQuantity(p.id, line.quantity + 1)}
                        className="h-full w-9 disabled:opacity-30"
                      >
                        +
                      </button>
                    </span>
                    <span className="w-24 text-right tabular-nums">
                      {p.priceCents === null
                        ? "—"
                        : formatPrice(p.priceCents * line.quantity)}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setLines((list) =>
                          list.filter((l) => l.productId !== p.id),
                        )
                      }
                      className="text-negative text-sm"
                    >
                      Tirar
                    </button>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      <Section
        title="Preço do kit"
        description="Compare com a soma dos produtos avulsos antes de definir. Vazio = “Preço em definição”."
      >
        <div className="grid items-start gap-6 sm:grid-cols-[14rem_minmax(0,1fr)]">
          <Field label="Preço do kit (R$)" htmlFor="price">
            <input
              id="price"
              name="price"
              inputMode="decimal"
              placeholder="399,90"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              aria-invalid={!parsedPrice.ok}
              className={`${inputClass} tabular-nums ${
                parsedPrice.ok ? "" : "border-negative"
              }`}
            />
          </Field>
          <dl className="bg-surface grid gap-2 rounded-lg px-4 py-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">Soma dos avulsos</dt>
              <dd className="tabular-nums">
                {lines.length === 0
                  ? "—"
                  : total === null
                    ? "Falta preço em algum item"
                    : formatPrice(total)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">Preço do kit</dt>
              <dd className="tabular-nums">
                {kitPrice === null ? "—" : formatPrice(kitPrice)}
              </dd>
            </div>
            {total !== null && kitPrice !== null && total > 0 && (
              <div className="border-line flex justify-between gap-4 border-t pt-2">
                <dt className="text-ink-muted">Diferença</dt>
                <dd className="tabular-nums">
                  {kitPrice === total
                    ? "Igual à soma"
                    : `${formatPrice(Math.abs(total - kitPrice))} ${
                        kitPrice < total ? "abaixo" : "acima"
                      } da soma (${(
                        (Math.abs(total - kitPrice) / total) *
                        100
                      ).toLocaleString("pt-BR", {
                        maximumFractionDigits: 1,
                      })}%)`}
                </dd>
              </div>
            )}
            <div className="border-line flex justify-between gap-4 border-t pt-2">
              <dt className="text-ink-muted">Dá para vender</dt>
              <dd className="text-right">
                <span className="font-semibold tabular-nums">
                  {availability.quantity}{" "}
                  {availability.quantity === 1 ? "kit" : "kits"}
                </span>
                {lines.length > 1 && availability.limitedBy && (
                  <span className="text-ink-muted block text-[0.8125rem]">
                    limitado por {availability.limitedBy.name}
                  </span>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </Section>

      <Section
        title="Fotos"
        description="Opcional. Sem foto do kit, a vitrine usa a foto principal de cada produto."
      >
        <ImageManager
          initial={kit && hasOwnImages(kit) ? kit.images : []}
          slug={currentSlug}
          defaultAlt={name}
          emptyHint="Sem foto do kit: a vitrine vai usar as fotos dos produtos."
        />
      </Section>

      <Section title="Publicação e venda">
        <Field label="No site" htmlFor="publicationStatus">
          <select
            id="publicationStatus"
            name="publicationStatus"
            defaultValue={kit?.publicationStatus ?? "draft"}
            className={inputClass}
          >
            {statusOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Check
          name="purchaseEnabled"
          label="Liberar venda"
          description="Precisa de preço. Só vende enquanto houver unidades de todos os produtos."
          defaultChecked={kit?.purchaseEnabled}
        />
        <Check
          name="featured"
          label="Destaque na vitrine"
          defaultChecked={kit?.featured}
        />
      </Section>

      <SaveBar
        state={state}
        pending={pending}
        label={kit ? "Salvar alterações" : "Criar kit"}
      />

      {kit && (
        <DeleteZone
          what="este kit"
          consequence="Some do site. Os produtos continuam na loja."
          action={deleteKit.bind(null, kit.id)}
        />
      )}
    </form>
  );
}

/**
 * A API devolve as fotos dos produtos quando o kit não tem foto própria;
 * essas não devem virar fotos do kit ao salvar.
 */
function hasOwnImages(kit: AdminKit) {
  const productPhotos = new Set(kit.items.map((i) => i.image?.src));
  return kit.images.some((img) => !productPhotos.has(img.src));
}
