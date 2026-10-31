"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { AppliedCoupon } from "@/types/coupon";

import type { CartItem } from "./cart";

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  add: (slug: string, max: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  /** Mantém só os itens que ainda existem (após revalidar no catálogo). */
  keep: (slugs: string[]) => void;
  coupon: AppliedCoupon | null;
  setCoupon: (coupon: AppliedCoupon | null) => void;
  open: () => void;
  close: () => void;
};

/**
 * Sacola salva no localStorage. Guarda só slug e quantidade; preço e
 * disponibilidade vêm sempre do catálogo (ver `resolveCart`).
 * `skipHydration`: o `CartProvider` reidrata depois de montar, para o HTML
 * do servidor e o do navegador baterem.
 */
export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      add: (slug, max) =>
        set((s) => {
          const current = s.items.find((i) => i.slug === slug);
          if (!current)
            return { items: [...s.items, { slug, quantity: 1 }], isOpen: true };
          return {
            items: s.items.map((i) =>
              i.slug === slug
                ? { ...i, quantity: Math.min(i.quantity + 1, max) }
                : i,
            ),
            isOpen: true,
          };
        }),
      setQuantity: (slug, quantity) =>
        set((s) => ({
          items: s.items.map((i) => (i.slug === slug ? { ...i, quantity } : i)),
        })),
      remove: (slug) =>
        set((s) => ({ items: s.items.filter((i) => i.slug !== slug) })),
      coupon: null,
      setCoupon: (coupon) => set({ coupon }),
      keep: (slugs) =>
        set((s) => ({ items: s.items.filter((i) => slugs.includes(i.slug)) })),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: "sacola",
      version: 1,
      partialize: (s) => ({ items: s.items, coupon: s.coupon }),
      skipHydration: true,
    },
  ),
);
