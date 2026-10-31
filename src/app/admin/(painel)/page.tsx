import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Pill, Thumb } from "@/components/admin/ui";
import { missingForSale } from "@/features/admin/readiness";
import { getCoupons, getKits, getProducts } from "@/features/admin/queries";
import { couponLabel } from "@/features/coupons/coupons";
import { formatPrice } from "@/lib/currency";

export const metadata: Metadata = { title: "Visão geral" };

export default function OverviewPage() {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-[1.5rem] leading-tight font-semibold">
          Visão geral
        </h1>
        <p className="text-ink-muted mt-1">
          O que já está pronto para vender e o que falta em cada produto.
        </p>
      </header>
      <Suspense fallback={<OverviewSkeleton />}>
        <Overview />
      </Suspense>
    </>
  );
}

const ONLY_RELEASE = "Venda não liberada";

async function Overview() {
  const [products, kits, coupons] = await Promise.all([
    getProducts(),
    getKits(),
    getCoupons(),
  ]);

  const rows = products.map((p) => ({
    product: p,
    missing: missingForSale(p),
  }));
  const onSale = rows.filter((r) => r.missing.length === 0);
  const readyToRelease = rows.filter(
    (r) => r.missing.length === 1 && r.missing[0] === ONLY_RELEASE,
  );
  const needsWork = rows.filter((r) =>
    r.missing.some((m) => m !== ONLY_RELEASE),
  );
  const count = (status: string) =>
    products.filter((p) => p.publicationStatus === status).length;
  const activeCoupons = coupons.filter((c) => c.active);

  const stats = [
    { label: "Produtos", value: products.length },
    { label: "Publicados", value: count("published") },
    { label: "Em prévia", value: count("preview") },
    { label: "Rascunhos", value: count("draft") },
    { label: "À venda agora", value: onSale.length },
  ];

  return (
    <div className="grid gap-10">
      <dl className="border-line grid grid-cols-2 rounded-lg border sm:grid-cols-5">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`border-line px-5 py-4 ${i > 0 ? "sm:border-l" : ""} ${
              i % 2 === 1 ? "border-l" : ""
            } ${i >= 2 ? "border-t sm:border-t-0" : ""} ${
              i === 4 ? "col-span-2 sm:col-span-1" : ""
            }`}
          >
            <dt className="text-ink-muted text-[0.8125rem]">{s.label}</dt>
            <dd className="mt-1 text-[1.5rem] font-semibold tabular-nums">
              {s.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="grid items-start gap-10 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <section>
          <div className="mb-3 flex items-baseline justify-between gap-4">
            <h2 className="text-base font-semibold">O que falta para vender</h2>
            <Link href="/admin/produtos" className="text-sm font-medium">
              Todos os produtos
            </Link>
          </div>
          <p className="text-ink-muted mb-4 text-sm">
            {readyToRelease.length === 0
              ? "Nenhum produto está só esperando a liberação da venda."
              : `${readyToRelease.length} ${
                  readyToRelease.length === 1
                    ? "produto está"
                    : "produtos estão"
                } completo${readyToRelease.length === 1 ? "" : "s"} e só falta liberar a venda.`}
          </p>
          {needsWork.length === 0 ? (
            <p className="border-line text-ink-muted rounded-lg border border-dashed px-4 py-3 text-sm">
              Todos os produtos têm preço, unidade e publicação.
            </p>
          ) : (
            <ul className="border-line divide-rule divide-y rounded-lg border">
              {needsWork.map(({ product, missing }) => (
                <li key={product.id}>
                  <Link
                    href={`/admin/produtos/${product.id}`}
                    className="hover:bg-surface/60 flex items-center gap-3 px-4 py-3"
                  >
                    <Thumb src={product.images[0]?.src} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">
                        {product.name}
                      </span>
                      <span className="text-ink-muted block truncate text-[0.8125rem]">
                        {product.brand}
                      </span>
                    </span>
                    <span className="flex flex-wrap justify-end gap-1.5">
                      {missing
                        .filter((m) => m !== ONLY_RELEASE)
                        .map((m) => (
                          <Pill key={m} tone="warning">
                            {m}
                          </Pill>
                        ))}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="grid gap-10">
          <section>
            <div className="mb-3 flex items-baseline justify-between gap-4">
              <h2 className="text-base font-semibold">Kits</h2>
              <Link href="/admin/kits/novo" className="text-sm font-medium">
                Montar kit
              </Link>
            </div>
            {kits.length === 0 ? (
              <p className="border-line text-ink-muted rounded-lg border border-dashed px-4 py-3 text-sm">
                Nenhum kit montado ainda.
              </p>
            ) : (
              <ul className="border-line divide-rule divide-y rounded-lg border">
                {kits.slice(0, 5).map((kit) => (
                  <li key={kit.id}>
                    <Link
                      href={`/admin/kits/${kit.id}`}
                      className="hover:bg-surface/60 flex items-baseline justify-between gap-3 px-4 py-3"
                    >
                      <span className="min-w-0 truncate font-medium">
                        {kit.name}
                      </span>
                      <span className="text-ink-muted flex-none text-sm tabular-nums">
                        {kit.availableQuantity === 1
                          ? "1 para vender"
                          : `${kit.availableQuantity} para vender`}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <div className="mb-3 flex items-baseline justify-between gap-4">
              <h2 className="text-base font-semibold">Cupons ativos</h2>
              <Link href="/admin/cupons/novo" className="text-sm font-medium">
                Criar cupom
              </Link>
            </div>
            {activeCoupons.length === 0 ? (
              <p className="border-line text-ink-muted rounded-lg border border-dashed px-4 py-3 text-sm">
                Nenhum cupom ativo.
              </p>
            ) : (
              <ul className="border-line divide-rule divide-y rounded-lg border">
                {activeCoupons.slice(0, 5).map((c) => (
                  <li key={c.code}>
                    <Link
                      href={`/admin/cupons/${c.code}`}
                      className="hover:bg-surface/60 flex items-baseline justify-between gap-3 px-4 py-3"
                    >
                      <span className="font-mono text-sm">{c.code}</span>
                      <span className="text-ink-muted truncate text-sm">
                        {couponLabel(c)}
                        {c.minSubtotalCents
                          ? ` · a partir de ${formatPrice(c.minSubtotalCents)}`
                          : ""}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div aria-busy className="grid gap-10">
      <div className="bg-rule h-[5.25rem] rounded-lg" />
      <div className="grid gap-2">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="bg-rule h-16 rounded-md" />
        ))}
      </div>
    </div>
  );
}
