"use client";

import { useEffect } from "react";

/**
 * Faz os elementos com a classe `.reveal` entrarem na tela ao rolar.
 * Funciona em qualquer navegador (IntersectionObserver) e também observa
 * elementos que surgem depois, como os cards ao trocar o filtro.
 * Sem JavaScript, a classe `js` não é aplicada e tudo aparece parado.
 *
 * A entrada usa `element.animate()` em vez de trocar a classe: o elemento
 * pode ainda não ter sido hidratado pelo React (streaming), e uma classe a
 * mais no HTML gera aviso de hidratação.
 */
export function RevealObserver() {
  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const seen = new WeakSet<Element>();

    const reveal = (el: Element) => {
      const delay =
        parseFloat(getComputedStyle(el).getPropertyValue("--reveal-delay")) ||
        0;
      el.animate(
        [
          { opacity: 0, translate: "0 40px" },
          { opacity: 1, translate: "0 0" },
        ],
        {
          duration: reduce ? 0 : 700,
          delay: reduce ? 0 : delay,
          easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
          fill: "forwards",
        },
      );
    };

    const show = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          show.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );

    const observe = (el: Element) => {
      if (seen.has(el)) return;
      seen.add(el);
      show.observe(el);
    };
    const watch = (root: ParentNode) =>
      root.querySelectorAll(".reveal").forEach(observe);

    watch(document);
    const added = new MutationObserver((mutations) => {
      for (const m of mutations)
        m.addedNodes.forEach((n) => {
          if (n instanceof Element) {
            if (n.matches(".reveal")) observe(n);
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
