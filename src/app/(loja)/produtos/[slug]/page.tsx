import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Container } from "@/components/container";
import { ProductGallery } from "@/components/product-gallery";
import { ProductGrid } from "@/components/product-grid";
import { siteConfig } from "@/config/site";
import { categories } from "@/features/catalog/categories";
import { isPurchasable } from "@/features/catalog/eligibility";
import { displayImages } from "@/features/catalog/example-images";
import { stockBadge } from "@/features/catalog/stock-badge";
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
  const title = `${product.brand} ${product.name}`;
  const description =
    product.description ??
    [product.subtitle, product.volume, formatPrice(product.priceCents)]
      .filter(Boolean)
      .join(" · ");
  return {
    title,
    description,
    // Prévia do link (WhatsApp, Instagram); a imagem vem de opengraph-image.tsx.
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: siteConfig.name,
      title: `${title} · ${formatPrice(product.priceCents)}`,
      description,
    },
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/produtos/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const category = categories.find((c) => c.slug === product.category);
  const related = (await getVisibleProducts())
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);
  const canBuy = isPurchasable(product);

  // Só o que foi informado ou verificado; o resto fica de fora.
  const facts = [
    // Kit não tem marca própria: as marcas aparecem em "O que vem no kit".
    ["Marca", product.kitItems ? undefined : product.brand],
    ["Variante", product.subtitle],
    ["Tamanho", product.volume],
    ["Origem da marca", product.countryOfOrigin],
    ["Validade", product.expirationDate],
  ].filter((f): f is [string, string] => Boolean(f[1]));

  const usage = product.usageInstructions?.split(/\n\s*\n/) ?? [];
  const hasDetails =
    Boolean(product.indication) ||
    Boolean(product.benefits?.length) ||
    usage.length > 0 ||
    Boolean(product.highlight) ||
    Boolean(product.precautions?.length) ||
    Boolean(product.ingredients?.length);

  return (
    <>
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

        <div className="mt-6 grid gap-8 md:grid-cols-12 lg:gap-14">
          <div className="md:col-span-6 lg:col-span-7">
            <div className="md:sticky md:top-6">
              <ProductGallery
                images={displayImages(product)}
                badge={stockBadge(product)}
              />
            </div>
          </div>

          <div className="md:col-span-6 lg:col-span-5">
            <p translate="no" className="text-ink-muted font-medium">
              {product.brand}
            </p>
            <h1 className="font-display text-head mt-1 text-balance">
              {product.name}
            </h1>
            {(product.subtitle || product.volume) && (
              <p className="text-lead text-ink-muted mt-2">
                {[product.subtitle, product.volume].filter(Boolean).join(" · ")}
              </p>
            )}

            <p
              className={`mt-6 tabular-nums ${product.priceCents === null ? "text-lead text-ink-muted" : "text-[clamp(1.75rem,1.5rem+0.8vw,2.25rem)] font-semibold tracking-[-0.01em]"}`}
            >
              {formatPrice(product.priceCents)}
            </p>

            <div className="mt-5">
              {canBuy ? (
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

            {product.note && (
              <p className="text-brand mt-5 font-medium">{product.note}</p>
            )}

            {product.description && (
              <p className="text-lead mt-6 max-w-[60ch]">
                {product.description}
              </p>
            )}

            {product.kitItems && product.kitItems.length > 0 && (
              <div className="mt-8">
                <Section title="O que vem no kit">
                  <ul className="divide-placeholder divide-y">
                    {product.kitItems.map((item) => (
                      <li
                        key={item.slug}
                        className="flex items-baseline gap-3 py-2.5"
                      >
                        <span className="w-8 flex-none font-medium tabular-nums">
                          {item.quantity}×
                        </span>
                        <Link
                          href={`/produtos/${item.slug}`}
                          className="hover:underline"
                        >
                          <span translate="no" className="text-ink-muted">
                            {item.brand}
                          </span>{" "}
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Section>
              </div>
            )}

            {hasDetails && (
              <div className="mt-8 space-y-8">
                {product.indication && (
                  <Section title="Indicação">
                    <p>{product.indication}</p>
                  </Section>
                )}

                {product.benefits && product.benefits.length > 0 && (
                  <Section title="Benefícios">
                    <ul className="space-y-2">
                      {product.benefits.map((b) => (
                        <li key={b} className="flex gap-3">
                          <CheckIcon />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </Section>
                )}

                {usage.length > 0 && (
                  <Section title="Como usar">
                    <div className="space-y-3">
                      {usage.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </Section>
                )}

                {product.highlight && (
                  <Section title="Diferencial">
                    <p className="bg-surface-raised p-4">{product.highlight}</p>
                  </Section>
                )}

                {product.precautions && product.precautions.length > 0 && (
                  <Section title="Precauções">
                    <ul className="list-disc space-y-1 pl-5">
                      {product.precautions.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </Section>
                )}

                {product.ingredients && product.ingredients.length > 0 && (
                  <details className="group bg-surface-raised p-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                      Ingredientes
                      <span
                        aria-hidden="true"
                        className="text-lead text-brand transition-transform group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="text-small text-ink-muted mt-3">
                      {product.ingredients.join(", ")}
                    </p>
                  </details>
                )}
              </div>
            )}

            {facts.length > 0 && (
              <dl className="bg-surface-raised mt-8 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 p-5">
                {facts.map(([label, value]) => (
                  <div key={label} className="contents">
                    <dt className="text-ink-muted">{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {!product.contentVerified && (
              <p className="text-small text-ink-muted mt-6">
                Mais informações sobre este produto estão em verificação.
              </p>
            )}
          </div>
        </div>
      </Container>

      {related.length > 0 && (
        <section
          aria-labelledby="relacionados"
          className="bg-surface-raised mt-10 py-12 lg:mt-16 lg:py-16"
        >
          <Container>
            <h2 id="relacionados" className="font-display text-head mb-6">
              Você também pode gostar
            </h2>
            <ProductGrid products={related} />
          </Container>
        </section>
      )}
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lead mb-3 font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="fill-brand mt-0.5 size-5 shrink-0"
    >
      <path d="M10 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Zm4.03 6.28-4.75 5a.75.75 0 0 1-1.08.01l-2.25-2.25a.75.75 0 1 1 1.06-1.06l1.7 1.7 4.23-4.43a.75.75 0 1 1 1.09 1.03Z" />
    </svg>
  );
}
