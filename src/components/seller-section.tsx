import Image from "next/image";

import { siteConfig } from "@/config/site";
import type { StoreSettings } from "@/features/checkout/delivery";

import { Container } from "./container";

/**
 * Quem vende: foto, nome e texto vindos do backoffice. Sem foto ou sem nome,
 * a seção não aparece (nada de espaço vazio nem texto inventado). Faixa na cor
 * da marca para se separar do "Como comprar" e do rodapé.
 */
export function SellerSection({ settings }: { settings: StoreSettings }) {
  const { sellerName, sellerBio, sellerPhoto } = settings;
  if (!sellerName || !sellerPhoto) return null;

  const whatsapp = siteConfig.whatsappNumber.replace(/\D/g, "");
  return (
    <section
      aria-labelledby="quem-vende"
      className="bg-brand text-brand-ink py-14 lg:py-20"
    >
      <Container className="flex flex-col items-center gap-8 text-center md:flex-row md:items-center md:gap-14 md:text-left">
        {/* Retrato redondo: corta o centro da foto, vertical ou não. */}
        <Image
          src={sellerPhoto.src}
          alt={sellerPhoto.alt}
          width={sellerPhoto.width}
          height={sellerPhoto.height}
          sizes="(min-width: 1024px) 18rem, 14rem"
          className="reveal bg-placeholder ring-brand-ink/25 ring-offset-brand aspect-square w-56 shrink-0 rounded-full object-cover ring-1 ring-offset-8 lg:w-64"
        />
        <div className="reveal max-w-[60ch]">
          <h2 id="quem-vende" className="font-display text-head">
            Quem vende
          </h2>
          <p className="text-lead mt-4 font-medium">{sellerName}</p>
          {sellerBio?.split(/\n\s*\n/).map((paragraph) => (
            <p key={paragraph} className="text-brand-ink/80 mt-4 max-w-[60ch]">
              {paragraph}
            </p>
          ))}
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border-brand-ink hover:bg-brand-ink hover:text-brand mt-8 inline-flex h-11 items-center border px-6 font-medium"
            >
              Falar pelo WhatsApp
            </a>
          )}
        </div>
      </Container>
    </section>
  );
}
