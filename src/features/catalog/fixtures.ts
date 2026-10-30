import type { Product } from "@/types/product";

/**
 * Produtos de exemplo para testes e para a página de estados (/dev/estados).
 * Não são produtos reais e nunca entram no catálogo.
 */
export const fixtureProduct: Product = {
  id: "fixture-001",
  slug: "produto-de-exemplo",
  sku: "FIX-001",
  brand: "Marca de exemplo",
  name: "Produto de exemplo",
  category: "skincare",
  images: [],
  priceCents: 8990,
  inventoryQuantity: 1,
  availableQuantity: 1,
  contentVerified: true,
  publicationStatus: "published",
  purchaseEnabled: true,
  featured: false,
};

export const fixtureStates: { label: string; product: Product }[] = [
  { label: "À venda", product: fixtureProduct },
  {
    label: "À venda, nome longo e variante",
    product: {
      ...fixtureProduct,
      id: "fixture-002",
      slug: "produto-de-exemplo-nome-longo",
      name: "Produto de exemplo com um nome bem mais comprido que o normal",
      subtitle: "Refil",
      volume: "400 ml",
      priceCents: 12950,
    },
  },
  {
    label: "Preço em definição",
    product: {
      ...fixtureProduct,
      id: "fixture-003",
      slug: "produto-de-exemplo-sem-preco",
      priceCents: null,
    },
  },
  {
    label: "Em prévia (sem compra)",
    product: {
      ...fixtureProduct,
      id: "fixture-004",
      slug: "produto-de-exemplo-previa",
      publicationStatus: "preview",
    },
  },
];
