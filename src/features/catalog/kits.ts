import type { Product, ProductImage } from "@/types/product";

/** Kit como a API pública devolve (campos nulos vêm omitidos). */
export type ApiKit = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  images?: ProductImage[];
  priceCents?: number;
  availableQuantity: number;
  publicationStatus: Product["publicationStatus"];
  purchaseEnabled: boolean;
  featured: boolean;
  items: { slug: string; brand: string; name: string; quantity: number }[];
};

/**
 * O kit entra no catálogo como um produto da categoria "kits": a vitrine,
 * a sacola e a mensagem do WhatsApp funcionam sem caso especial. O estoque é
 * o de kits completos que a API calculou; `isPurchasable()` decide a venda.
 */
export function kitToProduct(kit: ApiKit): Product {
  return {
    id: `kit-${kit.id}`,
    slug: kit.slug,
    sku: `KIT-${kit.id.slice(0, 8).toUpperCase()}`,
    brand: "Kit",
    name: kit.name,
    description: kit.description,
    category: "kits",
    images: kit.images ?? [],
    priceCents: kit.priceCents ?? null,
    inventoryQuantity: kit.availableQuantity,
    availableQuantity: kit.availableQuantity,
    // O conteúdo do kit são os próprios produtos, já conferidos.
    contentVerified: true,
    publicationStatus: kit.publicationStatus,
    purchaseEnabled: kit.purchaseEnabled,
    featured: kit.featured,
    kitItems: kit.items.map(({ slug, brand, name, quantity }) => ({
      slug,
      brand,
      name,
      quantity,
    })),
  };
}

/**
 * Junta produtos e kits. Um kit com o mesmo endereço de um produto fica de
 * fora (o produto vence), para nenhuma página sumir.
 */
export function mergeCatalog(products: Product[], kits: Product[]): Product[] {
  const slugs = new Set(products.map((p) => p.slug));
  return [...products, ...kits.filter((k) => !slugs.has(k.slug))];
}
