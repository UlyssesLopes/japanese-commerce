import "server-only";

import { siteConfig } from "@/config/site";
import type { AppliedCoupon } from "@/types/coupon";

export type CouponValidation =
  { ok: true; coupon: AppliedCoupon } | { ok: false; reason: string };

/**
 * Única porta dos cupons no site: a API confere código, validade e status
 * (mesmas regras de `coupons.ts`) e devolve só o cupom pedido.
 */
export async function validateCoupon(code: string): Promise<CouponValidation> {
  const base = (process.env.BACKEND_URL ?? "http://localhost:8080").replace(
    /\/$/,
    "",
  );
  try {
    const res = await fetch(`${base}/api/coupons/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
      cache: "no-store",
    });
    const body = (await res.json()) as {
      ok: boolean;
      coupon?: AppliedCoupon;
      reason?: string;
    };
    if (body.ok && body.coupon) return { ok: true, coupon: body.coupon };
    return { ok: false, reason: body.reason ?? "Cupom não encontrado." };
  } catch {
    return {
      ok: false,
      reason: "Não consegui conferir o cupom agora. Tente de novo.",
    };
  }
}

/** Data de hoje no fuso da loja (AAAA-MM-DD), para validade dos cupons. */
export function todayInStore(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: siteConfig.timeZone,
  }).format(now);
}
