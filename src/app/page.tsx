import { Container } from "@/components/container";
import { Hero } from "@/components/hero";
import { ProductSection } from "@/components/product-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { categories } from "@/features/catalog/categories";
import { getVisibleProducts } from "@/features/catalog/queries";

export default async function Home() {
  const products = await getVisibleProducts();
  const sections = categories
    .map((c) => ({
      ...c,
      products: products.filter((p) => p.category === c.slug),
    }))
    .filter((s) => s.products.length > 0);

  return (
    <>
      <a
        href="#conteudo"
        className="focus:bg-brand focus:text-brand-ink sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-10 focus:px-4 focus:py-3"
      >
        Pular para o conteúdo
      </a>
      <SiteHeader />
      <main id="conteudo" className="flex-1">
        <Hero />
        <Container
          id="produtos"
          className="scroll-mt-6 space-y-24 pt-16 lg:space-y-40 lg:pt-24"
        >
          {sections.length > 0 ? (
            sections.map((s) => (
              <ProductSection
                key={s.slug}
                id={s.slug}
                title={s.label}
                products={s.products}
              />
            ))
          ) : (
            <p className="text-lead">
              Os produtos estão sendo fotografados e chegam aqui em breve.
            </p>
          )}
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
