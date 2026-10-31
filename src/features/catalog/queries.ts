import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import type { StoreSettings } from "@/features/checkout/delivery";
import { productSchema, type Product } from "@/types/product";

import { isVisible } from "./eligibility";
import { fixtureStates } from "./fixtures";
import { kitToProduct, mergeCatalog, type ApiKit } from "./kits";

/**
 * Única porta de entrada para dados de catálogo: lê produtos e kits da API
 * (japanese-commerce-backend). O backoffice avisa o site a cada mudança
 * (`/api/revalidar`). O cache de horas é só uma rede de segurança: um build
 * pode reaproveitar dados antigos do cache, e assim eles se corrigem sozinhos.
 */

export const CATALOG_TAG = "catalog";

/** Ver `VisibilityOptions`: prévia com rascunhos só com a chave da API. */
const visibility = {
  includeDrafts: process.env.CATALOG_SHOW_DRAFTS === "true",
};

async function fetchApi<T>(path: string): Promise<T> {
  const base = (process.env.BACKEND_URL ?? "http://localhost:8080").replace(
    /\/$/,
    "",
  );
  const headers: Record<string, string> = {};
  const previewKey = process.env.STOREFRONT_PREVIEW_KEY;
  if (visibility.includeDrafts && previewKey)
    headers["X-Preview-Key"] = previewKey;

  const res = await fetch(`${base}${path}`, { headers });
  if (!res.ok)
    throw new Error(`Catálogo indisponível: ${path} respondeu ${res.status}`);
  return (await res.json()) as T;
}

/** A API omite campos nulos; o schema do site espera `priceCents: null`. */
function toProduct(raw: Record<string, unknown>): Product {
  return productSchema.parse({ priceCents: null, images: [], ...raw });
}

async function loadCatalog(): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CATALOG_TAG);
  const [products, kits] = await Promise.all([
    fetchApi<Record<string, unknown>[]>("/api/products"),
    fetchApi<ApiKit[]>("/api/kits"),
  ]);
  return mergeCatalog(
    products.map(toProduct),
    kits.map((k) => productSchema.parse(kitToProduct(k))),
  ).filter((p) => isVisible(p, visibility));
}

export async function getVisibleProducts(): Promise<Product[]> {
  return loadCatalog();
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  return (await loadCatalog()).find((p) => p.slug === slug);
}

/**
 * Catálogo que a sacola usa no navegador. Com `CATALOG_SHOW_DRAFTS`, inclui
 * os produtos de exemplo de `/dev/estados` para testar a sacola localmente.
 */
export async function getCartCatalog(): Promise<Product[]> {
  const visible = await loadCatalog();
  return visibility.includeDrafts
    ? [...visible, ...fixtureStates.map((s) => s.product)]
    : visible;
}

/** Entrega, retirada, taxa e "Quem vende", editados no backoffice. */
export async function getStoreSettings(): Promise<StoreSettings> {
  "use cache";
  cacheLife("hours");
  cacheTag(CATALOG_TAG);
  return fetchApi<StoreSettings>("/api/settings");
}
