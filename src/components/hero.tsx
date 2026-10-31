import Link from "next/link";

import { siteConfig } from "@/config/site";
import { categories } from "@/features/catalog/categories";
import type { ProductCategory } from "@/types/product";

import { Container } from "./container";
import { HeroShowcase, type ShowcaseItem } from "./hero-showcase";

/** Cores do quadro da marca, uma por categoria. */
const tiles: Record<ProductCategory, { className: string; text: string }> = {
  cabelos: {
    className: "bg-brand text-brand-ink",
    text: "Shampoos, refis e tratamentos",
  },
  skincare: {
    className: "bg-tile-rose text-ink",
    text: "Loções, séruns e limpeza",
  },
  maquiagem: {
    className: "bg-tile-taupe text-ink",
    text: "Olhos e lábios",
  },
  kits: {
    className: "bg-tile-charcoal text-brand-ink",
    text: "Conjuntos da mesma linha",
  },
};

export function Hero({
  counts,
  showcase,
}: {
  counts: Record<ProductCategory, number>;
  showcase: ShowcaseItem[];
}) {
  return (
    <>
      <section aria-labelledby="titulo">
        <Container className="grid gap-8 pt-6 pb-10 md:grid-cols-12 md:items-center lg:pt-10 lg:pb-16">
          <div className="md:order-2 md:col-span-6">
            <HeroShowcase items={showcase} />
          </div>
          <div className="animate-rise md:order-1 md:col-span-6">
            <h1 id="titulo" className="font-display text-display text-balance">
              Cosméticos japoneses e coreanos
            </h1>
            <p className="text-ink-muted text-small mt-3 font-light tracking-[0.3em] uppercase">
              {siteConfig.slogan}
            </p>
            <p className="text-lead mt-5 max-w-[40ch]">
              Skincare, cabelos e maquiagem de marcas como Tsubaki, IHADA,
              &amp;honey e medicube. Monte sua sacola e finalize o pedido pelo
              WhatsApp.
            </p>
            <a
              href="#produtos"
              className="bg-brand text-brand-ink hover:bg-brand-hover mt-8 inline-flex h-12 items-center px-7 font-medium transition-colors"
            >
              Ver produtos
            </a>
          </div>
        </Container>
      </section>

      <section aria-labelledby="categorias-titulo">
        <Container>
          <h2 id="categorias-titulo" className="sr-only">
            Categorias
          </h2>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-4">
            {categories.map((c) => {
              const tile = tiles[c.slug];
              return (
                <li key={c.slug} className="reveal">
                  <Link
                    href={`/?categoria=${c.slug}#produtos`}
                    className={`group flex aspect-[4/3] flex-col justify-between p-4 transition-[filter] hover:brightness-95 lg:p-6 ${tile.className}`}
                  >
                    <span>
                      <span className="font-display block text-[1.75rem] leading-none lg:text-[2.25rem]">
                        {c.label}
                      </span>
                      <span className="text-small mt-2 block opacity-80">
                        {tile.text}
                      </span>
                    </span>
                    <span className="text-small flex items-baseline justify-between">
                      <span className="opacity-80">
                        {counts[c.slug]}{" "}
                        {counts[c.slug] === 1 ? "produto" : "produtos"}
                      </span>
                      <span
                        aria-hidden="true"
                        className="text-lead transition-transform group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>
    </>
  );
}
