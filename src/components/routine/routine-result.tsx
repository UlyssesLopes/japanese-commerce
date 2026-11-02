"use client";

import Image from "next/image";
import Link from "next/link";
import type { RefObject } from "react";

import { siteConfig } from "@/config/site";
import { addItems } from "@/features/cart/cart";
import { useCart } from "@/features/cart/store";
import { displayImage } from "@/features/catalog/example-images";
import { buildWhatsAppUrl } from "@/features/checkout/whatsapp";
import {
  answerSummary,
  areaTitle,
  buildRoutineMessage,
} from "@/features/routine/message";
import { recommend, type Answers } from "@/features/routine/recommend";
import { concerns, type Question } from "@/features/routine/taxonomy";
import { formatPrice } from "@/lib/currency";
import type { Product } from "@/types/product";

import { AddToCartButton } from "../cart/add-to-cart-button";
import { useResolvedCart } from "../cart/cart-provider";

const concernLabel = (value: string) =>
  concerns.find((c) => c.value === value)?.label ?? value;

export function RoutineResult({
  products,
  quiz,
  answers,
  titleRef,
}: {
  products: Product[];
  quiz: Question[];
  answers: Answers;
  titleRef: RefObject<HTMLHeadingElement | null>;
}) {
  const routines = recommend(products, quiz, answers);
  const summary = answerSummary(quiz, answers);
  const picks = routines.flatMap((r) => r.steps.map((s) => s.product));
  const totalCents = picks.reduce((sum, p) => sum + (p.priceCents ?? 0), 0);

  const addMany = useCart((s) => s.addMany);
  const { lines } = useResolvedCart();
  const inCart = lines.map((l) => ({ slug: l.product.slug, quantity: 1 }));
  const missing = addItems(inCart, picks).length - inCart.length;

  const whatsappUrl = siteConfig.whatsappNumber
    ? buildWhatsAppUrl(
        siteConfig.whatsappNumber,
        routines.length > 0
          ? buildRoutineMessage(routines, summary)
          : `Olá! Fiz o "Descubra sua rotina" no site (${summary.join(", ")}) e não achei um produto. Pode me ajudar?`,
      )
    : null;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div>
          <h1
            ref={titleRef}
            tabIndex={-1}
            className="font-display text-head text-balance outline-none"
          >
            Sua rotina
          </h1>
          {summary.length > 0 && (
            <p className="text-lead text-ink-muted mt-3">
              Para: {summary.join(" · ")}
            </p>
          )}
        </div>
        <Link
          href="/descobrir"
          scroll={false}
          className="bg-surface-raised text-brand hover:bg-placeholder inline-flex h-11 items-center px-5 font-medium transition-colors"
        >
          Refazer as perguntas
        </Link>
      </div>

      {routines.length === 0 ? (
        <div className="bg-surface-raised mt-10 max-w-[60ch] p-6">
          <p className="text-lead">
            No momento não temos um produto à venda que combine com essas
            respostas.
          </p>
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand text-brand-ink hover:bg-brand-hover mt-5 inline-flex h-11 items-center px-6 font-medium transition-colors"
            >
              Perguntar no WhatsApp
            </a>
          )}
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="grid gap-12 lg:col-span-8">
            {routines.map((r) => (
              <section key={r.area} aria-labelledby={`rotina-${r.area}`}>
                {routines.length > 1 && (
                  <h2
                    id={`rotina-${r.area}`}
                    className="font-display mb-5 text-[1.75rem] leading-tight"
                  >
                    {areaTitle(r.area)}
                  </h2>
                )}
                <ol className="grid gap-4">
                  {r.steps.map((s, i) => (
                    <li
                      key={s.step}
                      className="bg-surface-raised animate-fade p-4 sm:p-5"
                    >
                      <p className="text-small text-ink-muted flex items-center gap-2 font-medium">
                        <span
                          aria-hidden="true"
                          className="bg-brand text-brand-ink flex size-6 items-center justify-center rounded-full"
                        >
                          {i + 1}
                        </span>
                        <span>
                          <span className="sr-only">Passo {i + 1}: </span>
                          {s.stepLabel}
                        </span>
                      </p>
                      <StepProduct product={s.product} matched={s.matched} />
                      {s.alternatives.length > 0 && (
                        <p className="text-small text-ink-muted border-placeholder mt-4 border-t pt-3">
                          Também serve:{" "}
                          {s.alternatives.map((a, j) => (
                            <span key={a.slug}>
                              {j > 0 && ", "}
                              <Link
                                href={`/produtos/${a.slug}`}
                                className="text-ink underline underline-offset-4 hover:no-underline"
                              >
                                {a.brand} {a.name}
                                {a.subtitle ? ` ${a.subtitle}` : ""}
                              </Link>
                            </span>
                          ))}
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
                {r.kits.map((kit) => (
                  <KitCallout key={kit.slug} kit={kit} />
                ))}
              </section>
            ))}
          </div>

          <aside className="lg:col-span-4">
            <div className="bg-surface-raised p-5 sm:p-6 lg:sticky lg:top-6">
              <p className="text-ink-muted">
                {picks.length} {picks.length === 1 ? "produto" : "produtos"} na
                rotina
              </p>
              <p className="font-display mt-1 text-[2rem] leading-tight tabular-nums">
                {formatPrice(totalCents)}
              </p>
              <button
                type="button"
                disabled={missing === 0}
                onClick={() => addMany(picks)}
                className="bg-brand text-brand-ink hover:bg-brand-hover disabled:bg-surface disabled:text-ink-muted mt-5 h-12 w-full px-4 font-medium transition-colors disabled:cursor-not-allowed"
              >
                {missing === 0
                  ? "A rotina já está na sacola"
                  : missing === picks.length
                    ? "Colocar a rotina na sacola"
                    : `Colocar ${missing === 1 ? "o que falta" : `os ${missing} que faltam`} na sacola`}
              </button>
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-surface text-brand hover:bg-placeholder mt-3 flex h-12 w-full items-center justify-center px-4 font-medium transition-colors"
                >
                  Tirar dúvida no WhatsApp
                </a>
              )}
              <p className="text-small text-ink-muted mt-4">
                Na sacola você ajusta as quantidades ou tira o que não quiser.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function StepProduct({
  product,
  matched,
}: {
  product: Product;
  matched: string[];
}) {
  const image = displayImage(product);
  const href = `/produtos/${product.slug}`;
  return (
    <div className="mt-4 grid grid-cols-[6rem_minmax(0,1fr)] gap-4 sm:grid-cols-[8rem_minmax(0,1fr)_12rem] sm:items-center">
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className="bg-surface relative block aspect-square overflow-hidden"
      >
        <Image
          src={image.src}
          alt=""
          fill
          sizes="8rem"
          className="object-cover"
        />
      </Link>
      <div className="min-w-0">
        <p translate="no" className="text-small text-ink-muted font-medium">
          {product.brand}
        </p>
        <h3 className="text-pretty">
          <Link href={href} className="underline-offset-4 hover:underline">
            {product.name}
            {product.subtitle ? ` ${product.subtitle}` : ""}
          </Link>
        </h3>
        <p className="mt-1 font-semibold tabular-nums">
          {formatPrice(product.priceCents)}
        </p>
        {product.indication && (
          <p className="text-small text-ink-muted mt-2 max-w-[56ch]">
            {product.indication}
          </p>
        )}
        <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Combina com">
          {matched.map((m) => (
            <li
              key={m}
              className="bg-surface text-small rounded-full px-3 py-0.5"
            >
              {concernLabel(m)}
            </li>
          ))}
        </ul>
      </div>
      <div className="col-span-2 sm:col-span-1">
        <AddToCartButton product={product} variant="secondary" />
      </div>
    </div>
  );
}

function KitCallout({ kit }: { kit: Product }) {
  return (
    <div className="border-brand mt-4 border p-4 sm:p-5">
      <p className="text-small text-ink-muted font-medium">Também tem em kit</p>
      <div className="mt-3 grid gap-4 sm:grid-cols-[minmax(0,1fr)_12rem] sm:items-center">
        <div>
          <h3>
            <Link
              href={`/produtos/${kit.slug}`}
              className="underline-offset-4 hover:underline"
            >
              {kit.name}
            </Link>
          </h3>
          <p className="text-small text-ink-muted mt-1">
            {kit.kitItems?.map((i) => `${i.brand} ${i.name}`).join(" + ")}
          </p>
          <p className="mt-1 font-semibold tabular-nums">
            {formatPrice(kit.priceCents)}
          </p>
        </div>
        <AddToCartButton product={kit} />
      </div>
    </div>
  );
}
