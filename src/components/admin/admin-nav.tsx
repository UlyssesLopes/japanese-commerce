"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const adminLinks = [
  { href: "/admin", label: "Visão geral" },
  { href: "/admin/produtos", label: "Produtos" },
  { href: "/admin/kits", label: "Kits" },
  { href: "/admin/cupons", label: "Cupons" },
  { href: "/admin/configuracoes", label: "Configurações" },
];

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  return href === "/admin" ? pathname === href : pathname.startsWith(href);
}

/** Links do menu; o item da tela atual ganha o fundo neutro. */
export function NavList({ pathname }: { pathname: string | null }) {
  return (
    <ul className="grid gap-0.5">
      {adminLinks.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`flex h-9 items-center rounded-md px-3 text-[0.9375rem] ${
                active
                  ? "bg-surface-raised text-ink font-medium"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function ActiveNavList() {
  return <NavList pathname={usePathname()} />;
}
