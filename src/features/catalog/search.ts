import type { Product } from "@/types/product";

import { categories, productCategories } from "./categories";

/** Minúsculas e sem acento, para "loção" achar "locao" e vice-versa. */
export function normalize(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function haystack(product: Product): { strong: string; weak: string } {
  const category = productCategories(product)
    .map((slug) => categories.find((c) => c.slug === slug)?.label ?? "")
    .join(" ");
  return {
    strong: normalize(
      [product.brand, product.name, product.subtitle, category].join(" "),
    ),
    weak: normalize(
      [
        product.description,
        product.indication,
        ...(product.benefits ?? []),
      ].join(" "),
    ),
  };
}

/**
 * Busca simples para um catálogo pequeno: todas as palavras digitadas
 * precisam aparecer no produto. Marca, nome e categoria pesam mais que a
 * descrição na ordem dos resultados.
 */
export function searchProducts(products: Product[], query: string): Product[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  return products
    .map((product) => {
      const { strong, weak } = haystack(product);
      let score = 0;
      for (const term of terms) {
        if (strong.includes(term)) score += 3;
        else if (weak.includes(term)) score += 1;
        else return null;
      }
      return { product, score };
    })
    .filter((r): r is { product: Product; score: number } => r !== null)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.product);
}
