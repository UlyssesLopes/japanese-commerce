/** Aviso de poucas unidades sobre a foto (texto de `stockBadge`). */
export function StockTag({ label }: { label: string | null }) {
  if (!label) return null;
  return (
    <span className="bg-brand text-brand-ink text-small absolute top-2 left-2 z-[1] px-2.5 py-1 font-medium">
      {label}
    </span>
  );
}
