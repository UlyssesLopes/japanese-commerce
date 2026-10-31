import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { KitForm } from "@/components/admin/kit-form";
import { PageHeader, StatusPill } from "@/components/admin/ui";
import { getKit, getProducts } from "@/features/admin/queries";

export const metadata: Metadata = { title: "Kit" };

export default function EditKitPage({ params }: PageProps<"/admin/kits/[id]">) {
  return (
    <>
      <Link href="/admin/kits" className="text-ink-muted text-sm">
        ← Kits
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
}: Pick<PageProps<"/admin/kits/[id]">, "params">) {
  const { id } = await params;
  const [kit, products] = await Promise.all([getKit(id), getProducts()]);
  return (
    <>
      <div className="mt-3">
        <PageHeader
          title={kit.name}
          subtitle={
            <span className="flex flex-wrap items-center gap-2">
              {kit.items.length}{" "}
              {kit.items.length === 1 ? "produto" : "produtos"}
              <StatusPill status={kit.publicationStatus} />
            </span>
          }
        />
      </div>
      <KitForm key={kit.id} kit={kit} products={products} />
    </>
  );
}
