import type { Product } from "@/types/product";

import { ProductCard } from "./product-card";

export function ProductSection({
  id,
  title,
  products,
}: {
  id: string;
  title: string;
  products: Product[];
}) {
  const headingId = `${id}-titulo`;
  return (
    <section id={id} aria-labelledby={headingId} className="scroll-mt-6">
      <div className="flex items-baseline gap-4">
        <h2
          id={headingId}
          className="font-display text-head tracking-[-0.015em]"
        >
          {title}
        </h2>
        <p className="text-small text-ink-muted">
          {products.length} {products.length === 1 ? "produto" : "produtos"}
        </p>
      </div>
      <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:mt-8 lg:grid-cols-4 lg:gap-y-14">
        {products.map((p) => (
          <li key={p.id} className="flex">
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
