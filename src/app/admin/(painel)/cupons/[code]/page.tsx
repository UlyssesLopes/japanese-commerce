import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { CouponForm } from "@/components/admin/coupon-form";
import { PageHeader } from "@/components/admin/ui";
import { getCoupon } from "@/features/admin/queries";

export const metadata: Metadata = { title: "Cupom" };

export default function EditCouponPage({
  params,
}: PageProps<"/admin/cupons/[code]">) {
  return (
    <>
      <Link href="/admin/cupons" className="text-ink-muted text-sm">
        ← Cupons
      </Link>
      <Suspense
        fallback={<div aria-busy className="bg-rule mt-3 h-96 rounded-lg" />}
      >
        <Editor params={params} />
      </Suspense>
    </>
  );
}

async function Editor({
  params,
}: Pick<PageProps<"/admin/cupons/[code]">, "params">) {
  const coupon = await getCoupon(decodeURIComponent((await params).code));
  return (
    <>
      <div className="mt-3">
        <PageHeader title={coupon.code} />
      </div>
      <CouponForm key={coupon.code} coupon={coupon} />
    </>
  );
}
