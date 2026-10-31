import Image from "next/image";
import Link from "next/link";

import { displayImage } from "@/features/catalog/example-images";
import { isPurchasable } from "@/features/catalog/eligibility";
import { formatPrice } from "@/lib/currency";
import type { Product } from "@/types/product";

import { AddToCartButton } from "./cart/add-to-cart-button";
import { IllustrativeTag } from "./illustrative-tag";

export function ProductCard({ product }: { product: Product }) {
  const image = displayImage(product);
  const href = `/produtos/${product.slug}`;
  const details = [product.subtitle, product.volume]
    .filter(Boolean)
    .join(" · ");

  return (
    // O produto sob o mouse sobe e os outros da grade se apagam.
    <article className="group hover:bg-surface -m-3 flex w-[calc(100%+1.5rem)] flex-1 flex-col p-3 transition-[translate,opacity,background-color,box-shadow,filter] duration-300 ease-out group-hover/grid:opacity-45 group-hover/grid:saturate-50 hover:-translate-y-2 hover:opacity-100 hover:shadow-[0_18px_40px_-18px_rgb(36_35_31/0.35)] hover:saturate-100">
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className="bg-surface relative block aspect-square overflow-hidden"
      >
        <Image
          src={image.src}
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
        />
        {image.illustrative && <IllustrativeTag />}
      </Link>

      <div className="flex flex-1 flex-col pt-3">
        <p translate="no" className="text-small text-ink-muted font-medium">
          {product.brand}
        </p>
        <h3 className="mt-0.5 text-pretty">
          <Link
            href={href}
            className="underline-offset-4 group-hover:underline"
          >
            {product.name}
          </Link>
        </h3>
        {details && <p className="text-small text-ink-muted">{details}</p>}
        <p
          className={`mt-2 tabular-nums ${product.priceCents === null ? "text-ink-muted" : "font-semibold"}`}
        >
          {formatPrice(product.priceCents)}
        </p>

        {isPurchasable(product) && (
          <div className="mt-auto pt-4">
            <AddToCartButton product={product} />
          </div>
        )}
      </div>
    </article>
  );
}
