"use client";

import { createContext, useContext, useEffect, useMemo } from "react";

import { resolveCart, type ResolvedCart } from "@/features/cart/cart";
import { useCart } from "@/features/cart/store";
import type { Product } from "@/types/product";

import { CartDrawer } from "./cart-drawer";

const CatalogContext = createContext<Product[]>([]);

/** Disponibiliza o catálogo para a sacola e monta o drawer. */
export function CartProvider({
  catalog,
  children,
}: {
  catalog: Product[];
  children: React.ReactNode;
}) {
  useEffect(() => {
    void useCart.persist.rehydrate();
  }, []);

  return (
    <CatalogContext.Provider value={catalog}>
      {children}
      <CartDrawer />
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  return useContext(CatalogContext);
}

/** A sacola salva, revalidada contra o catálogo atual. */
export function useResolvedCart(): ResolvedCart {
  const items = useCart((s) => s.items);
  const catalog = useCatalog();
  return useMemo(() => resolveCart(items, catalog), [items, catalog]);
}
