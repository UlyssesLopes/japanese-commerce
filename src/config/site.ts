/**
 * Configuração central da marca (identidade escolhida pela Carol em
 * 30/10/2026, ver product_photos/design/). Trocar aqui renomeia o site inteiro.
 */
export const siteConfig = {
  name: "ZIVORA",
  tagline: "Selected Goods",
  slogan: "Do mundo, para o seu dia a dia",
  shortName: "ZIVORA",
  description: "Skincare, cabelos e maquiagem de marcas japonesas e coreanas.",
  locale: "pt-BR",
  currency: "BRL",
  timeZone: "America/Sao_Paulo",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Número no formato internacional, só dígitos (ex.: 5511999999999). */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
} as const;
