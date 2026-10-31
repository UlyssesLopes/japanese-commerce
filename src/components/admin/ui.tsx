import type { Product } from "@/types/product";

/** Peças visuais do backoffice. Só apresentação, sem estado. */

export const inputClass =
  "bg-sheet border-field text-ink placeholder:text-ink-muted/70 focus-visible:border-brand block w-full rounded-md border px-3 py-2 text-[0.9375rem]";

/** Campos de texto longo crescem com o conteúdo. */
export const textareaClass = `${inputClass} field-sizing-content min-h-20`;

export const buttonClass = {
  primary:
    "bg-brand text-brand-ink hover:bg-brand-hover inline-flex h-9 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium disabled:opacity-60",
  secondary:
    "bg-sheet border-field text-ink hover:border-ink inline-flex h-9 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium",
  danger:
    "text-negative border-negative/40 hover:border-negative inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium",
  text: "text-ink hover:text-brand text-sm font-medium underline-offset-4 hover:underline",
};

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-[1.5rem] leading-tight font-semibold">{title}</h1>
        {subtitle && (
          <p className="text-ink-muted mt-1 text-[0.9375rem]">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  );
}

/** Seção de formulário: título e explicação à esquerda, campos à direita. */
export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="border-rule grid gap-4 border-t py-8 first:border-t-0 first:pt-0 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10">
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        {description && (
          <p className="text-ink-muted mt-1 text-sm leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="grid content-start gap-2">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && <p className="text-ink-muted text-[0.8125rem]">{hint}</p>}
    </div>
  );
}

export function Check({
  name,
  label,
  description,
  defaultChecked,
  checked,
  onChange,
}: {
  name: string;
  label: string;
  description?: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        checked={checked}
        onChange={onChange && ((e) => onChange(e.target.checked))}
        className="accent-brand mt-0.5 size-[1.125rem] flex-none"
      />
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {description && (
          <span className="text-ink-muted block text-[0.8125rem]">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}

const statusLabels: Record<Product["publicationStatus"], string> = {
  draft: "Rascunho",
  preview: "Prévia",
  published: "Publicado",
};

const statusStyles: Record<Product["publicationStatus"], string> = {
  draft: "bg-surface-raised text-ink-muted",
  preview: "bg-warning-soft text-warning",
  published: "bg-positive-soft text-positive",
};

export function StatusPill({
  status,
}: {
  status: Product["publicationStatus"];
}) {
  return (
    <span
      className={`inline-flex h-6 flex-none items-center rounded px-2 text-xs font-medium whitespace-nowrap ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}

export function Pill({
  tone,
  children,
}: {
  tone: "positive" | "warning" | "neutral" | "negative";
  children: React.ReactNode;
}) {
  const styles = {
    positive: "bg-positive-soft text-positive",
    warning: "bg-warning-soft text-warning",
    neutral: "bg-surface-raised text-ink-muted",
    negative: "bg-negative-soft text-negative",
  };
  return (
    <span
      className={`inline-flex h-6 flex-none items-center rounded px-2 text-xs font-medium whitespace-nowrap ${styles[tone]}`}
    >
      {children}
    </span>
  );
}

/** Foto miniatura (fotos vêm do site ou do servidor de imagens). */
export function Thumb({
  src,
  alt = "",
  size = 40,
}: {
  src?: string;
  alt?: string;
  size?: number;
}) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element -- miniaturas de várias origens no backoffice
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      className="bg-placeholder flex-none rounded-md object-cover"
      style={{ width: size, height: size }}
    />
  ) : (
    <span
      aria-hidden
      className="bg-placeholder block flex-none rounded-md"
      style={{ width: size, height: size }}
    />
  );
}

/** Bloco de erro dentro da área que falhou. */
export function ErrorNote({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="alert"
      className="bg-negative-soft text-negative rounded-md px-3 py-2 text-sm"
    >
      {children}
    </p>
  );
}

/** Lista carregando: o mesmo desenho, com barras no lugar dos dados. */
export function ListSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div aria-busy className="grid gap-2">
      <div className="bg-rule mb-2 h-9 w-72 max-w-full rounded-md" />
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="bg-rule h-14 rounded-md" />
      ))}
    </div>
  );
}
