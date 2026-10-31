import Link from "next/link";
import { Suspense } from "react";

import { ActiveNavList, NavList } from "@/components/admin/admin-nav";
import { Wordmark } from "@/components/wordmark";

import { logoutAction } from "../actions";

function Brand() {
  return (
    <Link href="/admin" className="block" aria-label="Backoffice ZIVORA">
      <Wordmark />
      <span className="text-ink-muted mt-2 block text-[0.8125rem]">
        Backoffice
      </span>
    </Link>
  );
}

function Navigation() {
  return (
    <Suspense fallback={<NavList pathname={null} />}>
      <ActiveNavList />
    </Suspense>
  );
}

function Footer() {
  return (
    <div className="grid gap-0.5">
      <a
        href="/"
        target="_blank"
        rel="noreferrer"
        className="text-ink-muted hover:text-ink flex h-9 items-center rounded-md px-3"
      >
        Ver a loja ↗
      </a>
      <form action={logoutAction}>
        <button
          type="submit"
          className="text-ink-muted hover:text-ink flex h-9 w-full items-center rounded-md px-3 text-left"
        >
          Sair
        </button>
      </form>
    </div>
  );
}

/** Moldura do backoffice: menu no creme da marca, conteúdo numa folha branca. */
export default function PanelLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[14.5rem_minmax(0,1fr)]">
      {/* Celular e tablet: barra no topo com menu em folha. */}
      <details className="group border-line bg-surface sticky top-0 z-20 border-b lg:hidden">
        <summary className="flex h-14 cursor-pointer list-none items-center justify-between px-4 [&::-webkit-details-marker]:hidden">
          <span className="font-display text-[1.375rem] font-medium tracking-[0.14em]">
            ZIVORA
          </span>
          <span className="text-sm font-medium">
            <span className="group-open:hidden">Menu</span>
            <span className="hidden group-open:inline">Fechar</span>
          </span>
        </summary>
        <nav aria-label="Backoffice" className="grid gap-4 px-2 pb-4">
          <Navigation />
          <Footer />
        </nav>
      </details>

      <aside className="sticky top-0 hidden h-dvh flex-col justify-between px-4 py-6 lg:flex">
        <div className="grid gap-8">
          <div className="px-3">
            <Brand />
          </div>
          <nav aria-label="Backoffice">
            <Navigation />
          </nav>
        </div>
        <Footer />
      </aside>

      <div className="lg:py-2 lg:pr-2">
        <main className="bg-sheet border-line min-h-[calc(100dvh-3.5rem)] px-4 py-6 sm:px-6 lg:min-h-full lg:rounded-xl lg:border lg:px-10 lg:py-9">
          {children}
        </main>
      </div>
    </div>
  );
}
