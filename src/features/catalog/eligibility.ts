import type { Product } from "@/types/product";

export type VisibilityOptions = {
  /**
   * Mostra também rascunhos. Só para revisar o layout com o catálogo real
   * em ambiente local (`CATALOG_SHOW_DRAFTS=true`); nunca em produção.
   */
  includeDrafts?: boolean;
};

/** Produto pode ser visto no site (lista, página, sitemap). */
export function isVisible(
  product: Product,
  { includeDrafts = false }: VisibilityOptions = {},
): boolean {
  return includeDrafts || product.publicationStatus !== "draft";
}

/**
 * Produto pode entrar na sacola. Todas as condições são obrigatórias:
 * ter estoque físico não basta.
 */
export function isPurchasable(product: Product): boolean {
  return (
    product.publicationStatus === "published" &&
    product.purchaseEnabled &&
    product.priceCents !== null &&
    product.availableQuantity > 0 &&
    product.availableQuantity <= product.inventoryQuantity
  );
}
