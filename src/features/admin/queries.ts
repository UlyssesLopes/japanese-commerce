import "server-only";

import { notFound } from "next/navigation";

import { AdminApiError, adminFetch } from "./api";
import type { AdminCoupon, AdminKit, AdminProduct } from "./types";

/** A API omite campos nulos; o tipo do site espera `priceCents: null`. */
function normalizeProduct(p: AdminProduct): AdminProduct {
  return { ...p, priceCents: p.priceCents ?? null, images: p.images ?? [] };
}

async function orNotFound<T>(promise: Promise<T>): Promise<T> {
  try {
    return await promise;
  } catch (e) {
    if (e instanceof AdminApiError && e.status === 404) notFound();
    throw e;
  }
}

export async function getProducts(): Promise<AdminProduct[]> {
  const products = await adminFetch<AdminProduct[]>("/api/admin/products");
  return products.map(normalizeProduct);
}

export async function getProduct(id: string): Promise<AdminProduct> {
  return normalizeProduct(
    await orNotFound(
      adminFetch<AdminProduct>(`/api/admin/products/${encodeURIComponent(id)}`),
    ),
  );
}

export async function getKits(): Promise<AdminKit[]> {
  return adminFetch<AdminKit[]>("/api/admin/kits");
}

export async function getKit(id: string): Promise<AdminKit> {
  return orNotFound(
    adminFetch<AdminKit>(`/api/admin/kits/${encodeURIComponent(id)}`),
  );
}

export async function getCoupons(): Promise<AdminCoupon[]> {
  return adminFetch<AdminCoupon[]>("/api/admin/coupons");
}

export async function getCoupon(code: string): Promise<AdminCoupon> {
  const coupon = (await getCoupons()).find((c) => c.code === code);
  if (!coupon) notFound();
  return coupon;
}
