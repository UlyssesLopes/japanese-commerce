import { Container } from "./container";

/** Página de política da loja: título, resumo e seções de texto. */
export function PolicyPage({
  title,
  summary,
  children,
}: {
  title: string;
  summary: string;
  children: React.ReactNode;
}) {
  return (
    <Container className="py-10 lg:py-16">
      <article className="max-w-[68ch]">
        <h1 className="font-display text-head text-balance">{title}</h1>
        <p className="text-lead text-ink-muted mt-3">{summary}</p>
        <div className="mt-10 space-y-10">{children}</div>
      </article>
    </Container>
  );
}

export function PolicySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lead font-semibold">{title}</h2>
      <div className="mt-3 space-y-3 [&_li]:mt-1.5 [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
