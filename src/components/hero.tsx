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
    // No desktop, abertura e categorias ocupam exatamente a primeira tela:
    // os blocos ficam no rodapé da tela e a abertura centraliza no espaço que sobra.
    <div className="flex flex-col lg:min-h-[min(calc(100svh-5rem),50rem)] lg:pb-8">
      <section
        aria-labelledby="titulo"
        className="lg:flex lg:flex-1 lg:items-center"
      >
        <Container className="grid gap-8 pt-6 pb-10 lg:grid-cols-12 lg:items-center lg:py-10">
          <div className="animate-rise lg:col-span-6">
            <h1 id="titulo" className="font-display text-display text-balance">
              Cosméticos japoneses e coreanos
            </h1>
            <p className="text-ink-muted text-small mt-3 font-light tracking-[0.3em] uppercase">
              {siteConfig.slogan}
            </p>
            <p className="text-lead mt-6 max-w-[38ch]">
              Os favoritos da beleza japonesa e coreana, escolhidos para o seu
              ritual de todo dia.
            </p>
            <p className="text-ink-muted mt-3 max-w-[44ch]">
              Poucas unidades de cada. Escolha, monte sua sacola e finalize pelo
              WhatsApp.
            </p>
            <a
              href="#produtos"
              className="bg-brand text-brand-ink hover:bg-brand-hover mt-8 inline-flex h-12 items-center px-7 font-medium transition-colors"
            >
              Ver produtos
            </a>
          </div>
          <div className="lg:col-span-6">
            <HeroShowcase items={showcase} />
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
                    className={`group flex min-h-36 flex-col justify-between gap-6 p-4 transition-[filter] hover:brightness-95 lg:min-h-40 lg:p-6 ${tile.className}`}
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
    </div>
  );
}
