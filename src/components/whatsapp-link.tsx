import { siteConfig } from "@/config/site";

/**
 * Link para a conversa no WhatsApp, sem mostrar o número na página.
 * Sem número configurado, vira só o texto.
 */
export function WhatsAppLink({
  children = "WhatsApp",
}: {
  children?: React.ReactNode;
}) {
  const digits = siteConfig.whatsappNumber.replace(/\D/g, "");
  if (!digits) return <>{children}</>;
  return (
    <a
      href={`https://wa.me/${digits}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-brand inline-flex items-baseline gap-1 font-medium underline underline-offset-4 hover:no-underline"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-[1.05em] self-center"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Balão de conversa */}
        <path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.4L3 21l2.1-5.5A8.4 8.4 0 1 1 21 11.5Z" />
      </svg>
      {children}
    </a>
  );
}
