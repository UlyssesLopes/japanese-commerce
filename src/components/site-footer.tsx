import { siteConfig } from "@/config/site";

import { Container } from "./container";

export function SiteFooter() {
  return (
    <footer className="bg-surface-raised mt-24 lg:mt-40">
      <Container className="grid gap-6 py-12 md:grid-cols-12 lg:py-16">
        <p className="font-display text-head text-brand leading-none md:col-span-7">
          {siteConfig.name}
        </p>
        <div className="text-small text-ink-muted space-y-3 md:col-span-5">
          <p>
            Pagamento e entrega são combinados pelo WhatsApp, depois que você
            monta a sacola.
          </p>
          <p>
            Imagem da abertura: Hashiguchi Goyō,{" "}
            <cite>Mulher se maquiando</cite>, 1918. The Metropolitan Museum of
            Art, domínio público (CC0).
          </p>
        </div>
      </Container>
    </footer>
  );
}
