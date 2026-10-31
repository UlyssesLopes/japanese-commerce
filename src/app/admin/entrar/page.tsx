import type { Metadata } from "next";

import { LoginForm } from "@/components/admin/login-form";
import { Wordmark } from "@/components/wordmark";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Wordmark size="lg" />
        </div>
        <div className="bg-sheet border-line rounded-xl border p-6 sm:p-8">
          <h1 className="text-[1.25rem] font-semibold">Backoffice</h1>
          <p className="text-ink-muted mt-1 mb-6 text-sm">
            Produtos, kits, preços e cupons da loja.
          </p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
