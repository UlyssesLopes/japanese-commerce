import type { Coupon } from "@/types/coupon";

export type CouponStatus = "active" | "off" | "scheduled" | "expired";

/** Situação do cupom hoje (datas AAAA-MM-DD, inclusivas, no fuso da loja). */
export function couponStatus(coupon: Coupon, today: string): CouponStatus {
  if (!coupon.active) return "off";
  if (coupon.startsAt && today < coupon.startsAt) return "scheduled";
  if (coupon.endsAt && today > coupon.endsAt) return "expired";
  return "active";
}

export const couponStatusLabel: Record<CouponStatus, string> = {
  active: "Valendo",
  off: "Desativado",
  scheduled: "Agendado",
  expired: "Expirado",
};
