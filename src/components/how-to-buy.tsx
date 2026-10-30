import { Container } from "./container";

const steps = [
  {
    title: "Escolha os produtos",
    text: "Adicione à sacola o que quiser levar.",
  },
  {
    title: "Envie o pedido",
    text: "A sacola abre o WhatsApp com a lista e o subtotal prontos.",
  },
  {
    title: "Combine pagamento e entrega",
    text: "Tudo é acertado na conversa, sem cadastro no site.",
  },
];

export function HowToBuy() {
  return (
    <section
      id="como-comprar"
      aria-labelledby="como-comprar-titulo"
      className="bg-surface"
    >
      <Container className="grid gap-8 py-14 md:grid-cols-12 lg:py-20">
        <h2
          id="como-comprar-titulo"
          className="font-display text-head md:col-span-4"
        >
          Como comprar
        </h2>
        <ol className="grid gap-6 sm:grid-cols-3 md:col-span-8">
          {steps.map((s) => (
            <li key={s.title}>
              <h3 className="font-medium">{s.title}</h3>
              <p className="text-ink-muted mt-1">{s.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
