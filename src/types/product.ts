import { z } from "zod";

export const productCategorySchema = z.enum([
  "cabelos",
  "skincare",
  "maquiagem",
  "kits",
]);
export type ProductCategory = z.infer<typeof productCategorySchema>;

export const productImageSchema = z.object({
  src: z.string(),
  alt: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});
export type ProductImage = z.infer<typeof productImageSchema>;

/**
 * Dados públicos de um produto. Tudo aqui pode chegar ao navegador.
 *
 * Campos opcionais ficam ausentes até serem verificados na embalagem.
 * Não preencher volume, ingredientes, modo de uso etc. por suposição.
 */
export const productSchema = z.object({
  id: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  sku: z.string(),

  brand: z.string(),
  name: z.string(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  category: productCategorySchema,

  images: z.array(productImageSchema),

  /** Preço de venda em centavos. null = "Preço em definição". */
  priceCents: z.number().int().nonnegative().nullable(),

  /** Unidades físicas que existem. */
  inventoryQuantity: z.number().int().nonnegative(),
  /** Unidades que podem entrar numa sacola (≤ inventoryQuantity). */
  availableQuantity: z.number().int().nonnegative(),

  volume: z.string().optional(),
  /** Para quem o produto é indicado (tipo de pele, de cabelo...). */
  indication: z.string().optional(),
  ingredients: z.array(z.string()).optional(),
  /** Modo de uso; parágrafos separados por linha em branco. */
  usageInstructions: z.string().optional(),
  benefits: z.array(z.string()).optional(),
  /** Avisos da embalagem (uso externo, teste de alergia...). */
  precautions: z.array(z.string()).optional(),
  /** Diferencial do produto (ex.: como combina com outro da mesma linha). */
  highlight: z.string().optional(),
  /** Observação do vendedor, mostrada junto do preço. */
  note: z.string().optional(),
  countryOfOrigin: z.string().optional(),
  expirationDate: z.string().optional(),

  /** O conteúdo da página foi conferido contra a embalagem real? */
  contentVerified: z.boolean(),

  publicationStatus: z.enum(["draft", "preview", "published"]),
  /** Liberação manual para entrar na sacola do WhatsApp. */
  purchaseEnabled: z.boolean(),

  featured: z.boolean(),
});
export type Product = z.infer<typeof productSchema>;
