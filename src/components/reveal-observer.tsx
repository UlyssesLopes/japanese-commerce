"use client";

import { useEffect } from "react";

/**
 * Faz os elementos com a classe `.reveal` entrarem na tela ao rolar.
 * Funciona em qualquer navegador (IntersectionObserver) e também observa
 * elementos que surgem depois, como os cards ao trocar o filtro.
 * Sem JavaScript, a classe `js` não é aplicada e tudo aparece parado.
 */
export function RevealObserver() {
  useEffect(() => {
    const show = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          show.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );

    const watch = (root: ParentNode) =>
      root
        .querySelectorAll(".reveal:not(.is-visible)")
        .forEach((el) => show.observe(el));

    watch(document);
    const added = new MutationObserver((mutations) => {
      for (const m of mutations)
        m.addedNodes.forEach((n) => {
          if (n instanceof Element) {
            if (n.matches(".reveal:not(.is-visible)")) show.observe(n);
            watch(n);
          }
        });
    });
    added.observe(document.body, { childList: true, subtree: true });

    return () => {
      show.disconnect();
      added.disconnect();
    };
  }, []);

  return null;
}
