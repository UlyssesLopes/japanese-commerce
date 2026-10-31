import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { KitForm } from "@/components/admin/kit-form";
import { PageHeader } from "@/components/admin/ui";
import { getProducts } from "@/features/admin/queries";

export const metadata: Metadata = { title: "Montar kit" };

export default function NewKitPage() {
  return (
    <>
      <Link href="/admin/kits" className="text-ink-muted text-sm">
        ← Kits
      </Link>
      <div className="mt-3">
        <PageHeader
          title="Montar kit"
          subtitle="Começa como rascunho: só aparece no site quando você publicar."
        />
      </div>
      <Suspense
        fallback={<div aria-busy className="bg-rule h-96 rounded-lg" />}
      >
        <NewKit />
      </Suspense>
    </>
  );
}

async function NewKit() {
  return <KitForm products={await getProducts()} />;
}
