"use client";

import { siteConfig } from "@/config/site";
import { toOrderLines } from "@/features/cart/cart";
import { useCart } from "@/features/cart/store";
import {
  buildOrderMessage,
  buildWhatsAppUrl,
} from "@/features/checkout/whatsapp";

import { useResolvedCart } from "./cart/cart-provider";
import { Container } from "./container";

const iconProps = {
  "aria-hidden": true,
  width: 26,
  height: 26,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const steps = [
  {
    title: "Escolha seus produtos",
    text: "Navegue pelas categorias e toque em “Adicionar à sacola”. Você pode mudar as quantidades a qualquer momento.",
    icon: (
      <svg {...iconProps}>
        <path d="M5 8h14l-1 12H6L5 8Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </svg>
    ),
  },
  {
    title: "Envie o pedido pelo WhatsApp",
    text: "Na sacola, toque em “Finalizar pedido”. O WhatsApp abre com a lista e o subtotal já escritos. É só enviar.",
    icon: (
      <svg {...iconProps}>
        <path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12Z" />
        <path d="M9 10h6M9 13.5h4" />
      </svg>
    ),
  },
  {
    title: "Combine pagamento e entrega",
    text: "Na conversa, a gente confirma os produtos e combina com você a forma de pagamento e a entrega.",
    icon: (
      <svg {...iconProps}>
        <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" />
        <circle cx="7" cy="17.5" r="1.5" />
        <circle cx="17" cy="17.5" r="1.5" />
      </svg>
    ),
  },
];

const questions = [
  {
    q: "Preciso criar conta ou pagar pelo site?",
    a: "Não. O site só monta o seu pedido. Pagamento e entrega são combinados direto na conversa do WhatsApp.",
  },
  {
    q: "Quantas unidades tem de cada produto?",
    a: "A maioria dos produtos tem uma unidade só. A página de cada produto mostra quantas estão disponíveis, e a sacola não deixa passar desse número.",
  },
  {
    q: "Os produtos são todos japoneses?",
    a: "Não. Temos marcas japonesas e coreanas. A marca aparece em cada produto.",
  },
  {
    q: "Posso tirar uma dúvida antes de comprar?",
    a: "Pode, sim. Chame a gente no WhatsApp pelo botão abaixo.",
  },
];

const EXAMPLE_MESSAGE = [
  "Olá! Tenho interesse nestes produtos:",
  "",
  "• 1x (o produto que você escolher)",
  "",
  "Subtotal: (calculado na sacola)",
  "",
  "Podemos combinar entrega e pagamento?",
].join("\n");

export function HowToBuy() {
  const cart = useResolvedCart();
  const openCart = useCart((s) => s.open);
  const hasItems = cart.lines.length > 0;
  const message = hasItems
    ? buildOrderMessage(toOrderLines(cart.lines))
    : EXAMPLE_MESSAGE;
  const questionUrl = siteConfig.whatsappNumber
    ? buildWhatsAppUrl(
        siteConfig.whatsappNumber,
        "Olá! Tenho uma dúvida sobre um produto.",
      )
    : null;

  return (
    <section
      id="como-comprar"
      aria-labelledby="como-comprar-titulo"
      className="scroll-mt-4 py-14 lg:py-24"
    >
      <Container>
        <h2 id="como-comprar-titulo" className="font-display text-head">
          Como comprar
        </h2>
        <p className="text-lead text-ink-muted mt-3 max-w-[52ch]">
          Sem cadastro e sem pagamento pelo site. Em três passos o seu pedido
          chega até a gente.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <ol className="grid gap-4 lg:col-span-7">
            {steps.map((s, i) => (
              <li
                key={s.title}
                className="bg-surface-raised flex gap-5 p-5 lg:p-6"
              >
                <span className="bg-surface text-brand relative flex size-14 shrink-0 items-center justify-center rounded-full">
                  {s.icon}
                  <span
                    aria-hidden="true"
                    className="bg-brand text-small text-brand-ink absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full font-semibold"
                  >
                    {i + 1}
                  </span>
                </span>
                <div>
                  <h3 className="text-lead font-medium">{s.title}</h3>
                  <p className="text-ink-muted mt-1">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <figure className="lg:col-span-5">
            <div className="bg-surface-raised p-5 lg:p-6">
              <figcaption className="text-small text-ink-muted flex items-center justify-between gap-3">
                <span>
                  {hasItems
                    ? "A mensagem do seu pedido"
                    : "Exemplo da mensagem enviada"}
                </span>
                <span className="text-ink font-medium">WhatsApp</span>
              </figcaption>
              <p
                aria-live="polite"
                className="bg-surface text-small mt-4 ml-auto max-w-[34ch] rounded-2xl rounded-br-sm p-4 leading-relaxed whitespace-pre-line"
              >
                {message}
              </p>
              {hasItems ? (
                <button
                  type="button"
                  onClick={openCart}
                  className="bg-brand text-brand-ink hover:bg-brand-hover mt-5 h-11 w-full px-4 font-medium transition-colors"
                >
                  Revisar a sacola e enviar
                </button>
              ) : (
                <a
                  href="#produtos"
                  className="bg-brand text-brand-ink hover:bg-brand-hover mt-5 flex h-11 w-full items-center justify-center px-4 font-medium transition-colors"
                >
                  Escolher produtos
                </a>
              )}
            </div>
          </figure>
        </div>

        <div className="mt-14 grid gap-8 lg:mt-20 lg:grid-cols-12 lg:gap-12">
          <h3 className="font-display text-[1.75rem] leading-tight lg:col-span-4">
            Perguntas frequentes
          </h3>
          <div className="lg:col-span-8">
            <div className="divide-placeholder divide-y">
              {questions.map(({ q, a }) => (
                <details key={q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                    {q}
                    <span
                      aria-hidden="true"
                      className="bg-surface-raised text-brand text-lead flex size-8 shrink-0 items-center justify-center rounded-full transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="text-ink-muted mt-2 max-w-[60ch]">{a}</p>
                </details>
              ))}
            </div>
            {questionUrl && (
              <a
                href={questionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-surface-raised text-brand hover:bg-placeholder mt-6 inline-flex h-11 items-center px-6 font-medium transition-colors"
              >
                Tirar dúvida no WhatsApp
              </a>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
