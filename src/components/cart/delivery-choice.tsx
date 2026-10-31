"use client";

import { useId } from "react";

import {
  quoteDelivery,
  type DeliveryMethod,
} from "@/features/checkout/delivery";
import { useCart } from "@/features/cart/store";
import { formatPrice } from "@/lib/currency";

import { useStoreSettings } from "./cart-provider";

/** Entrega em mãos ou retirada, com a taxa calculada na hora. */
export function DeliveryChoice({ totalCents }: { totalCents: number }) {
  const settings = useStoreSettings();
  // A sacola aparece na gaveta e na página: cada grupo precisa de nome próprio.
  const name = useId();
  const { delivery, setDelivery } = useCart();
  const entrega = quoteDelivery(totalCents, "entrega", settings);

  const options: { value: DeliveryMethod; label: string; detail: string }[] = [
    {
      value: "entrega",
      label: settings.deliveryArea
        ? `Entrega em mãos · ${settings.deliveryArea}`
        : "Entrega em mãos",
      detail:
        entrega.feeCents > 0
          ? `Taxa de ${formatPrice(entrega.feeCents)}`
          : "Grátis",
    },
    {
      value: "retirada",
      label: settings.pickupLocation
        ? `Retirada · ${settings.pickupLocation}`
        : "Retirada",
      detail: "Sem custo, com dia e horário combinados",
    },
  ];

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 font-medium">Como prefere receber?</legend>
      {options.map((option) => (
        <label
          key={option.value}
          className={`bg-surface flex cursor-pointer items-start gap-3 border p-3 ${
            delivery === option.value ? "border-ink" : "border-transparent"
          }`}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={delivery === option.value}
            onChange={() => setDelivery(option.value)}
            className="accent-brand mt-1"
          />
          <span className="min-w-0">
            <span className="block">{option.label}</span>
            <span className="text-small text-ink-muted block">
              {option.detail}
            </span>
          </span>
        </label>
      ))}
      {delivery === "entrega" && entrega.missingForFreeCents !== undefined && (
        <p className="text-small text-ink-muted">
          Faltam {formatPrice(entrega.missingForFreeCents)} para a entrega sair
          grátis.
        </p>
      )}
    </fieldset>
  );
}
