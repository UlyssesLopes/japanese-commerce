import { z } from "zod";

/**
 * Cupom de desconto. Percentual (`value` de 1 a 100) ou valor fixo
 * (`value` em centavos). Datas em ISO (AAAA-MM-DD), inclusivas.
 */
export const couponSchema = z
  .object({
    code: z.string().regex(/^[A-Z0-9-]{3,30}$/),
    type: z.enum(["percent", "fixed"]),
    value: z.number().int().positive(),
    /** Subtotal mínimo em centavos para o cupom valer. */
    minSubtotalCents: z.number().int().nonnegative().optional(),
    startsAt: z.string().date().optional(),
    endsAt: z.string().date().optional(),
    active: z.boolean(),
    /** Texto curto mostrado na sacola, ex.: "10% de desconto". */
    description: z.string().optional(),
  })
  .refine((c) => c.type !== "percent" || c.value <= 100, {
    message: "Desconto percentual vai de 1 a 100.",
    path: ["value"],
  });
export type Coupon = z.infer<typeof couponSchema>;

/** O que o navegador recebe ao aplicar um cupom (sem dados internos). */
export type AppliedCoupon = Pick<
  Coupon,
  "code" | "type" | "value" | "minSubtotalCents" | "description"
>;
