import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { getVisibleProducts } from "@/features/catalog/queries";

const pages = [
  "",
  "/entregas-e-pagamento",
  "/trocas-e-devolucoes",
  "/privacidade",
];

/** Páginas que o Google deve conhecer: a loja, as políticas e cada produto publicado. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getVisibleProducts();
  return [
    ...pages.map((path) => ({ url: `${siteConfig.url}${path}` })),
    ...products.map((p) => ({ url: `${siteConfig.url}/produtos/${p.slug}` })),
  ];
}
