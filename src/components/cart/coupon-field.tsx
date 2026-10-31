"use client";

import { useEffect, useState } from "react";

import { couponLabel } from "@/features/coupons/coupons";
import { useCart } from "@/features/cart/store";
import type { AppliedCoupon } from "@/types/coupon";

type Response =
  { ok: true; coupon: AppliedCoupon } | { ok: false; reason: string };

async function validate(code: string): Promise<Response> {
  try {
    const res = await fetch("/api/cupom", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code }),
    });
    return (await res.json()) as Response;
  } catch {
    return {
      ok: false,
      reason: "Não foi possível validar agora. Tente de novo.",
    };
  }
}

/** Campo para aplicar um cupom; reconfere o cupom salvo ao abrir. */
export function CouponField({ blockedReason }: { blockedReason?: string }) {
  const coupon = useCart((s) => s.coupon);
  const setCoupon = useCart((s) => s.setCoupon);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  // O cupom salvo pode ter expirado ou sido desativado desde a última visita.
  const savedCode = coupon?.code;
  useEffect(() => {
    if (!savedCode) return;
    let cancelled = false;
    void validate(savedCode).then((r) => {
      if (cancelled) return;
      if (r.ok) setCoupon(r.coupon);
      else {
        setCoupon(null);
        setError(`O cupom ${savedCode} não vale mais: ${r.reason}`);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [savedCode, setCoupon]);

  if (coupon) {
    return (
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium">Cupom {coupon.code}</p>
          <p className="text-small text-ink-muted">{couponLabel(coupon)}</p>
          {blockedReason && (
            <p className="text-small text-ink mt-1">{blockedReason}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setCoupon(null)}
          className="text-small text-ink-muted hover:text-ink inline-flex min-h-11 shrink-0 items-center whitespace-nowrap underline underline-offset-4"
        >
          Remover cupom
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!code.trim()) return;
        setPending(true);
        setError(null);
        const r = await validate(code);
        setPending(false);
        if (r.ok) {
          setCoupon(r.coupon);
          setCode("");
        } else setError(r.reason);
      }}
    >
      <label htmlFor="cupom" className="text-small text-ink-muted">
        Cupom de desconto
      </label>
      <div className="mt-1 flex gap-2">
        <input
          id="cupom"
          name="cupom"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          autoComplete="off"
          spellCheck={false}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "cupom-erro" : undefined}
          placeholder="Digite o código…"
          className="bg-surface placeholder:text-ink-muted/70 h-11 min-w-0 flex-1 rounded-full px-4 uppercase shadow-[inset_0_2px_5px_rgb(36_35_31/0.1)] placeholder:normal-case"
        />
        <button
          type="submit"
          disabled={pending || !code.trim()}
          className="bg-ink text-surface hover:bg-brand h-11 shrink-0 rounded-full px-5 font-medium transition-colors disabled:opacity-40"
        >
          {pending ? "Validando…" : "Aplicar"}
        </button>
      </div>
      {error && (
        <p id="cupom-erro" role="alert" className="text-small text-ink mt-2">
          {error}
        </p>
      )}
    </form>
  );
}
