import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ProductForm } from "@/components/admin/product-form";
import { PageHeader, StatusPill } from "@/components/admin/ui";
import { getProduct } from "@/features/admin/queries";

export const metadata: Metadata = { title: "Produto" };

export default function EditProductPage({
  params,
}: PageProps<"/admin/produtos/[id]">) {
  return (
    <>
      <Link href="/admin/produtos" className="text-ink-muted text-sm">
        ← Produtos
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
}: Pick<PageProps<"/admin/produtos/[id]">, "params">) {
  const product = await getProduct((await params).id);
  return (
    <>
      <div className="mt-3">
        <PageHeader
          title={product.name}
          subtitle={
            <span className="flex flex-wrap items-center gap-2">
              {product.brand}
              {product.subtitle ? ` · ${product.subtitle}` : ""}
              <StatusPill status={product.publicationStatus} />
            </span>
          }
          actions={
            product.publicationStatus !== "draft" && (
              <a
                href={`/produtos/${product.slug}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium"
              >
                Ver no site ↗
              </a>
            )
          }
        />
      </div>
      <ProductForm key={product.id} product={product} />
    </>
  );
}
