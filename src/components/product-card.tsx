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
    <article className="group flex w-full flex-1 flex-col">
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
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {image.illustrative && <IllustrativeTag />}
      </Link>

      <div className="flex flex-1 flex-col pt-3">
        <p translate="no" className="text-small text-ink-muted font-medium">
          {product.brand}
        </p>
        <h3 className="mt-0.5 text-pretty">
          <Link href={href} className="hover:underline">
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
