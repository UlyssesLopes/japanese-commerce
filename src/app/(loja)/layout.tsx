import { CartProvider } from "@/components/cart/cart-provider";
import { RevealObserver } from "@/components/reveal-observer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  getCartCatalog,
  getStoreSettings,
  getVisibleProducts,
} from "@/features/catalog/queries";

/** Moldura da loja: cabeçalho, sacola e rodapé. O backoffice tem a sua. */
export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [catalog, searchCatalog, settings] = await Promise.all([
    getCartCatalog(),
    getVisibleProducts(),
    getStoreSettings(),
  ]);

  return (
    <CartProvider
      catalog={catalog}
      searchCatalog={searchCatalog}
      settings={settings}
    >
      <a
        href="#conteudo"
        className="focus:bg-brand focus:text-brand-ink sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-10 focus:px-4 focus:py-3"
      >
        Pular para o conteúdo
      </a>
      <SiteHeader />
      <main id="conteudo" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <RevealObserver />
    </CartProvider>
  );
}
