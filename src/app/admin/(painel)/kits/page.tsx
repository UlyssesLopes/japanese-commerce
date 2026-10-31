import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import {
  buttonClass,
  ListSkeleton,
  PageHeader,
  StatusPill,
  Thumb,
} from "@/components/admin/ui";
import { getKits } from "@/features/admin/queries";
import { formatPrice } from "@/lib/currency";

export const metadata: Metadata = { title: "Kits" };

export default function KitsPage() {
  return (
    <>
      <PageHeader
        title="Kits"
        subtitle="Combinações de produtos da loja com preço próprio."
        actions={
          <Link href="/admin/kits/novo" className={buttonClass.primary}>
            Montar kit
          </Link>
        }
      />
      <Suspense fallback={<ListSkeleton rows={4} />}>
        <Kits />
      </Suspense>
    </>
  );
}

async function Kits() {
  const kits = await getKits();
  if (kits.length === 0)
    return (
      <div className="border-line rounded-lg border border-dashed px-6 py-10 text-center">
        <p className="font-medium">Nenhum kit montado ainda.</p>
        <p className="text-ink-muted mt-1 text-sm">
          Escolha produtos da loja, a quantidade de cada um e o preço do kit.
        </p>
        <Link
          href="/admin/kits/novo"
          className={`${buttonClass.secondary} mt-4`}
        >
          Montar o primeiro kit
        </Link>
      </div>
    );

  return (
    <ul className="border-line divide-rule divide-y rounded-lg border">
      {kits.map((kit) => (
        <li key={kit.id}>
          <Link
            href={`/admin/kits/${kit.id}`}
            className="hover:bg-surface/60 grid items-center gap-x-6 gap-y-2 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_8rem_8rem_7rem_6rem]"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="flex flex-none -space-x-3">
                {kit.items.slice(0, 3).map((item) => (
                  <span
                    key={item.productId}
                    className="ring-sheet rounded-md ring-2"
                  >
                    <Thumb src={item.image?.src} />
                  </span>
                ))}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-medium">{kit.name}</span>
                <span className="text-ink-muted block truncate text-[0.8125rem]">
                  {kit.items.map((i) => `${i.quantity}× ${i.name}`).join(" · ")}
                </span>
              </span>
            </span>
            <span className="text-sm tabular-nums sm:text-right">
              <span className="text-ink-muted text-[0.8125rem] sm:block">
                Preço do kit{" "}
              </span>
              {kit.priceCents === undefined ? "—" : formatPrice(kit.priceCents)}
            </span>
            <span className="text-sm tabular-nums sm:text-right">
              <span className="text-ink-muted text-[0.8125rem] sm:block">
                Soma avulsa{" "}
              </span>
              {kit.itemsTotalCents === undefined
                ? "—"
                : formatPrice(kit.itemsTotalCents)}
            </span>
            <span className="text-sm tabular-nums sm:text-right">
              <span className="text-ink-muted text-[0.8125rem] sm:block">
                Dá para vender{" "}
              </span>
              {kit.availableQuantity}
            </span>
            <span className="sm:text-right">
              <StatusPill status={kit.publicationStatus} />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
