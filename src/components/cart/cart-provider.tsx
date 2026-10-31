"use client";

import { createContext, useContext, useEffect, useMemo } from "react";

import { resolveCart, type ResolvedCart } from "@/features/cart/cart";
import { useCart } from "@/features/cart/store";
import type { Product } from "@/types/product";

import { CartDrawer } from "./cart-drawer";

const CatalogContext = createContext<Product[]>([]);
const SearchCatalogContext = createContext<Product[]>([]);

/** Disponibiliza o catálogo para a sacola e monta o drawer. */
export function CartProvider({
  catalog,
  searchCatalog,
  children,
}: {
  catalog: Product[];
  /** Só os produtos visíveis (sem os de exemplo de /dev). */
  searchCatalog: Product[];
  children: React.ReactNode;
}) {
  useEffect(() => {
    void useCart.persist.rehydrate();
  }, []);

  return (
    <CatalogContext.Provider value={catalog}>
      <SearchCatalogContext.Provider value={searchCatalog}>
        {children}
        <CartDrawer />
      </SearchCatalogContext.Provider>
    </CatalogContext.Provider>
  );
}

export function useSearchCatalog() {
  return useContext(SearchCatalogContext);
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
