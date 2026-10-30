import Image from "next/image";

import { isPurchasable } from "@/features/catalog/eligibility";
import { formatPrice } from "@/lib/currency";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];
  const details = [product.subtitle, product.volume]
    .filter(Boolean)
    .join(" · ");
  const canBuy = isPurchasable(product);

  return (
    <article className="flex w-full flex-1 flex-col">
      <div className="bg-surface-raised relative aspect-[4/5]">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover"
          />
        ) : (
          // Sem foto aprovada: a marca composta no lugar, nunca outra imagem.
          <div
            aria-hidden="true"
            translate="no"
            className="font-display text-ink-muted absolute inset-0 flex items-center justify-center p-4 text-center text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)] leading-none"
          >
            {product.brand}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-3">
        <p translate="no" className="text-small text-ink-muted">
          {product.brand}
        </p>
        <h3 className="mt-1 font-medium text-pretty">{product.name}</h3>
        {details && <p className="text-small text-ink-muted">{details}</p>}
        <p
          className={`mt-2 tabular-nums ${product.priceCents === null ? "text-ink-muted" : "font-semibold"}`}
        >
          {formatPrice(product.priceCents)}
        </p>

        {canBuy && (
          // A ação de verdade chega com a sacola, na fase 4.
          <div className="mt-auto pt-4">
            <button
              type="button"
              className="bg-brand text-brand-ink hover:bg-brand-hover h-12 w-full px-4 font-medium transition-colors"
            >
              Adicionar à sacola
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
