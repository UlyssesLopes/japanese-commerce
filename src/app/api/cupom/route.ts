import { z } from "zod";

import { checkCoupon } from "@/features/coupons/coupons";
import { getCoupons, todayInStore } from "@/features/coupons/queries";
import type { AppliedCoupon } from "@/types/coupon";

const bodySchema = z.object({ code: z.string().max(40) });

/**
 * Valida um código de cupom. Responde só sobre o código pedido, para a
 * lista de cupons nunca chegar ao navegador.
 */
export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return Response.json(
      { ok: false, reason: "Código inválido." },
      { status: 400 },
    );

  const result = checkCoupon(getCoupons(), parsed.data.code, todayInStore());
  if (!result.ok) return Response.json(result, { status: 404 });

  const { code, type, value, minSubtotalCents, description } = result.coupon;
  const coupon: AppliedCoupon = {
    code,
    type,
    value,
    minSubtotalCents,
    description,
  };
  return Response.json({ ok: true, coupon });
}
