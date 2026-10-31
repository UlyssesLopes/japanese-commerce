/**
 * Preço digitado no backoffice ("249,90", "R$ 1.249,90", "79") para
 * centavos. Vazio = preço em definição (null). Nada de float: a conversão
 * é feita sobre os dígitos.
 */
export function parseMoney(
  input: string,
): { ok: true; cents: number | null } | { ok: false } {
  const text = input.replace(/R\$/i, "").replace(/\s/g, "");
  if (text === "") return { ok: true, cents: null };

  // "," ou "." seguido de 1-2 dígitos no fim são os centavos; "." entre
  // grupos de 3 dígitos é separador de milhar.
  const match = /^(\d{1,3}(?:\.\d{3})+|\d+)(?:[.,](\d{1,2}))?$/.exec(text);
  if (!match) return { ok: false };
  const reais = Number(match[1].replace(/[.,]/g, ""));
  const centavos = Number((match[2] ?? "0").padEnd(2, "0"));
  const cents = reais * 100 + centavos;
  if (!Number.isSafeInteger(cents)) return { ok: false };
  return { ok: true, cents };
}

/** Centavos para o campo de preço ("249,90"); vazio quando sem preço. */
export function formatMoneyInput(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return "";
  const reais = Math.floor(cents / 100);
  return `${reais},${String(cents % 100).padStart(2, "0")}`;
}
