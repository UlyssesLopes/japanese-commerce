import Image from "next/image";

import { siteConfig } from "@/config/site";
import type { StoreSettings } from "@/features/checkout/delivery";

import { Container } from "./container";

/**
 * Quem vende: foto, nome e texto vindos do backoffice. Sem foto ou sem nome,
 * a seção não aparece (nada de espaço vazio nem texto inventado).
 */
export function SellerSection({ settings }: { settings: StoreSettings }) {
  const { sellerName, sellerBio, sellerPhoto } = settings;
  if (!sellerName || !sellerPhoto) return null;

  const whatsapp = siteConfig.whatsappNumber.replace(/\D/g, "");
  return (
    <section aria-labelledby="quem-vende" className="py-12 lg:py-20">
      <Container className="grid items-center gap-8 md:grid-cols-12 lg:gap-14">
        <div className="reveal md:col-span-5 lg:col-span-4">
          <Image
            src={sellerPhoto.src}
            alt={sellerPhoto.alt}
            width={sellerPhoto.width}
            height={sellerPhoto.height}
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 40vw, 100vw"
            className="bg-placeholder aspect-[4/5] w-full object-cover"
          />
        </div>
        <div className="reveal md:col-span-7 lg:col-span-6 lg:col-start-6">
          <h2 id="quem-vende" className="font-display text-head">
            Quem vende
          </h2>
          <p className="text-lead mt-4 font-medium">{sellerName}</p>
          {sellerBio?.split(/\n\s*\n/).map((paragraph) => (
            <p key={paragraph} className="mt-4 max-w-[60ch]">
              {paragraph}
            </p>
          ))}
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border-ink hover:bg-ink hover:text-surface mt-8 inline-flex h-11 items-center border px-6 font-medium"
            >
              Falar pelo WhatsApp
            </a>
          )}
        </div>
      </Container>
    </section>
  );
}
