import { notFound } from "next/navigation";

import { Container } from "@/components/container";
import { ProductCard } from "@/components/product-card";
import { fixtureStates } from "@/features/catalog/fixtures";

export const metadata = { title: "Estados dos componentes" };

/** Página só local, para ver cada estado do card com produtos de exemplo. */
export default function EstadosPage() {
  if (process.env.CATALOG_SHOW_DRAFTS !== "true") notFound();

  return (
    <Container className="py-12">
      <h1 className="font-display text-head">Estados do card</h1>
      <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
        {fixtureStates.map(({ label, product }) => (
          <li key={product.id} className="flex flex-col">
            <p className="text-small text-ink-muted mb-2">{label}</p>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </Container>
  );
}
