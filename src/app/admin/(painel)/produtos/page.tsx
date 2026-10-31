import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ProductTable } from "@/components/admin/product-table";
import { buttonClass, ListSkeleton, PageHeader } from "@/components/admin/ui";
import { getProducts } from "@/features/admin/queries";

export const metadata: Metadata = { title: "Produtos" };

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        title="Produtos"
        subtitle="Preço, estoque, fotos e textos de cada produto da loja."
        actions={
          <Link href="/admin/produtos/novo" className={buttonClass.primary}>
            Novo produto
          </Link>
        }
      />
      <Suspense fallback={<ListSkeleton />}>
        <Products />
      </Suspense>
    </>
  );
}

async function Products() {
  return <ProductTable products={await getProducts()} />;
}
