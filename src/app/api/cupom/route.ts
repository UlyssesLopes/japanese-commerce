import { z } from "zod";

import { validateCoupon } from "@/features/coupons/queries";

const bodySchema = z.object({ code: z.string().max(40) });

/**
 * Valida um código de cupom na API. Responde só sobre o código pedido, para
 * a lista de cupons nunca chegar ao navegador.
 */
export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return Response.json(
      { ok: false, reason: "Código inválido." },
      { status: 400 },
    );

  const result = await validateCoupon(parsed.data.code);
  return Response.json(result, { status: result.ok ? 200 : 404 });
}
