import type { Metadata } from "next";
import Link from "next/link";

import { ProductForm } from "@/components/admin/product-form";
import { PageHeader } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Novo produto" };

export default function NewProductPage() {
  return (
    <>
      <Link href="/admin/produtos" className="text-ink-muted text-sm">
        ← Produtos
      </Link>
      <div className="mt-3">
        <PageHeader
          title="Novo produto"
          subtitle="Começa como rascunho: só aparece no site quando você publicar."
        />
      </div>
      <ProductForm />
    </>
  );
}
