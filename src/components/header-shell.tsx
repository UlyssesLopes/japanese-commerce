"use client";

import { useEffect, useState } from "react";

/**
 * Cabeçalho fixo: compacta e ganha fundo ao rolar, some ao descer e volta
 * ao subir. Com "reduzir movimento" só fica fixo, sem esconder.
 */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      // Pequena folga para não piscar com rolagens mínimas.
      if (!reduce.matches && Math.abs(y - last) > 6) {
        setHidden(y > last && y > 160);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled || undefined}
      className={`group/header bg-surface sticky top-0 z-30 transition-[translate,box-shadow] duration-300 ease-out data-[scrolled]:shadow-[0_1px_0_var(--placeholder)] ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {children}
    </header>
  );
}
