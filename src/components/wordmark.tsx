import { siteConfig } from "@/config/site";

/** Nome da marca com a assinatura "Selected Goods" embaixo. */
export function Wordmark({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <span className="inline-block leading-none">
      <span
        className={`font-display block font-medium tracking-[0.14em] ${
          size === "lg" ? "text-[2.5rem]" : "text-[1.625rem] lg:text-[1.875rem]"
        }`}
      >
        {siteConfig.name}
      </span>
      <span
        className={`text-ink-muted mt-1 block font-light tracking-[0.4em] uppercase ${
          size === "lg"
            ? "text-[0.75rem]"
            : "text-[0.5625rem] lg:text-[0.625rem]"
        }`}
      >
        {siteConfig.tagline}
      </span>
    </span>
  );
}
