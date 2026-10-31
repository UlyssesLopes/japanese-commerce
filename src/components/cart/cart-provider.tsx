"use client";

import { createContext, useContext, useEffect, useMemo } from "react";

import { resolveCart, type ResolvedCart } from "@/features/cart/cart";
import { useCart } from "@/features/cart/store";
import type { StoreSettings } from "@/features/checkout/delivery";
import type { Product } from "@/types/product";

import { CartDrawer } from "./cart-drawer";

const CatalogContext = createContext<Product[]>([]);
const SearchCatalogContext = createContext<Product[]>([]);
const SettingsContext = createContext<StoreSettings>({ deliveryFeePercent: 0 });

/** Disponibiliza o catálogo para a sacola e monta o drawer. */
export function CartProvider({
  catalog,
  searchCatalog,
  settings,
  children,
}: {
  catalog: Product[];
  /** Só os produtos visíveis (sem os de exemplo de /dev). */
  searchCatalog: Product[];
  /** Entrega e retirada (backoffice), para a sacola calcular a taxa. */
  settings: StoreSettings;
  children: React.ReactNode;
}) {
  useEffect(() => {
    void useCart.persist.rehydrate();
  }, []);

  return (
    <CatalogContext.Provider value={catalog}>
      <SearchCatalogContext.Provider value={searchCatalog}>
        <SettingsContext.Provider value={settings}>
          {children}
          <CartDrawer />
        </SettingsContext.Provider>
      </SearchCatalogContext.Provider>
    </CatalogContext.Provider>
  );
}

export function useSearchCatalog() {
  return useContext(SearchCatalogContext);
}

export function useStoreSettings() {
  return useContext(SettingsContext);
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
