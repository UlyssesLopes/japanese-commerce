import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import {
  buttonClass,
  ListSkeleton,
  PageHeader,
  Pill,
} from "@/components/admin/ui";
import {
  couponStatus,
  couponStatusLabel,
  type CouponStatus,
} from "@/features/admin/coupon-status";
import { getCoupons } from "@/features/admin/queries";
import { todayInStore } from "@/features/coupons/queries";
import { formatPrice } from "@/lib/currency";

export const metadata: Metadata = { title: "Cupons" };

const tone: Record<CouponStatus, "positive" | "warning" | "neutral"> = {
  active: "positive",
  scheduled: "warning",
  expired: "neutral",
  off: "neutral",
};

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export default function CouponsPage() {
  return (
    <>
      <PageHeader
        title="Cupons"
        subtitle="Códigos de desconto que o cliente digita na sacola."
        actions={
          <Link href="/admin/cupons/novo" className={buttonClass.primary}>
            Criar cupom
          </Link>
        }
      />
      <Suspense fallback={<ListSkeleton rows={4} />}>
        <Coupons />
      </Suspense>
    </>
  );
}

async function Coupons() {
  const coupons = await getCoupons();
  const today = todayInStore();

  if (coupons.length === 0)
    return (
      <div className="border-line rounded-lg border border-dashed px-6 py-10 text-center">
        <p className="font-medium">Nenhum cupom criado.</p>
        <p className="text-ink-muted mt-1 text-sm">
          Percentual ou valor fixo, com compra mínima e validade opcionais.
        </p>
        <Link
          href="/admin/cupons/novo"
          className={`${buttonClass.secondary} mt-4`}
        >
          Criar o primeiro cupom
        </Link>
      </div>
    );

  return (
    <table className="w-full max-w-4xl text-left">
      <thead>
        <tr className="text-ink-muted border-line border-b text-[0.8125rem]">
          <th className="py-2 pr-4 font-normal">Código</th>
          <th className="py-2 pr-4 text-right font-normal">Desconto</th>
          <th className="hidden py-2 pr-4 text-right font-normal sm:table-cell">
            Compra mínima
          </th>
          <th className="hidden py-2 pr-4 font-normal md:table-cell">
            Validade
          </th>
          <th className="py-2 font-normal">Situação</th>
        </tr>
      </thead>
      <tbody className="divide-rule divide-y">
        {coupons.map((c) => {
          const status = couponStatus(c, today);
          return (
            <tr key={c.code}>
              <td className="py-3 pr-4">
                <Link
                  href={`/admin/cupons/${c.code}`}
                  className="font-mono text-sm font-medium hover:underline"
                >
                  {c.code}
                </Link>
                {c.description && (
                  <span className="text-ink-muted block text-[0.8125rem]">
                    {c.description}
                  </span>
                )}
              </td>
              <td className="py-3 pr-4 text-right tabular-nums">
                {c.type === "percent" ? `${c.value}%` : formatPrice(c.value)}
              </td>
              <td className="text-ink-muted hidden py-3 pr-4 text-right tabular-nums sm:table-cell">
                {c.minSubtotalCents ? formatPrice(c.minSubtotalCents) : "—"}
              </td>
              <td className="text-ink-muted hidden py-3 pr-4 text-sm tabular-nums md:table-cell">
                {c.startsAt || c.endsAt
                  ? `${c.startsAt ? formatDate(c.startsAt) : "…"} a ${
                      c.endsAt ? formatDate(c.endsAt) : "…"
                    }`
                  : "Sem limite"}
              </td>
              <td className="py-3">
                <Pill tone={tone[status]}>{couponStatusLabel[status]}</Pill>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
