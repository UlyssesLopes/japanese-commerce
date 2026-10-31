"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";

import { AdminApiError, adminFetch, login, logout } from "@/features/admin/api";
import {
  couponInput,
  kitInput,
  productInput,
  settingsInput,
} from "@/features/admin/forms";
import type { ActionState } from "@/features/admin/types";
import type { ProductImage } from "@/types/product";

function failure(e: unknown): ActionState {
  if (e instanceof AdminApiError) return { error: e.message };
  throw e; // redirect() e erros inesperados seguem adiante
}

export async function loginAction(
  _: ActionState,
  form: FormData,
): Promise<ActionState> {
  try {
    await login(String(form.get("password") ?? ""));
  } catch (e) {
    return failure(e);
  }
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await logout();
  redirect("/admin/entrar");
}

// Produtos

export async function saveProduct(
  id: string | null,
  _: ActionState,
  form: FormData,
): Promise<ActionState> {
  const parsed = productInput(form);
  if (!parsed.ok) return { error: parsed.error };
  let savedId: string;
  try {
    const saved = await adminFetch<{ id: string }>(
      id
        ? `/api/admin/products/${encodeURIComponent(id)}`
        : "/api/admin/products",
      { method: id ? "PUT" : "POST", json: parsed.value },
    );
    savedId = saved.id;
  } catch (e) {
    return failure(e);
  }
  if (!id) redirect(`/admin/produtos/${savedId}`);
  refresh();
  return { saved: true };
}

export async function deleteProduct(id: string): Promise<ActionState> {
  try {
    await adminFetch(`/api/admin/products/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  } catch (e) {
    return failure(e);
  }
  redirect("/admin/produtos");
}

/** Foto já reduzida no navegador; a API guarda e devolve a URL. */
export async function uploadImage(
  form: FormData,
): Promise<{ image?: Omit<ProductImage, "alt">; error?: string }> {
  try {
    const image = await adminFetch<Omit<ProductImage, "alt">>(
      "/api/admin/images",
      { method: "POST", body: form },
    );
    return { image };
  } catch (e) {
    return failure(e);
  }
}

// Kits

export async function saveKit(
  id: string | null,
  _: ActionState,
  form: FormData,
): Promise<ActionState> {
  const parsed = kitInput(form);
  if (!parsed.ok) return { error: parsed.error };
  let savedId: string;
  try {
    const saved = await adminFetch<{ id: string }>(
      id ? `/api/admin/kits/${encodeURIComponent(id)}` : "/api/admin/kits",
      { method: id ? "PUT" : "POST", json: parsed.value },
    );
    savedId = saved.id;
  } catch (e) {
    return failure(e);
  }
  if (!id) redirect(`/admin/kits/${savedId}`);
  refresh();
  return { saved: true };
}

export async function deleteKit(id: string): Promise<ActionState> {
  try {
    await adminFetch(`/api/admin/kits/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  } catch (e) {
    return failure(e);
  }
  redirect("/admin/kits");
}

// Cupons

export async function saveCoupon(
  code: string | null,
  _: ActionState,
  form: FormData,
): Promise<ActionState> {
  const parsed = couponInput(form);
  if (!parsed.ok) return { error: parsed.error };
  try {
    await adminFetch(
      code
        ? `/api/admin/coupons/${encodeURIComponent(code)}`
        : "/api/admin/coupons",
      { method: code ? "PUT" : "POST", json: parsed.value },
    );
  } catch (e) {
    return failure(e);
  }
  if (!code) redirect("/admin/cupons");
  refresh();
  return { saved: true };
}

export async function deleteCoupon(code: string): Promise<ActionState> {
  try {
    await adminFetch(`/api/admin/coupons/${encodeURIComponent(code)}`, {
      method: "DELETE",
    });
  } catch (e) {
    return failure(e);
  }
  redirect("/admin/cupons");
}

// Configurações da loja

export async function saveSettings(
  _: ActionState,
  form: FormData,
): Promise<ActionState> {
  const parsed = settingsInput(form);
  if (!parsed.ok) return { error: parsed.error };
  try {
    await adminFetch("/api/admin/settings", {
      method: "PUT",
      json: parsed.value,
    });
  } catch (e) {
    return failure(e);
  }
  refresh();
  return { saved: true };
}
