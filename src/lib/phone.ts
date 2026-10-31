/** Número brasileiro para leitura: "5551992279106" → "(51) 99227-9106". */
export function formatPhone(international: string): string {
  const digits = international.replace(/\D/g, "").replace(/^55/, "");
  const match = /^(\d{2})(\d{4,5})(\d{4})$/.exec(digits);
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : international;
}
