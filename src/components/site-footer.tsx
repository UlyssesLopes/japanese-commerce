import Link from "next/link";

import { siteConfig } from "@/config/site";
import { categories } from "@/features/catalog/categories";

import { Container } from "./container";
import { Wordmark } from "./wordmark";

export function SiteFooter() {
  return (
    <footer className="bg-surface-raised">
      <Container className="grid gap-8 py-12 md:grid-cols-12 lg:py-16">
        <div className="md:col-span-6">
          <Wordmark size="lg" />
          <p className="text-ink-muted mt-3 max-w-[40ch]">
            {siteConfig.slogan}. {siteConfig.description}
          </p>
        </div>
        <nav aria-label="Rodapé" className="md:col-span-3">
          <ul>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/?categoria=${c.slug}#produtos`}
                  className="inline-flex min-h-11 items-center underline-offset-4 hover:underline"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="md:col-span-3">
          <li>
            <Link
              href="/#como-comprar"
              className="inline-flex min-h-11 items-center underline-offset-4 hover:underline"
            >
              Como comprar
            </Link>
          </li>
          <li className="text-ink-muted flex min-h-11 items-center">
            Pedidos pelo WhatsApp
          </li>
        </ul>
      </Container>
    </footer>
  );
}
