import { timingSafeEqual } from "node:crypto";

import { revalidateTag } from "next/cache";

import { CATALOG_TAG } from "@/features/catalog/queries";

function authorized(request: Request): boolean {
  const secret = process.env.STOREFRONT_REVALIDATE_SECRET;
  const header = request.headers.get("authorization") ?? "";
  if (!secret) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const given = Buffer.from(header);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/**
 * A API chama aqui quando produto ou kit muda no backoffice. A próxima
 * visita dispara a atualização e as seguintes já mostram o catálogo novo.
 */
export async function POST(request: Request) {
  if (!authorized(request))
    return Response.json({ ok: false }, { status: 401 });
  revalidateTag(CATALOG_TAG, "max");
  return Response.json({ ok: true });
}
