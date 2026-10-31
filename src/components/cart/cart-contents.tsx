"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import { siteConfig } from "@/config/site";
import { maxQuantity, toOrderLines } from "@/features/cart/cart";
import { useCart } from "@/features/cart/store";
import { displayImage } from "@/features/catalog/example-images";
import { applyCoupon } from "@/features/coupons/coupons";
import {
  buildOrderMessage,
  buildWhatsAppUrl,
} from "@/features/checkout/whatsapp";
import { formatPrice } from "@/lib/currency";

import { useResolvedCart } from "./cart-provider";
import { CouponField } from "./coupon-field";

/** Lista da sacola com total e envio pelo WhatsApp (drawer e /sacola). */
export function CartContents({ onNavigate }: { onNavigate?: () => void }) {
  const cart = useResolvedCart();
  const { setQuantity, remove, keep, coupon } = useCart();
  const discount = applyCoupon(cart.subtotalCents, coupon);

  // Itens que saíram de venda somem da sacola salva.
  const removedKey = cart.removed.join(",");
  useEffect(() => {
    if (removedKey) keep(cart.lines.map((l) => l.product.slug));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [removedKey]);

  if (cart.lines.length === 0) {
    return (
      <div className="py-10">
        <p className="text-lead">Sua sacola está vazia.</p>
        <Link
          href="/#produtos"
          onClick={onNavigate}
          className="bg-brand text-brand-ink hover:bg-brand-hover mt-6 inline-flex h-11 items-center px-6 font-medium"
        >
          Ver produtos
        </Link>
      </div>
    );
  }

  const whatsappUrl = siteConfig.whatsappNumber
    ? buildWhatsAppUrl(
        siteConfig.whatsappNumber,
        buildOrderMessage(
          toOrderLines(cart.lines),
          coupon
            ? { code: coupon.code, discountCents: discount.discountCents }
            : undefined,
        ),
      )
    : null;

  return (
    <div className="flex flex-col gap-6">
      {cart.removed.length > 0 && (
        <p role="status" className="bg-surface-raised text-small p-3">
          Alguns itens saíram de venda e foram retirados da sacola.
        </p>
      )}

      <ul className="flex flex-col gap-5">
        {cart.lines.map(({ product, quantity, lineTotalCents }) => {
          const image = displayImage(product);
          const max = maxQuantity(product);
          return (
            <li key={product.slug} className="flex gap-4">
              <Link
                href={`/produtos/${product.slug}`}
                onClick={onNavigate}
                className="bg-surface-raised relative size-20 shrink-0 overflow-hidden"
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <p translate="no" className="text-small text-ink-muted">
                  {product.brand}
                </p>
                <Link
                  href={`/produtos/${product.slug}`}
                  onClick={onNavigate}
                  className="hover:underline"
                >
                  {product.name}
                  {product.subtitle && ` (${product.subtitle})`}
                </Link>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label={`Diminuir quantidade de ${product.name}`}
                      onClick={() =>
                        quantity === 1
                          ? remove(product.slug)
                          : setQuantity(product.slug, quantity - 1)
                      }
                      className="bg-surface-raised hover:bg-placeholder size-9"
                    >
                      −
                    </button>
                    <span
                      className="w-8 text-center tabular-nums"
                      aria-label={`Quantidade: ${quantity}`}
                    >
                      {quantity}
                    </span>
                    <button
                      type="button"
                      aria-label={`Aumentar quantidade de ${product.name}`}
                      disabled={quantity >= max}
                      onClick={() => setQuantity(product.slug, quantity + 1)}
                      className="bg-surface-raised hover:bg-placeholder size-9 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-semibold tabular-nums">
                    {formatPrice(lineTotalCents)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(product.slug)}
                  className="text-small text-ink-muted hover:text-ink mt-1 self-start underline underline-offset-4"
                >
                  Remover
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="bg-surface-raised flex flex-col gap-4 p-4">
        <CouponField blockedReason={discount.blockedReason} />

        <dl className="flex flex-col gap-1">
          <div className="flex items-baseline justify-between">
            <dt>Subtotal</dt>
            <dd className="tabular-nums">{formatPrice(cart.subtotalCents)}</dd>
          </div>
          {discount.discountCents > 0 && (
            <div className="text-brand flex items-baseline justify-between">
              <dt>Desconto ({coupon?.code})</dt>
              <dd className="tabular-nums">
                −{formatPrice(discount.discountCents)}
              </dd>
            </div>
          )}
          <div className="flex items-baseline justify-between">
            <dt className="font-medium">Total</dt>
            <dd className="text-lead font-semibold tabular-nums">
              {formatPrice(discount.totalCents)}
            </dd>
          </div>
        </dl>
        <p className="text-small text-ink-muted mt-1">
          Pagamento e entrega são combinados pelo WhatsApp.
        </p>
        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand text-brand-ink hover:bg-brand-hover mt-4 flex h-12 w-full items-center justify-center px-4 font-medium"
          >
            Finalizar pedido pelo WhatsApp
          </a>
        ) : (
          <p className="text-small text-ink-muted mt-4">
            O envio pelo WhatsApp ainda não foi configurado.
          </p>
        )}
      </div>
    </div>
  );
}
