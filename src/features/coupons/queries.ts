import "server-only";

import { coupons, demoCoupons } from "@/data/coupons";
import { siteConfig } from "@/config/site";
import { couponSchema, type Coupon } from "@/types/coupon";

/** Única porta de leitura dos cupons (troca por banco no backoffice). */
export function getCoupons(): Coupon[] {
  const all =
    process.env.COUPONS_DEMO === "true"
      ? [...coupons, ...demoCoupons]
      : coupons;
  return all.map((c) => couponSchema.parse(c));
}

/** Data de hoje no fuso da loja (AAAA-MM-DD), para validade dos cupons. */
export function todayInStore(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: siteConfig.timeZone,
  }).format(now);
}
