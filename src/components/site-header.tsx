import Link from "next/link";

import { siteConfig } from "@/config/site";
import { categories } from "@/features/catalog/categories";

import { CartButton } from "./cart/cart-button";
import { Container } from "./container";
import { HeaderShell } from "./header-shell";
import { Wordmark } from "./wordmark";

export function SiteHeader() {
  return (
    <HeaderShell>
      <Container className="flex h-16 items-center justify-between gap-6 transition-[height] duration-300 lg:h-20 lg:group-data-[scrolled]/header:h-16">
        <Link href="/" aria-label={`${siteConfig.name}, início`}>
          <Wordmark />
        </Link>

        <nav aria-label="Categorias" className="hidden md:block">
          <ul className="flex gap-6 lg:gap-8">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/?categoria=${c.slug}#produtos`}
                  className="after:bg-ink relative py-1 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100"
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
    </HeaderShell>
  );
}
