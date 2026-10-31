import type { Coupon } from "@/types/coupon";

/**
 * Cupons de verdade, definidos pelo dono. Vazio até a Carol criar os
 * primeiros (no futuro, pelo backoffice). Não inventar cupons aqui.
 */
export const coupons: Coupon[] = [];

/**
 * Cupons só para testar localmente (`COUPONS_DEMO=true` no .env.local).
 * Nunca definir essa variável na Vercel.
 */
export const demoCoupons: Coupon[] = [
  {
    code: "TESTE10",
    type: "percent",
    value: 10,
    active: true,
    description: "Teste: 10% de desconto",
  },
  {
    code: "TESTE20",
    type: "fixed",
    value: 2000,
    minSubtotalCents: 10000,
    active: true,
    description: "Teste: R$ 20 de desconto acima de R$ 100",
  },
];
