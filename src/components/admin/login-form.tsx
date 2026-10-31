"use client";

import { useActionState } from "react";

import { loginAction } from "@/app/admin/actions";

import { buttonClass, ErrorNote, Field, inputClass } from "./ui";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, {});
  return (
    <form action={action} className="grid gap-5">
      <Field label="Senha do backoffice" htmlFor="password">
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          className={inputClass}
        />
      </Field>
      {state.error && <ErrorNote>{state.error}</ErrorNote>}
      <button type="submit" disabled={pending} className={buttonClass.primary}>
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
