import { timingSafeEqual } from "node:crypto";

import { revalidateTag } from "next/cache";
import { after } from "next/server";

import { CATALOG_TAG, getVisibleProducts } from "@/features/catalog/queries";

function authorized(request: Request): boolean {
  const secret = process.env.STOREFRONT_REVALIDATE_SECRET;
  const header = request.headers.get("authorization") ?? "";
  if (!secret) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const given = Buffer.from(header);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/**
 * Visita as páginas da loja logo depois do aviso. A atualização do cache é
 * "preguiçosa": a primeira visita depois de uma mudança ainda recebe a versão
 * antiga e só dispara a nova. Fazendo essa primeira visita aqui, quem abre a
 * loja em seguida (a Carol, um cliente) já vê o dado novo.
 */
async function warm(origin: string) {
  const products = await getVisibleProducts().catch(() => []);
  const paths = [
    "/",
    "/sacola",
    "/entregas-e-pagamento",
    ...products.map((p) => `/produtos/${p.slug}`),
  ];
  for (let i = 0; i < paths.length; i += 6) {
    await Promise.all(
      paths
        .slice(i, i + 6)
        .map((path) =>
          fetch(`${origin}${path}`, { cache: "no-store" }).catch(() => null),
        ),
    );
  }
}

/** A API chama aqui quando produto, kit ou configuração muda no backoffice. */
export async function POST(request: Request) {
  if (!authorized(request))
    return Response.json({ ok: false }, { status: 401 });
  revalidateTag(CATALOG_TAG, "max");
  const origin = new URL(request.url).origin;
  after(() => warm(origin));
  return Response.json({ ok: true });
}
