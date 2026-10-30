import Link from "next/link";

import { siteConfig } from "@/config/site";
import { categories } from "@/features/catalog/categories";

import { CartButton } from "./cart/cart-button";
import { Container } from "./container";

export function SiteHeader() {
  return (
    <header className="bg-surface">
      <p className="bg-surface-raised text-small text-ink-muted px-4 py-2 text-center">
        Pedidos pelo WhatsApp: pagamento e entrega combinados na conversa
      </p>
      <Container className="flex h-16 items-center justify-between gap-6 lg:h-20">
        <Link
          href="/"
          className="font-display text-ink text-[1.625rem] leading-none tracking-[-0.01em] lg:text-[1.875rem]"
        >
          {siteConfig.name}
        </Link>

        <nav aria-label="Categorias" className="hidden md:block">
          <ul className="flex gap-8">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/?categoria=${c.slug}#produtos`}
                  className="underline-offset-[0.3em] hover:underline"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <CartButton />
      </Container>

      <nav aria-label="Categorias" className="md:hidden">
        <ul className="flex gap-6 overflow-x-auto px-4 pb-3 sm:px-8">
          {categories.map((c) => (
            <li key={c.slug} className="shrink-0">
              <Link
                href={`/?categoria=${c.slug}#produtos`}
                className="inline-block py-1"
              >
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
