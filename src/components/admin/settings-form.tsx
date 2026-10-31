"use client";

import { useActionState, useState } from "react";

import { saveSettings } from "@/app/admin/actions";
import { formatMoneyInput, parseMoney } from "@/features/admin/money";
import {
  quoteDelivery,
  type StoreSettings,
} from "@/features/checkout/delivery";
import { formatPrice } from "@/lib/currency";

import { SaveBar, submitKeepingValues } from "./form-parts";
import { ImageManager } from "./image-manager";
import { Field, inputClass, Section, textareaClass } from "./ui";

/** Pedidos de exemplo para mostrar a taxa como a sacola vai calcular. */
const SAMPLES = [9990, 24990];

export function SettingsForm({ settings }: { settings: StoreSettings }) {
  const [state, action, pending] = useActionState(saveSettings, {});
  const [percent, setPercent] = useState(String(settings.deliveryFeePercent));
  const [free, setFree] = useState(
    formatMoneyInput(settings.freeDeliveryFromCents),
  );
  const [sellerName, setSellerName] = useState(settings.sellerName ?? "");

  const parsedFree = parseMoney(free);
  const preview = {
    deliveryFeePercent: Math.min(100, Math.max(0, Number(percent) || 0)),
    freeDeliveryFromCents:
      parsedFree.ok && parsedFree.cents !== null ? parsedFree.cents : undefined,
  };

  return (
    <form onSubmit={submitKeepingValues(action)}>
      <Section
        title="Entrega e retirada"
        description="Aparece na sacola, na página Entregas e pagamento e na mensagem do WhatsApp."
      >
        <Field label="Onde entrega em mãos" htmlFor="deliveryArea">
          <input
            id="deliveryArea"
            name="deliveryArea"
            defaultValue={settings.deliveryArea}
            placeholder="Porto Alegre e região metropolitana"
            className={inputClass}
          />
        </Field>
        <Field
          label="Onde é a retirada"
          htmlFor="pickupLocation"
          hint="Só a cidade ou o bairro. O endereço exato é combinado na conversa."
        >
          <input
            id="pickupLocation"
            name="pickupLocation"
            defaultValue={settings.pickupLocation}
            className={inputClass}
          />
        </Field>
        <Field
          label="Prazo de entrega"
          htmlFor="deliveryLeadTime"
          hint="Ex.: até 3 dias úteis depois da confirmação do pagamento."
        >
          <input
            id="deliveryLeadTime"
            name="deliveryLeadTime"
            defaultValue={settings.deliveryLeadTime}
            className={inputClass}
          />
        </Field>
      </Section>

      <Section
        title="Taxa de entrega"
        description="Retirada nunca paga. A entrega paga a taxa até o valor do frete grátis."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Taxa (% do pedido)" htmlFor="deliveryFeePercent">
            <input
              id="deliveryFeePercent"
              name="deliveryFeePercent"
              type="number"
              min={0}
              max={100}
              required
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
              className={`${inputClass} tabular-nums`}
            />
          </Field>
          <Field
            label="Entrega grátis a partir de (R$)"
            htmlFor="freeDeliveryFrom"
            hint="Vazio = a entrega sempre paga a taxa."
          >
            <input
              id="freeDeliveryFrom"
              name="freeDeliveryFrom"
              inputMode="decimal"
              placeholder="200,00"
              value={free}
              onChange={(e) => setFree(e.target.value)}
              aria-invalid={!parsedFree.ok}
              className={`${inputClass} tabular-nums ${
                parsedFree.ok ? "" : "border-negative"
              }`}
            />
          </Field>
        </div>
        <div className="bg-surface rounded-lg px-4 py-3 text-sm">
          <p className="text-ink-muted mb-1">Na sacola, com entrega:</p>
          <ul className="grid gap-0.5 tabular-nums">
            {SAMPLES.map((total) => {
              const { feeCents } = quoteDelivery(total, "entrega", preview);
              return (
                <li key={total}>
                  Pedido de {formatPrice(total)} →{" "}
                  {feeCents > 0
                    ? `taxa de ${formatPrice(feeCents)}`
                    : "entrega grátis"}
                </li>
              );
            })}
          </ul>
        </div>
      </Section>

      <Section
        title="Quem vende"
        description="Seção da página inicial. Só aparece quando tiver nome e foto."
      >
        <Field label="Nome" htmlFor="sellerName">
          <input
            id="sellerName"
            name="sellerName"
            value={sellerName}
            onChange={(e) => setSellerName(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field
          label="Texto"
          htmlFor="sellerBio"
          hint="Opcional. Separe os parágrafos com uma linha em branco."
        >
          <textarea
            id="sellerBio"
            name="sellerBio"
            rows={4}
            defaultValue={settings.sellerBio}
            className={textareaClass}
          />
        </Field>
        <div className="grid gap-2">
          <span className="text-sm font-medium">Foto</span>
          <ImageManager
            initial={settings.sellerPhoto ? [settings.sellerPhoto] : []}
            slug="quem-vende"
            defaultAlt={sellerName}
            emptyHint="Sem foto: a seção Quem vende não aparece no site."
          />
          <p className="text-ink-muted text-[0.8125rem]">
            Só a primeira foto é usada. Vertical (em pé) fica melhor.
          </p>
        </div>
      </Section>

      <SaveBar state={state} pending={pending} label="Salvar configurações" />
    </form>
  );
}
