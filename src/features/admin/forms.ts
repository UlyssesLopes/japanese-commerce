import { normalizeCode } from "@/features/coupons/coupons";
import type { ProductImage } from "@/types/product";

import { parseMoney } from "./money";

/**
 * Formulários do backoffice → corpo JSON da API. Campos vazios viram
 * `null`/ausentes (nunca texto inventado); a API valida as regras.
 */

type Parsed<T> = { ok: true; value: T } | { ok: false; error: string };

const text = (form: FormData, name: string) =>
  String(form.get(name) ?? "").trim();
const optional = (form: FormData, name: string) => text(form, name) || null;
const checked = (form: FormData, name: string) => form.get(name) === "on";

/** Uma linha por item; linhas vazias são ignoradas. */
export function lines(value: string): string[] | null {
  const items = value
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  return items.length ? items : null;
}

function integer(form: FormData, name: string): number | null {
  const value = text(form, name);
  return /^\d+$/.test(value) ? Number(value) : null;
}

function images(form: FormData): ProductImage[] {
  const raw = text(form, "images");
  return raw ? (JSON.parse(raw) as ProductImage[]) : [];
}

function money(form: FormData, name: string, label: string) {
  const parsed = parseMoney(text(form, name));
  return parsed.ok
    ? ({ ok: true, cents: parsed.cents } as const)
    : ({ ok: false, error: `${label}: use o formato 249,90.` } as const);
}

export function productInput(form: FormData): Parsed<Record<string, unknown>> {
  const price = money(form, "price", "Preço");
  if (!price.ok) return price;
  const inventoryQuantity = integer(form, "inventoryQuantity");
  const availableQuantity = integer(form, "availableQuantity");
  if (inventoryQuantity === null || availableQuantity === null)
    return { ok: false, error: "Estoque e disponível: use números inteiros." };

  return {
    ok: true,
    value: {
      slug: text(form, "slug"),
      sku: text(form, "sku"),
      brand: text(form, "brand"),
      name: text(form, "name"),
      subtitle: optional(form, "subtitle"),
      description: optional(form, "description"),
      category: text(form, "category"),
      extraCategories: form.getAll("extraCategories").map(String),
      priceCents: price.cents,
      inventoryQuantity,
      availableQuantity,
      volume: optional(form, "volume"),
      indication: optional(form, "indication"),
      ingredients: lines(text(form, "ingredients")),
      usageInstructions: optional(form, "usageInstructions"),
      benefits: lines(text(form, "benefits")),
      precautions: lines(text(form, "precautions")),
      highlight: optional(form, "highlight"),
      note: optional(form, "note"),
      countryOfOrigin: optional(form, "countryOfOrigin"),
      expirationDate: optional(form, "expirationDate"),
      contentVerified: checked(form, "contentVerified"),
      publicationStatus: text(form, "publicationStatus"),
      purchaseEnabled: checked(form, "purchaseEnabled"),
      featured: checked(form, "featured"),
      lowStockBadge: checked(form, "lowStockBadge"),
      images: images(form),
    },
  };
}

export function kitInput(form: FormData): Parsed<Record<string, unknown>> {
  const price = money(form, "price", "Preço do kit");
  if (!price.ok) return price;
  const raw = text(form, "items");
  const items = raw
    ? (JSON.parse(raw) as { productId: string; quantity: number }[])
    : [];
  if (items.length === 0)
    return { ok: false, error: "Adicione pelo menos um produto ao kit." };

  return {
    ok: true,
    value: {
      slug: text(form, "slug"),
      name: text(form, "name"),
      description: optional(form, "description"),
      priceCents: price.cents,
      publicationStatus: text(form, "publicationStatus"),
      purchaseEnabled: checked(form, "purchaseEnabled"),
      featured: checked(form, "featured"),
      images: images(form),
      items,
    },
  };
}

export function couponInput(form: FormData): Parsed<Record<string, unknown>> {
  const type = text(form, "type");
  let value: number | null;
  if (type === "percent") {
    value = integer(form, "value");
    if (value === null || value < 1 || value > 100)
      return { ok: false, error: "Desconto percentual: de 1 a 100." };
  } else {
    const parsed = money(form, "value", "Valor do desconto");
    if (!parsed.ok) return parsed;
    value = parsed.cents;
    if (!value) return { ok: false, error: "Informe o valor do desconto." };
  }
  const min = money(form, "minSubtotal", "Compra mínima");
  if (!min.ok) return min;
  const startsAt = optional(form, "startsAt");
  const endsAt = optional(form, "endsAt");
  if (startsAt && endsAt && startsAt > endsAt)
    return { ok: false, error: "O fim da validade vem antes do início." };

  return {
    ok: true,
    value: {
      code: normalizeCode(text(form, "code")),
      type,
      value,
      minSubtotalCents: min.cents,
      startsAt,
      endsAt,
      active: checked(form, "active"),
      description: optional(form, "description"),
    },
  };
}

export function settingsInput(form: FormData): Parsed<Record<string, unknown>> {
  const percent = integer(form, "deliveryFeePercent");
  if (percent === null || percent > 100)
    return { ok: false, error: "Taxa de entrega: de 0 a 100%." };
  const free = money(form, "freeDeliveryFrom", "Entrega grátis a partir de");
  if (!free.ok) return free;
  const [photo] = images(form);

  return {
    ok: true,
    value: {
      deliveryArea: optional(form, "deliveryArea"),
      pickupLocation: optional(form, "pickupLocation"),
      deliveryLeadTime: optional(form, "deliveryLeadTime"),
      freeDeliveryFromCents: free.cents,
      deliveryFeePercent: percent,
      sellerName: optional(form, "sellerName"),
      sellerBio: optional(form, "sellerBio"),
      sellerPhoto: photo ?? null,
    },
  };
}
