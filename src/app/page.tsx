import { Suspense } from "react";

import { Container } from "@/components/container";
import { Hero } from "@/components/hero";
import { HowToBuy } from "@/components/how-to-buy";
import { CategoryChips, ProductBrowser } from "@/components/product-browser";
import { ProductGrid } from "@/components/product-grid";
import { countByCategory } from "@/features/catalog/filter";
import { getVisibleProducts } from "@/features/catalog/queries";

export default async function Home() {
  const products = await getVisibleProducts();

  return (
    <>
      <Hero counts={countByCategory(products)} />

      <section
        id="produtos"
        aria-labelledby="produtos-titulo"
        className="scroll-mt-4 py-12 lg:py-20"
      >
        <Container>
          <h2 id="produtos-titulo" className="font-display text-head mb-5">
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
    </>
  );
}
