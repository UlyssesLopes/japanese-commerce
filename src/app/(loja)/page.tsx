import { Suspense } from "react";

import { Container } from "@/components/container";
import { Hero } from "@/components/hero";
import { HowToBuy } from "@/components/how-to-buy";
import { CategoryChips, ProductBrowser } from "@/components/product-browser";
import { ProductGrid } from "@/components/product-grid";
import { SellerSection } from "@/components/seller-section";
import { countByCategory } from "@/features/catalog/filter";
import { stockBadge } from "@/features/catalog/stock-badge";
import {
  getStoreSettings,
  getVisibleProducts,
} from "@/features/catalog/queries";

export default async function Home() {
  const [products, settings] = await Promise.all([
    getVisibleProducts(),
    getStoreSettings(),
  ]);

  return (
    <>
      <Hero
        counts={countByCategory(products)}
        showcase={products
          .filter((p) => p.images.length > 0)
          .map((p) => ({
            slug: p.slug,
            brand: p.brand,
            name: p.name,
            priceCents: p.priceCents,
            image: { src: p.images[0].src, alt: p.images[0].alt },
            badge: stockBadge(p),
          }))}
      />

      <section
        id="produtos"
        aria-labelledby="produtos-titulo"
        className="bg-surface-raised mt-12 scroll-mt-4 py-12 lg:mt-20 lg:py-20"
      >
        <Container>
          <h2
            id="produtos-titulo"
            className="font-display text-head reveal mb-5"
          >
            Produtos
          </h2>
          {products.length > 0 ? (
            // O filtro lê a URL no navegador; antes disso, mostra tudo.
            <Suspense
              fallback={
                <>
                  <CategoryChips active={null} />
                  <div className="mt-[3.25rem]">
                    <ProductGrid products={products} />
                  </div>
                </>
              }
            >
              <ProductBrowser products={products} />
            </Suspense>
          ) : (
            <p className="text-lead">
              Os produtos estão sendo fotografados e aparecem aqui em breve.
            </p>
          )}
        </Container>
      </section>

      <HowToBuy />

      <SellerSection settings={settings} />
    </>
  );
}
