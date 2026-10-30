import type { Product, ProductCategory, ProductImage } from "@/types/product";

/**
 * Fotos ILUSTRATIVAS por categoria (StockSnap, CC0), usadas só enquanto o
 * produto não tem foto própria. Não mostram o produto vendido: a UI sempre
 * marca "Foto ilustrativa". Para trocar pela foto real, basta preencher
 * `images` do produto em `src/data/products.ts` (ver docs/dados-produtos.md).
 */
const landscape = { width: 960, height: 640 };

export const exampleImages: Record<ProductCategory, ProductImage[]> = {
  cabelos: [
    { src: "/exemplos/cabelos-2.png", alt: "Cabelo com bobes", ...landscape },
    {
      src: "/exemplos/cabelos-3.png",
      alt: "Tesoura e pente de cabeleireiro",
      width: 960,
      height: 894,
    },
    {
      src: "/exemplos/cabelos-1.png",
      alt: "Toalhas brancas dobradas",
      ...landscape,
    },
  ],
  skincare: [
    {
      src: "/exemplos/skincare-1.png",
      alt: "Frasco de óleo com flores de calêndula",
      ...landscape,
    },
    {
      src: "/exemplos/skincare-2.png",
      alt: "Mulher aplicando sérum com conta-gotas",
      ...landscape,
    },
    {
      src: "/exemplos/skincare-3.png",
      alt: "Mulher segurando um conta-gotas de sérum",
      ...landscape,
    },
  ],
  maquiagem: [
    {
      src: "/exemplos/maquiagem-1.png",
      alt: "Batons, pincéis e paleta de sombras",
      ...landscape,
    },
    {
      src: "/exemplos/maquiagem-2.png",
      alt: "Paletas de sombras",
      ...landscape,
    },
    {
      src: "/exemplos/maquiagem-3.png",
      alt: "Paleta de sombras coloridas",
      ...landscape,
    },
  ],
  kits: [
    {
      src: "/exemplos/kits-1.png",
      alt: "Pedras, orquídeas e sais de banho",
      width: 668,
      height: 1000,
    },
    {
      src: "/exemplos/kits-2.png",
      alt: "Sabonete, orquídea e pedras",
      width: 668,
      height: 1000,
    },
  ],
};

export type DisplayImage = ProductImage & { illustrative: boolean };

/** A foto do produto, ou uma ilustrativa da categoria quando ainda não há. */
export function displayImage(product: Product): DisplayImage {
  const own = product.images[0];
  if (own) return { ...own, illustrative: false };
  const options = exampleImages[product.category];
  // Alterna entre as opções de forma estável, para a grade não repetir tudo.
  const seed = [...product.id].reduce((sum, c) => sum + c.charCodeAt(0), 0);
  return { ...options[seed % options.length], illustrative: true };
}
