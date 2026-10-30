import Link from "next/link";

import { siteConfig } from "@/config/site";
import { categories } from "@/features/catalog/categories";

import { Container } from "./container";

export function SiteFooter() {
  return (
    <footer className="bg-surface-raised">
      <Container className="grid gap-8 py-12 md:grid-cols-12 lg:py-16">
        <div className="md:col-span-6">
          <p className="font-display text-[2rem] leading-none">
            {siteConfig.name}
          </p>
          <p className="text-ink-muted mt-3 max-w-[40ch]">
            {siteConfig.description}
          </p>
        </div>
        <nav aria-label="Rodapé" className="md:col-span-3">
          <ul className="space-y-2">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/?categoria=${c.slug}#produtos`}
                  className="underline-offset-4 hover:underline"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="space-y-2 md:col-span-3">
          <li>
            <a
              href="#como-comprar"
              className="underline-offset-4 hover:underline"
            >
              Como comprar
            </a>
          </li>
          <li className="text-ink-muted">Pedidos pelo WhatsApp</li>
        </ul>
      </Container>
    </footer>
  );
}
