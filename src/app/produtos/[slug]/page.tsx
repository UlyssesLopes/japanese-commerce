import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Container } from "@/components/container";
import { IllustrativeTag } from "@/components/illustrative-tag";
import { ProductGrid } from "@/components/product-grid";
import { categories } from "@/features/catalog/categories";
import { displayImage } from "@/features/catalog/example-images";
import { isPurchasable } from "@/features/catalog/eligibility";
import {
  getProductBySlug,
  getVisibleProducts,
} from "@/features/catalog/queries";
import { formatPrice } from "@/lib/currency";

/** Com Cache Components a lista não pode ser vazia (todos em rascunho hoje). */
const EMPTY_PLACEHOLDER = "__sem-produtos__";

export async function generateStaticParams() {
  const products = await getVisibleProducts();
  return products.length > 0
    ? products.map((p) => ({ slug: p.slug }))
    : [{ slug: EMPTY_PLACEHOLDER }];
}

export async function generateMetadata({
  params,
}: PageProps<"/produtos/[slug]">): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug);
  if (!product) return {};
  return {
    title: `${product.brand} ${product.name}`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/produtos/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const image = displayImage(product);
  const category = categories.find((c) => c.slug === product.category);
  const related = (await getVisibleProducts())
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);

  // Só o que foi verificado na embalagem; o resto fica de fora.
  const facts = [
    ["Marca", product.brand],
    ["Variante", product.subtitle],
    ["Tamanho", product.volume],
    ["Origem", product.countryOfOrigin],
    ["Validade", product.expirationDate],
  ].filter((f): f is [string, string] => Boolean(f[1]));

  return (
    <Container className="py-6 lg:py-10">
      <nav aria-label="Você está em" className="text-small text-ink-muted">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/" className="hover:underline">
              Início
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/?categoria=${product.category}#produtos`}
              className="hover:underline"
            >
              {category?.label}
            </Link>
          </li>
        </ol>
      </nav>

      <div className="mt-6 grid gap-8 md:grid-cols-12 lg:gap-12">
        <div className="md:col-span-7">
          <div className="bg-surface-raised relative aspect-square overflow-hidden">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              sizes="(min-width: 768px) 58vw, 100vw"
              className="object-cover"
            />
            {image.illustrative && <IllustrativeTag />}
          </div>
        </div>

        <div className="md:col-span-5">
          <p translate="no" className="text-ink-muted font-medium">
            {product.brand}
          </p>
          <h1 className="font-display text-head mt-1 text-balance">
            {product.name}
          </h1>
          {product.subtitle && (
            <p className="text-lead text-ink-muted mt-1">{product.subtitle}</p>
          )}

          <p
            className={`mt-6 tabular-nums ${product.priceCents === null ? "text-lead text-ink-muted" : "text-head font-display"}`}
          >
            {formatPrice(product.priceCents)}
          </p>

          <div className="mt-6">
            {isPurchasable(product) ? (
              <>
                <AddToCartButton product={product} className="h-12" />
                <p className="text-small text-ink-muted mt-3">
                  {product.availableQuantity === 1
                    ? "1 unidade disponível."
                    : `${product.availableQuantity} unidades disponíveis.`}{" "}
                  Pagamento e entrega combinados pelo WhatsApp.
                </p>
              </>
            ) : (
              <p className="bg-surface-raised p-4">
                Este produto ainda não está disponível para compra.
              </p>
            )}
          </div>

          {product.description && (
            <p className="mt-8 max-w-[60ch]">{product.description}</p>
          )}

          <dl className="mt-8 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
            {facts.map(([label, value]) => (
              <div key={label} className="contents">
                <dt className="text-ink-muted">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>

          <div className="divide-placeholder mt-8 divide-y">
            {product.benefits && product.benefits.length > 0 && (
              <Details title="Benefícios">
                <ul className="list-disc space-y-1 pl-5">
                  {product.benefits.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </Details>
            )}
            {product.usageInstructions && (
              <Details title="Modo de uso">
                <p>{product.usageInstructions}</p>
              </Details>
            )}
            {product.ingredients && product.ingredients.length > 0 && (
              <Details title="Ingredientes">
                <p>{product.ingredients.join(", ")}</p>
              </Details>
            )}
          </div>
          {!product.contentVerified && (
            <p className="text-small text-ink-muted mt-6">
              Mais informações sobre este produto estão em verificação.
            </p>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="relacionados" className="mt-16 lg:mt-24">
          <h2 id="relacionados" className="font-display text-head mb-6">
            Você também pode gostar
          </h2>
          <ProductGrid products={related} />
        </section>
      )}
    </Container>
  );
}

function Details({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
        {title}
        <span
          aria-hidden="true"
          className="transition-transform group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="text-ink-muted mt-3">{children}</div>
    </details>
  );
}
