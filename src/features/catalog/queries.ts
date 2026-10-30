import "server-only";

import { cacheLife } from "next/cache";

import { products } from "@/data/products";
import { productSchema, type Product } from "@/types/product";

import { isVisible } from "./eligibility";
import { fixtureStates } from "./fixtures";

/**
 * Única porta de entrada para dados de catálogo. Hoje lê o seed local;
 * no futuro, troca-se o corpo destas funções por uma API sem mexer na UI.
 */

const validated: Product[] = products.map((p) => productSchema.parse(p));

/** Ver `VisibilityOptions`: nunca definir esta variável na Vercel. */
const visibility = {
  includeDrafts: process.env.CATALOG_SHOW_DRAFTS === "true",
};

export async function getVisibleProducts(): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  return validated.filter((p) => isVisible(p, visibility));
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  "use cache";
  cacheLife("hours");
  return validated.find((p) => p.slug === slug && isVisible(p, visibility));
}

/**
 * Catálogo que a sacola usa no navegador. Com `CATALOG_SHOW_DRAFTS`, inclui
 * os produtos de exemplo de `/dev/estados` para testar a sacola localmente.
 */
export async function getCartCatalog(): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  const visible = validated.filter((p) => isVisible(p, visibility));
  return visibility.includeDrafts
    ? [...visible, ...fixtureStates.map((s) => s.product)]
    : visible;
}
