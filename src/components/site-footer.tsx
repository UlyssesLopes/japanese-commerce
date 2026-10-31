import Link from "next/link";

import { siteConfig } from "@/config/site";
import { categories } from "@/features/catalog/categories";
import { formatPhone } from "@/lib/phone";

import { Container } from "./container";
import { Wordmark } from "./wordmark";

const linkClass =
  "inline-flex min-h-11 items-center underline-offset-4 hover:underline";

const storeLinks = [
  { href: "/#como-comprar", label: "Como comprar" },
  { href: "/entregas-e-pagamento", label: "Entregas e pagamento" },
  { href: "/trocas-e-devolucoes", label: "Trocas e devoluções" },
  { href: "/privacidade", label: "Privacidade" },
];

export function SiteFooter() {
  const phone = siteConfig.whatsappNumber;
  return (
    <footer className="bg-surface-raised">
      <Container className="grid gap-8 py-12 md:grid-cols-12 lg:py-16">
        <div className="md:col-span-6">
          <Wordmark size="lg" />
          <p className="text-ink-muted mt-3 max-w-[40ch]">
            {siteConfig.slogan}. {siteConfig.description}
          </p>
        </div>
        <nav aria-label="Categorias" className="md:col-span-3">
          <ul>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/?categoria=${c.slug}#produtos`}
                  className={linkClass}
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="A loja" className="md:col-span-3">
          <ul>
            {storeLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
      <Container className="border-placeholder text-small text-ink-muted border-t py-5">
        <p>
          Vendido por {siteConfig.name}
          {phone && (
            <>
              {" · "}
              <a
                href={`https://wa.me/${phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:underline"
              >
                WhatsApp {formatPhone(phone)}
              </a>
            </>
          )}
          {" · "}Pedidos, pagamento e entrega combinados pelo WhatsApp.
        </p>
      </Container>
    </footer>
  );
}
