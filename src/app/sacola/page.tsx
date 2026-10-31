import type { Metadata } from "next";

import { CartContents } from "@/components/cart/cart-contents";
import { Container } from "@/components/container";
import { ProductGrid } from "@/components/product-grid";
import { getVisibleProducts } from "@/features/catalog/queries";

export const metadata: Metadata = { title: "Sacola" };

export default async function SacolaPage() {
  // Sugestões para a página não ficar vazia; só produtos com foto própria.
  const suggestions = (await getVisibleProducts())
    .filter((p) => p.images.length > 0)
    .slice(0, 4);

  return (
    <>
      <Container className="py-10 lg:py-16">
        <h1 className="font-display text-head">Sua sacola</h1>
        <p className="text-ink-muted mt-2">
          Revise os itens e envie o pedido pelo WhatsApp.
        </p>
        <div className="mt-6 max-w-2xl">
          <CartContents />
        </div>
      </Container>

      {suggestions.length > 0 && (
        <section
          aria-labelledby="sugestoes"
          className="bg-surface-raised py-12 lg:py-16"
        >
          <Container>
            <h2 id="sugestoes" className="font-display text-head mb-6">
              Você também pode gostar
            </h2>
            <ProductGrid products={suggestions} />
          </Container>
        </section>
      )}
    </>
  );
}
