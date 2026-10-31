import type { Metadata } from "next";
import Link from "next/link";

import { CouponForm } from "@/components/admin/coupon-form";
import { PageHeader } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Criar cupom" };

export default function NewCouponPage() {
  return (
    <>
      <Link href="/admin/cupons" className="text-ink-muted text-sm">
        ← Cupons
      </Link>
      <div className="mt-3">
        <PageHeader title="Criar cupom" />
      </div>
      <CouponForm />
    </>
  );
}
