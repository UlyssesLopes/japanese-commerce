/**
 * Configuração central da marca. Nome, descrição e contato são PROVISÓRIOS:
 * trocar aqui deve bastar para renomear o site inteiro.
 */
export const siteConfig = {
  name: "Japanese Beauty Studio",
  shortName: "JBS",
  description:
    "Uma curadoria de cuidados para pele e cabelos, trazida do Japão.",
  locale: "pt-BR",
  currency: "BRL",
  timeZone: "America/Sao_Paulo",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Número no formato internacional, só dígitos (ex.: 5511999999999). */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
} as const;
