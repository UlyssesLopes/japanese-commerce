import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { categories } from "@/features/catalog/categories";
import { exampleImages } from "@/features/catalog/example-images";
import type { ProductCategory } from "@/types/product";

import abertura from "../../public/exemplos/abertura.png";

import { Container } from "./container";

export function Hero({ counts }: { counts: Record<ProductCategory, number> }) {
  return (
    <>
      <section aria-labelledby="titulo">
        <Container className="grid gap-8 pt-6 pb-10 md:grid-cols-12 md:items-center lg:pt-10 lg:pb-16">
          <div className="md:order-2 md:col-span-6">
            <div className="bg-surface-raised relative aspect-[16/10] overflow-hidden">
              <Image
                src={abertura}
                alt="Mulher aplicando sérum facial com conta-gotas"
                priority
                fill
                sizes="(min-width: 768px) 58vw, 100vw"
                className="object-cover object-[30%_50%]"
              />
            </div>
          </div>
          <div className="md:order-1 md:col-span-6">
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
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/?categoria=${c.slug}#produtos`}
                  className="group block"
                >
                  <span className="bg-surface-raised relative block aspect-[4/3] overflow-hidden">
                    <Image
                      src={exampleImages[c.slug][0].src}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 25vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </span>
                  <span className="mt-2 flex items-baseline justify-between gap-2">
                    <span className="font-medium group-hover:underline">
                      {c.label}
                    </span>
                    <span className="text-small text-ink-muted">
                      {counts[c.slug]}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
