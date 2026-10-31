import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SESSION_COOKIE } from "./session-cookie";

/**
 * Única porta do backoffice para a API Java. Roda só no servidor: o token
 * fica num cookie httpOnly e nunca chega ao JavaScript do navegador.
 */

const SESSION_HOURS = 12;

function backendUrl(path: string): string {
  const base = process.env.BACKEND_URL ?? "http://localhost:8080";
  return `${base.replace(/\/$/, "")}${path}`;
}

export class AdminApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function errorFrom(res: Response): Promise<AdminApiError> {
  const body = (await res.json().catch(() => null)) as {
    error?: string;
  } | null;
  return new AdminApiError(
    body?.error ?? "Não consegui falar com o servidor da loja.",
    res.status,
  );
}

export async function login(password: string): Promise<void> {
  let res: Response;
  try {
    res = await fetch(backendUrl("/api/admin/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
      cache: "no-store",
    });
  } catch {
    throw new AdminApiError("O servidor da loja não respondeu.", 503);
  }
  if (!res.ok) throw await errorFrom(res);
  const { token } = (await res.json()) as { token: string };
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: SESSION_HOURS * 60 * 60,
  });
}

export async function logout(): Promise<void> {
  (await cookies()).delete({ name: SESSION_COOKIE, path: "/admin" });
}

/**
 * Chamada autenticada. Sem sessão ou com token vencido, volta para o login.
 * Erros de regra (400, 404, 409) viram AdminApiError com a mensagem da API.
 */
export async function adminFetch<T>(
  path: string,
  init: { method?: string; json?: unknown; body?: FormData } = {},
): Promise<T> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) redirect("/admin/entrar");

  const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
  if (init.json !== undefined) headers["Content-Type"] = "application/json";

  let res: Response;
  try {
    res = await fetch(backendUrl(path), {
      method: init.method ?? "GET",
      headers,
      body: init.json !== undefined ? JSON.stringify(init.json) : init.body,
      cache: "no-store",
    });
  } catch {
    throw new AdminApiError("O servidor da loja não respondeu.", 503);
  }
  if (res.status === 401) redirect("/admin/entrar");
  if (!res.ok) throw await errorFrom(res);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
