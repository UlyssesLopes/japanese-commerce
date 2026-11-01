import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Backoffice, rotas internas e a sacola (pessoal de cada visitante) ficam fora das buscas.
      disallow: ["/admin", "/api/", "/dev/", "/sacola"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
