import Link from "next/link";

import { siteConfig } from "@/config/site";
import { categories } from "@/features/catalog/categories";

import { CartButton } from "./cart/cart-button";
import { Container } from "./container";
import { Wordmark } from "./wordmark";

export function SiteHeader() {
  return (
    <header className="bg-surface">
      <Container className="flex h-16 items-center justify-between gap-6 lg:h-20">
        <Link href="/" aria-label={`${siteConfig.name}, início`}>
          <Wordmark />
        </Link>

        <nav aria-label="Categorias" className="hidden md:block">
          <ul className="flex gap-6 lg:gap-8">
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
