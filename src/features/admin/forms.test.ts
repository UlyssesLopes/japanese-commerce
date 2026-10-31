import { describe, expect, it } from "vitest";

import {
  couponInput,
  kitInput,
  lines,
  productInput,
  settingsInput,
} from "./forms";

function form(fields: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

const product = {
  slug: "produto-teste",
  sku: "T-1",
  brand: " Marca ",
  name: "Produto",
  category: "skincare",
  price: "249,90",
  inventoryQuantity: "3",
  availableQuantity: "2",
  publicationStatus: "preview",
  benefits: "Hidrata\n\n  Suaviza  \n",
  description: "   ",
};

describe("productInput", () => {
  it("converte preço, listas e campos vazios", () => {
    const parsed = productInput(form({ ...product, featured: "on" }));
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.value).toMatchObject({
      brand: "Marca",
      priceCents: 24990,
      inventoryQuantity: 3,
      availableQuantity: 2,
      benefits: ["Hidrata", "Suaviza"],
      description: null,
      ingredients: null,
      featured: true,
      purchaseEnabled: false,
      images: [],
    });
  });

  it("preço vazio é preço em definição", () => {
    const parsed = productInput(form({ ...product, price: "" }));
    expect(parsed.ok && parsed.value.priceCents).toBeNull();
  });

  it("recusa preço e estoque inválidos", () => {
    expect(productInput(form({ ...product, price: "abc" }))).toEqual({
      ok: false,
      error: "Preço: use o formato 249,90.",
    });
    expect(
      productInput(form({ ...product, inventoryQuantity: "1,5" })).ok,
    ).toBe(false);
  });
});

describe("kitInput", () => {
  it("exige ao menos um produto", () => {
    expect(
      kitInput(form({ name: "Kit", slug: "kit", price: "", items: "[]" })),
    ).toEqual({ ok: false, error: "Adicione pelo menos um produto ao kit." });
  });

  it("leva itens com quantidade", () => {
    const parsed = kitInput(
      form({
        name: "Kit",
        slug: "kit",
        price: "399,90",
        publicationStatus: "draft",
        items: JSON.stringify([{ productId: "007", quantity: 2 }]),
      }),
    );
    expect(parsed.ok && parsed.value).toMatchObject({
      priceCents: 39990,
      items: [{ productId: "007", quantity: 2 }],
    });
  });
});

describe("couponInput", () => {
  it("percentual de 1 a 100 e código normalizado", () => {
    const parsed = couponInput(
      form({ code: " bem vinda10 ", type: "percent", value: "10" }),
    );
    expect(parsed.ok && parsed.value).toMatchObject({
      code: "BEMVINDA10",
      value: 10,
      minSubtotalCents: null,
    });
    expect(
      couponInput(form({ code: "X10", type: "percent", value: "150" })),
    ).toEqual({ ok: false, error: "Desconto percentual: de 1 a 100." });
  });

  it("valor fixo em reais vira centavos", () => {
    const parsed = couponInput(
      form({
        code: "VINTE",
        type: "fixed",
        value: "20,00",
        minSubtotal: "100",
      }),
    );
    expect(parsed.ok && parsed.value).toMatchObject({
      value: 2000,
      minSubtotalCents: 10000,
    });
  });

  it("validade não termina antes de começar", () => {
    expect(
      couponInput(
        form({
          code: "NATAL",
          type: "percent",
          value: "15",
          startsAt: "2026-12-25",
          endsAt: "2026-12-01",
        }),
      ),
    ).toEqual({ ok: false, error: "O fim da validade vem antes do início." });
  });
});

describe("lines", () => {
  it("vazio vira null", () => {
    expect(lines(" \n ")).toBeNull();
  });
});

describe("settingsInput", () => {
  it("converte taxa, frete grátis e foto", () => {
    const parsed = settingsInput(
      form({
        deliveryArea: " Porto Alegre ",
        deliveryFeePercent: "5",
        freeDeliveryFrom: "200,00",
        sellerName: "Caroline Serpa",
        sellerBio: "  ",
        images: JSON.stringify([
          { src: "/a.jpg", alt: "Caroline", width: 600, height: 800 },
          { src: "/b.jpg", alt: "Outra", width: 600, height: 800 },
        ]),
      }),
    );
    expect(parsed.ok && parsed.value).toMatchObject({
      deliveryArea: "Porto Alegre",
      deliveryFeePercent: 5,
      freeDeliveryFromCents: 20000,
      sellerBio: null,
      sellerPhoto: { src: "/a.jpg" },
    });
  });

  it("frete grátis vazio = nunca; sem foto = null", () => {
    const parsed = settingsInput(form({ deliveryFeePercent: "0" }));
    expect(parsed.ok && parsed.value).toMatchObject({
      freeDeliveryFromCents: null,
      sellerPhoto: null,
    });
  });

  it("recusa taxa fora de 0 a 100", () => {
    expect(settingsInput(form({ deliveryFeePercent: "150" }))).toEqual({
      ok: false,
      error: "Taxa de entrega: de 0 a 100%.",
    });
  });
});
