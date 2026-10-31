"use client";

import { useActionState, useState } from "react";

import { deleteCoupon, saveCoupon } from "@/app/admin/actions";
import { formatMoneyInput, parseMoney } from "@/features/admin/money";
import type { AdminCoupon } from "@/features/admin/types";
import {
  applyCoupon,
  couponLabel,
  normalizeCode,
} from "@/features/coupons/coupons";
import { formatPrice } from "@/lib/currency";

import { DeleteZone, SaveBar, submitKeepingValues } from "./form-parts";
import { Check, Field, inputClass, Section } from "./ui";

/** Subtotal de exemplo para a prévia: um produto de R$ 249,90. */
const SAMPLE_SUBTOTAL = 24990;

export function CouponForm({ coupon }: { coupon?: AdminCoupon }) {
  const [state, action, pending] = useActionState(
    saveCoupon.bind(null, coupon?.code ?? null),
    {},
  );
  const [code, setCode] = useState(coupon?.code ?? "");
  const [type, setType] = useState<AdminCoupon["type"]>(
    coupon?.type ?? "percent",
  );
  const [value, setValue] = useState(
    coupon
      ? coupon.type === "percent"
        ? String(coupon.value)
        : formatMoneyInput(coupon.value)
      : "",
  );
  const [min, setMin] = useState(formatMoneyInput(coupon?.minSubtotalCents));
  const [description, setDescription] = useState(coupon?.description ?? "");

  // Prévia com a mesma conta da sacola.
  const parsedValue =
    type === "percent"
      ? /^\d+$/.test(value)
        ? Number(value)
        : null
      : (() => {
          const p = parseMoney(value);
          return p.ok ? p.cents : null;
        })();
  const parsedMin = parseMoney(min);
  const preview =
    parsedValue && parsedValue > 0
      ? {
          code: normalizeCode(code) || "CUPOM",
          type,
          value: parsedValue,
          minSubtotalCents:
            parsedMin.ok && parsedMin.cents ? parsedMin.cents : undefined,
          description: description.trim() || undefined,
        }
      : null;
  const result = preview ? applyCoupon(SAMPLE_SUBTOTAL, preview) : null;

  return (
    <form onSubmit={submitKeepingValues(action)}>
      <Section
        title="Cupom"
        description="O cliente digita o código na sacola. Letras, números e hífen."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Código"
            htmlFor="code"
            hint={coupon ? "O código não muda depois de criado." : undefined}
          >
            <input
              id="code"
              name="code"
              required
              readOnly={Boolean(coupon)}
              value={code}
              onChange={(e) => setCode(normalizeCode(e.target.value))}
              placeholder="BEMVINDA10"
              className={`${inputClass} read-only:bg-surface font-mono uppercase`}
            />
          </Field>
          <Field
            label="Texto na sacola"
            htmlFor="description"
            hint="Opcional. Ex.: 10% na primeira compra."
          >
            <input
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
      </Section>

      <Section title="Desconto">
        <fieldset className="flex flex-wrap gap-2">
          <legend className="mb-2 text-sm font-medium">Tipo</legend>
          {(
            [
              ["percent", "Percentual (%)"],
              ["fixed", "Valor fixo (R$)"],
            ] as const
          ).map(([option, label]) => (
            <label
              key={option}
              className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm ${
                type === option ? "border-ink font-medium" : "border-line"
              }`}
            >
              <input
                type="radio"
                name="type"
                value={option}
                checked={type === option}
                onChange={() => {
                  setType(option);
                  setValue("");
                }}
                className="accent-brand"
              />
              {label}
            </label>
          ))}
        </fieldset>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label={type === "percent" ? "Desconto (%)" : "Desconto (R$)"}
            htmlFor="value"
          >
            <input
              id="value"
              name="value"
              required
              inputMode={type === "percent" ? "numeric" : "decimal"}
              placeholder={type === "percent" ? "10" : "20,00"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className={`${inputClass} tabular-nums`}
            />
          </Field>
          <Field
            label="Compra mínima (R$)"
            htmlFor="minSubtotal"
            hint="Opcional."
          >
            <input
              id="minSubtotal"
              name="minSubtotal"
              inputMode="decimal"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              className={`${inputClass} tabular-nums`}
            />
          </Field>
        </div>
        <div className="bg-surface rounded-lg px-4 py-3 text-sm">
          {preview && result ? (
            <>
              <p className="text-ink-muted mb-1">
                Numa compra de {formatPrice(SAMPLE_SUBTOTAL)}, a sacola mostra:
              </p>
              {result.blockedReason ? (
                <p>{result.blockedReason}</p>
              ) : (
                <p className="tabular-nums">
                  Cupom {preview.code} ({couponLabel(preview)}): −
                  {formatPrice(result.discountCents)} · Total{" "}
                  {formatPrice(result.totalCents)}
                </p>
              )}
            </>
          ) : (
            <p className="text-ink-muted">
              Preencha o desconto para ver como fica na sacola.
            </p>
          )}
        </div>
      </Section>

      <Section
        title="Validade"
        description="Datas inclusivas, no horário de Brasília. Vazio = sem limite."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Começa em" htmlFor="startsAt">
            <input
              id="startsAt"
              name="startsAt"
              type="date"
              defaultValue={coupon?.startsAt}
              className={inputClass}
            />
          </Field>
          <Field label="Termina em" htmlFor="endsAt">
            <input
              id="endsAt"
              name="endsAt"
              type="date"
              defaultValue={coupon?.endsAt}
              className={inputClass}
            />
          </Field>
        </div>
        <Check
          name="active"
          label="Cupom ativo"
          description="Desative para pausar sem apagar."
          defaultChecked={coupon?.active ?? true}
        />
      </Section>

      <SaveBar
        state={state}
        pending={pending}
        label={coupon ? "Salvar alterações" : "Criar cupom"}
      />

      {coupon && (
        <DeleteZone
          what={`o cupom ${coupon.code}`}
          consequence="O código deixa de valer na sacola."
          action={deleteCoupon.bind(null, coupon.code)}
        />
      )}
    </form>
  );
}
