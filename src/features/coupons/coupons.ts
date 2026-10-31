import type { AppliedCoupon, Coupon } from "@/types/coupon";
import { formatPrice } from "@/lib/currency";

/** Códigos são comparados em maiúsculas, sem espaços. */
export function normalizeCode(code: string): string {
  return code.trim().toUpperCase().replace(/\s+/g, "");
}

export type CouponCheck =
  { ok: true; coupon: Coupon } | { ok: false; reason: string };

/** O cupom existe, está ativo e dentro do período? (Não olha o subtotal.) */
export function checkCoupon(
  coupons: Coupon[],
  code: string,
  today: string,
): CouponCheck {
  const coupon = coupons.find((c) => c.code === normalizeCode(code));
  if (!coupon || !coupon.active)
    return { ok: false, reason: "Cupom não encontrado." };
  if (coupon.startsAt && today < coupon.startsAt)
    return { ok: false, reason: "Este cupom ainda não está valendo." };
  if (coupon.endsAt && today > coupon.endsAt)
    return { ok: false, reason: "Este cupom expirou." };
  return { ok: true, coupon };
}

export type DiscountResult = {
  discountCents: number;
  totalCents: number;
  /** Motivo de o desconto ser zero (ex.: subtotal abaixo do mínimo). */
  blockedReason?: string;
};

/** Calcula o desconto em centavos inteiros; nunca passa do subtotal. */
export function applyCoupon(
  subtotalCents: number,
  coupon: AppliedCoupon | null,
): DiscountResult {
  if (!coupon || subtotalCents <= 0)
    return { discountCents: 0, totalCents: subtotalCents };

  if (coupon.minSubtotalCents && subtotalCents < coupon.minSubtotalCents)
    return {
      discountCents: 0,
      totalCents: subtotalCents,
      blockedReason: `Vale para compras a partir de ${formatPrice(coupon.minSubtotalCents)}.`,
    };

  const raw =
    coupon.type === "percent"
      ? Math.floor((subtotalCents * coupon.value) / 100)
      : coupon.value;
  const discountCents = Math.min(raw, subtotalCents);
  return { discountCents, totalCents: subtotalCents - discountCents };
}

/** Rótulo curto do cupom, ex.: "10% off" ou "R$ 20,00 off". */
export function couponLabel(coupon: AppliedCoupon): string {
  return (
    coupon.description ??
    (coupon.type === "percent"
      ? `${coupon.value}% de desconto`
      : `${formatPrice(coupon.value)} de desconto`)
  );
}
