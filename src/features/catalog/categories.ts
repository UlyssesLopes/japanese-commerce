import type { ProductCategory } from "@/types/product";

/** Ordem e nomes das categorias como aparecem no site. */
export const categories: { slug: ProductCategory; label: string }[] = [
  { slug: "cabelos", label: "Cabelos" },
  { slug: "skincare", label: "Skincare" },
  { slug: "maquiagem", label: "Maquiagem" },
  { slug: "kits", label: "Kits" },
];
