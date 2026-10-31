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

/** Cores do quadro da marca, uma por passo (sobre a faixa oliva). */
const stepColors = [
  "bg-tile-rose text-ink",
  "bg-tile-taupe text-ink",
  "bg-surface text-ink",
];

const questions = [
  {
    q: "Preciso criar conta ou pagar pelo site?",
    a: "Não. O site só monta o seu pedido. Pagamento e entrega são combinados direto na conversa do WhatsApp.",
  },
  {
    q: "Os produtos são originais?",
    a: "Sim. Todos os produtos são originais, comprados pessoalmente no Japão, nas embalagens de fábrica.",
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
    <section id="como-comprar" aria-labelledby="como-comprar-titulo">
      {/* Faixa da marca: os três passos em cores diferentes do quadro. */}
      <div className="bg-brand text-brand-ink scroll-mt-4 py-16 lg:py-24">
        <Container>
          <div className="reveal max-w-[60ch]">
            <h2 id="como-comprar-titulo" className="font-display text-head">
              Como comprar
            </h2>
            <p className="text-lead mt-3 opacity-80">
              Sem cadastro e sem pagamento pelo site. Em três passos o seu
              pedido chega até a gente.
            </p>
          </div>

          <ol className="mt-10 grid gap-4 md:grid-cols-3 lg:mt-14 lg:gap-6">
            {steps.map((s, i) => (
              <li
                key={s.title}
                className={`reveal relative flex flex-col p-6 lg:p-8 ${stepColors[i]}`}
              >
                <span className="flex items-start justify-between">
                  <span
                    className={`text-brand flex size-14 items-center justify-center rounded-full ${i === steps.length - 1 ? "bg-surface-raised" : "bg-surface"}`}
                  >
                    {s.icon}
                  </span>
                  <span
                    aria-hidden="true"
                    className="font-display text-[4rem] leading-none opacity-30"
                  >
                    {i + 1}
                  </span>
                </span>
                <h3 className="font-display mt-8 text-[1.75rem] leading-tight">
                  {s.title}
                </h3>
                <p className="mt-2 opacity-80">{s.text}</p>
              </li>
            ))}
          </ol>

          {/* Demonstração: a mensagem como ela chega no WhatsApp. */}
          <div className="mt-14 grid items-center gap-10 lg:mt-20 lg:grid-cols-12">
            <div className="reveal lg:col-span-5">
              <h3 className="font-display text-[2rem] leading-tight">
                {hasItems
                  ? "Seu pedido, pronto para enviar"
                  : "É assim que o seu pedido chega"}
              </h3>
              <p className="mt-3 max-w-[44ch] opacity-80">
                {hasItems
                  ? "Esta é a mensagem com os itens da sua sacola. Revise e envie pelo WhatsApp."
                  : "A sacola escreve a mensagem por você, com os produtos e o subtotal. É só enviar e combinar o resto na conversa."}
              </p>
              {hasItems ? (
                <button
                  type="button"
                  onClick={openCart}
                  className="bg-surface text-brand hover:bg-surface-raised mt-6 inline-flex h-12 items-center px-7 font-medium transition-colors"
                >
                  Revisar a sacola e enviar
                </button>
              ) : (
                <a
                  href="#produtos"
                  className="bg-surface text-brand hover:bg-surface-raised mt-6 inline-flex h-12 items-center px-7 font-medium transition-colors"
                >
                  Escolher produtos
                </a>
              )}
            </div>

            <figure className="reveal lg:col-span-6 lg:col-start-7">
              <div className="bg-tile-charcoal mx-auto max-w-sm rounded-[2.25rem] p-3 shadow-2xl">
                <div className="bg-chat overflow-hidden rounded-[1.75rem]">
                  <figcaption className="bg-chat-header text-brand-ink flex items-center gap-3 px-4 py-3">
                    <span className="bg-brand-ink text-brand font-display text-lead flex size-9 items-center justify-center rounded-full">
                      Z
                    </span>
                    <span className="leading-tight">
                      <span className="block font-medium">
                        {siteConfig.name}
                      </span>
                      <span className="text-small opacity-80">
                        {hasItems ? "Seu pedido" : "Exemplo de pedido"}
                      </span>
                    </span>
                  </figcaption>
                  <div className="min-h-64 px-4 py-6">
                    <p
                      aria-live="polite"
                      className="bg-chat-bubble text-ink text-small ml-auto max-w-[30ch] rounded-2xl rounded-tr-sm p-3 leading-relaxed whitespace-pre-line shadow-sm"
                    >
                      {message}
                    </p>
                  </div>
                </div>
              </div>
            </figure>
          </div>
        </Container>
      </div>

      {/* Perguntas frequentes, de volta ao fundo claro. */}
      <div className="py-16 lg:py-24">
        <Container className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="reveal lg:col-span-4">
            <h3 className="font-display text-head leading-tight">
              Perguntas frequentes
            </h3>
            {questionUrl && (
              <a
                href={questionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand text-brand-ink hover:bg-brand-hover mt-6 inline-flex h-11 items-center px-6 font-medium transition-colors"
              >
                Tirar dúvida no WhatsApp
              </a>
            )}
          </div>
          <div className="divide-placeholder reveal divide-y lg:col-span-8">
            {questions.map(({ q, a }) => (
              <details key={q} className="group py-5">
                <summary className="text-lead flex cursor-pointer list-none items-center justify-between gap-4">
                  {q}
                  <span
                    aria-hidden="true"
                    className="bg-brand text-brand-ink text-lead flex size-9 shrink-0 items-center justify-center rounded-full transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="text-ink-muted mt-3 max-w-[60ch]">{a}</p>
              </details>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
