import type { Product } from "@/types/product";

/**
 * Inventário trazido do Japão (30/10/2026): marcas japonesas e coreanas.
 * Nomes transcritos dos rótulos nas fotos de identificação em
 * `product_photos/original/` (arquivo = slug; NÃO são fotos do site). Tudo começa como
 * `draft` e sem preço; ver docs/dados-produtos.md para o checklist de cada item.
 * Volume só preenchido quando estava legível na foto.
 */
const base = {
  images: [],
  priceCents: null,
  inventoryQuantity: 1,
  availableQuantity: 1,
  contentVerified: false,
  publicationStatus: "draft",
  purchaseEnabled: false,
  featured: false,
} satisfies Partial<Product>;

export const products: Product[] = [
  // Cabelos
  {
    ...base,
    id: "001",
    slug: "theratis-tera-premium-ex-night-moist-treatment",
    sku: "THE-TERA-TRT",
    brand: "THERATIS TERA",
    name: "Premium EX Night Moist Treatment",
    category: "cabelos",
  },
  {
    ...base,
    id: "002",
    slug: "theratis-tera-premium-ex-night-moist-treatment-refil",
    sku: "THE-TERA-TRT-RF",
    brand: "THERATIS TERA",
    name: "Premium EX Night Moist Treatment",
    subtitle: "Refil",
    category: "cabelos",
  },
  {
    ...base,
    id: "003",
    slug: "andhoney-rich-luxe-repair-shampoo",
    sku: "AHN-RICH-SHP",
    brand: "&honey",
    name: "Rich Luxe Repair Shampoo",
    category: "cabelos",
  },
  {
    ...base,
    id: "004",
    slug: "andhoney-rich-luxe-repair-shampoo-refil",
    sku: "AHN-RICH-SHP-RF",
    brand: "&honey",
    name: "Rich Luxe Repair Shampoo",
    subtitle: "Refil",
    category: "cabelos",
  },
  {
    ...base,
    id: "005",
    slug: "narth-moist-shampoo-refil",
    sku: "NAR-MST-SHP-RF",
    brand: "NARTH",
    name: "Moist Shampoo",
    subtitle: "Refil",
    category: "cabelos",
  },
  {
    ...base,
    id: "006",
    slug: "tsubaki-premium-volume-repair-condicionador-refil",
    sku: "TSU-VOL-CND-RF",
    brand: "TSUBAKI",
    name: "Premium Volume & Repair Condicionador",
    subtitle: "Refil",
    category: "cabelos",
    // Conteúdo, preço e foto enviados pelo dono em 30/10/2026.
    images: [
      {
        src: "/produtos/tsubaki-premium-volume-repair-condicionador-refil.jpg",
        alt: "Refil dourado do condicionador TSUBAKI Premium Volume & Repair",
        width: 1086,
        height: 1448,
      },
    ],
    priceCents: 9990,
    description:
      "Condicionador japonês da Shiseido, desenvolvido para cuidar dos cabelos danificados, proporcionando maciez, brilho e movimento sem deixar os fios pesados.",
    indication:
      "Ideal para cabelos finos, sem volume, ressecados ou danificados que precisam de reparação e leveza.",
    benefits: [
      "Reparação: ajuda a melhorar a aparência dos fios danificados.",
      "Volume e movimento: proporciona um acabamento leve, sem pesar.",
      "Hidratação: deixa os cabelos mais macios e fáceis de desembaraçar.",
      "Brilho: ajuda a reduzir o aspecto opaco e melhorar a aparência dos fios.",
    ],
    usageInstructions:
      "Após o shampoo, aplicar no comprimento e nas pontas, deixar agir por alguns instantes e enxaguar bem.",
    countryOfOrigin: "Japão",
    note: "Produto original, comprado pessoalmente no Japão!",
    contentVerified: true,
    publicationStatus: "published",
  },
  {
    ...base,
    id: "007",
    slug: "fino-premium-touch-hair-mask",
    sku: "FIN-PT-MASK",
    brand: "fino",
    name: "Premium Touch Máscara Capilar",
    category: "cabelos",
    inventoryQuantity: 3,
    availableQuantity: 3,
    volume: "230 g",
    // Conteúdo, preço e foto enviados pelo dono em 30/10/2026.
    images: [
      {
        src: "/produtos/fino-premium-touch-hair-mask.jpg",
        alt: "Pote da máscara capilar fino Premium Touch, com tampa vermelha",
        width: 1086,
        height: 1448,
      },
    ],
    priceCents: 20000,
    description:
      "Uma das máscaras capilares japonesas mais famosas, da Shiseido.",
    indication:
      "Ideal para cabelos ressecados, danificados, com frizz ou que precisam de mais nutrição e brilho.",
    benefits: [
      "Ajuda a recuperar a maciez dos fios.",
      "Reduz a aparência de ressecamento e frizz.",
      "Deixa o cabelo mais sedoso, brilhante e alinhado.",
      "Facilita o desembaraço.",
    ],
    usageInstructions:
      "Após lavar o cabelo com shampoo, aplique no comprimento e nas pontas, evitando a raiz. Espalhe bem e enxágue. Recomendo usar de 1 a 2 vezes por semana.",
    countryOfOrigin: "Japão",
    note: "Produto original, comprado diretamente no Japão!",
    contentVerified: true,
    publicationStatus: "published",
  },

  // Kits
  {
    ...base,
    id: "008",
    slug: "tsubaki-premium-moist-repair-kit-shampoo-condicionador",
    sku: "TSU-MST-KIT",
    brand: "TSUBAKI",
    name: "Premium Moist & Repair",
    subtitle: "Kit shampoo e condicionador",
    category: "kits",
  },

  // Skincare
  {
    ...base,
    id: "009",
    slug: "ihada-emulsao-medicinal-shittori",
    sku: "IHA-EMU-SHI",
    brand: "IHADA",
    name: "Emulsion Hidratante Facial",
    category: "skincare",
    volume: "135 ml",
    // Conteúdo, preço e foto enviados pelo dono em 30/10/2026.
    images: [
      {
        src: "/produtos/ihada-emulsao-medicinal-shittori.jpg",
        alt: "Caixa e frasco IHADA, da Shiseido",
        width: 1312,
        height: 1199,
      },
    ],
    priceCents: 13000,
    description:
      "Emulsão hidratante japonesa da Shiseido, desenvolvida para nutrir, suavizar e ajudar a proteger a pele contra o ressecamento.",
    indication:
      "Ideal para peles secas, sensíveis ou desidratadas que precisam de hidratação prolongada e proteção da barreira cutânea.",
    benefits: [
      "Hidratação prolongada: ajuda a manter a pele hidratada por mais tempo.",
      "Proteção da barreira cutânea: auxilia na redução da perda de umidade.",
      "Maciez e conforto: suaviza a sensação de ressecamento e repuxamento.",
      "Textura leitosa: espalha facilmente e ajuda a deixar a pele macia, sem a textura de um creme muito espesso.",
    ],
    usageInstructions:
      "Aplicar no rosto após a limpeza e a loção hidratante. Pode ser utilizada de manhã e à noite.",
    highlight:
      "A Lotion proporciona hidratação aquosa, enquanto a Emulsion ajuda a manter essa hidratação na pele. Os dois produtos podem ser utilizados juntos!",
    countryOfOrigin: "Japão",
    note: "Produto original, comprado pessoalmente no Japão!",
    contentVerified: true,
    publicationStatus: "published",
  },
  {
    ...base,
    id: "010",
    slug: "ihada-locao-medicinal-totemo-shittori-refil",
    sku: "IHA-LOC-TSH-RF",
    brand: "IHADA",
    name: "Loção Medicinal Totemo Shittori",
    subtitle: "Refil",
    category: "skincare",
  },
  {
    ...base,
    id: "011",
    slug: "sana-nameraka-honpo-locao-isoflavona-sappari",
    sku: "SAN-NAM-LOC-SAP",
    brand: "SANA Nameraka Honpo",
    name: "Loção Hidratante Facial",
    category: "skincare",
    // Conteúdo, preço e foto enviados pelo dono em 30/10/2026.
    images: [
      {
        src: "/produtos/sana-nameraka-honpo-locao-isoflavona-sappari.jpg",
        alt: "Frasco da loção hidratante SANA Nameraka Honpo com grãos de soja ao lado",
        width: 1086,
        height: 1448,
      },
    ],
    priceCents: 8000,
    description:
      "Um hidratante japonês com textura leve e aquosa, formulado com derivados de soja e isoflavonas.",
    indication:
      "Ideal para peles mistas e oleosas que precisam de hidratação sem aquela sensação pesada ou grudenta.",
    benefits: [
      "Proporciona hidratação leve.",
      "Ajuda a prevenir o ressecamento.",
      "Deixa a pele mais macia e viçosa.",
      "Possui textura aquosa e de rápida absorção.",
      "Ótimo para complementar a rotina de skincare.",
    ],
    usageInstructions:
      "Aplicar uma pequena quantidade no rosto limpo, com as mãos ou algodão, pela manhã e à noite. Pode ser utilizado antes de um hidratante mais cremoso, se necessário.",
    countryOfOrigin: "Japão",
    note: "Produto original, comprado diretamente no Japão!",
    contentVerified: true,
    publicationStatus: "published",
  },
  {
    ...base,
    id: "012",
    slug: "anciente-serum-vitamina-c-glutationa",
    sku: "ANC-VC-GLU",
    brand: "anciente",
    name: "Sérum Vitamin C Derivatives × Glutathione",
    category: "skincare",
    volume: "55 ml",
  },
  {
    ...base,
    id: "013",
    slug: "secret-science-white-deep-serum",
    sku: "SSC-WDS",
    brand: "SECRET SCIENCE+",
    name: "White Deep Serum",
    category: "skincare",
    volume: "55 ml",
    // Conteúdo, preço e foto enviados pelo dono em 30/10/2026.
    images: [
      {
        src: "/produtos/secret-science-white-deep-serum.jpg",
        alt: "Frasco e caixa do sérum SECRET SCIENCE+ White Deep Serum, 55 ml",
        width: 1312,
        height: 1199,
      },
    ],
    priceCents: 12000,
    description:
      "Sérum facial japonês que combina diversos ativos para melhorar a textura, luminosidade e aparência da pele.",
    indication:
      "Ideal para quem deseja suavizar a aparência de manchas, linhas finas, poros aparentes e tom irregular.",
    benefits: [
      "Retinol: auxilia na renovação da pele e na suavização de linhas finas.",
      "Niacinamida: ajuda a uniformizar o tom e equilibrar a oleosidade.",
      "Vitamina C e glutationa: ação antioxidante e mais luminosidade.",
      "PDRN e peptídeos: complementam os cuidados com a aparência e hidratação da pele.",
      "Colágeno: contribui para a maciez e hidratação.",
    ],
    usageInstructions:
      "Aplicar uma pequena quantidade no rosto limpo, antes do hidratante. Começar utilizando à noite, 2 vezes por semana, aumentando gradualmente conforme a tolerância da pele.",
    precautions: [
      "Utilizar protetor solar diariamente.",
      "Evitar combinar com ácidos esfoliantes na mesma noite.",
      "Não utilizar durante a gravidez.",
    ],
    countryOfOrigin: "Japão",
    note: "Produto original, comprado pessoalmente no Japão!",
    contentVerified: true,
    publicationStatus: "published",
  },
  {
    ...base,
    id: "014",
    slug: "varihope-8-days-pure-vitamin-c-cream",
    sku: "VHO-8D-VC",
    brand: "VARI:HOPE",
    name: "8 Days Pure Vitamin C Creme Facial",
    category: "skincare",
    // Conteúdo, preço e foto enviados pelo dono em 30/10/2026.
    images: [
      {
        src: "/produtos/varihope-8-days-pure-vitamin-c-cream.jpg",
        alt: "Frasco e caixa do creme VARI:HOPE 8 Days Pure Vitamin C",
        width: 1312,
        height: 1199,
      },
    ],
    priceCents: 16000,
    description:
      "Um creme coreano com vitamina C, desenvolvido para ajudar a deixar a pele mais iluminada, uniforme e com aparência saudável.",
    indication:
      "Ideal para quem deseja melhorar a aparência de manchas, marcas de acne, tom irregular e primeiros sinais de envelhecimento.",
    benefits: [
      "Ajuda a uniformizar o tom da pele.",
      "Melhora gradualmente a aparência de manchas.",
      "Proporciona mais luminosidade e viço.",
      "Possui ação antioxidante.",
      "Ajuda a hidratar e suavizar a aparência de linhas finas.",
    ],
    usageInstructions:
      "Aplicar uma pequena quantidade no rosto limpo, após os produtos mais líquidos da rotina. Começar em dias alternados e aumentar a frequência conforme a tolerância da pele. Pode ser utilizado de manhã ou à noite. Durante o dia, é essencial usar protetor solar.",
    countryOfOrigin: "Coreia do Sul",
    note: "Produto original, comprado pessoalmente durante nossa viagem ao Japão!",
    contentVerified: true,
    publicationStatus: "published",
  },
  {
    ...base,
    id: "015",
    slug: "medicube-zero-pore-pad-2-0",
    sku: "MDC-ZPP-20",
    brand: "medicube",
    name: "Zero Pore Pad 2.0",
    category: "skincare",
    volume: "155 g (70 discos)",
    // Conteúdo, preço e foto enviados pelo dono em 30/10/2026.
    images: [
      {
        src: "/produtos/medicube-zero-pore-pad-2-0.jpg",
        alt: "Pote e caixa do medicube Zero Pore Pad 2.0, com discos ao lado",
        width: 1312,
        height: 1199,
      },
    ],
    priceCents: 25000,
    description:
      "Um dos produtos coreanos mais conhecidos para cuidar dos poros e melhorar a textura da pele.",
    indication:
      "Ideal para peles mistas e oleosas, especialmente para quem tem cravinhos, poros obstruídos, oleosidade excessiva ou textura irregular.",
    benefits: [
      "Ajuda a desobstruir os poros.",
      "Reduz cravinhos e acúmulo de células mortas.",
      "Auxilia no controle da oleosidade.",
      "Melhora a aparência dos poros dilatados.",
      "Deixa a pele mais lisinha e uniforme.",
    ],
    usageInstructions:
      "Após limpar o rosto, passar suavemente um disco pela pele, evitando a região dos olhos. Recomendo começar usando 2 vezes por semana, preferencialmente à noite. Se a pele se adaptar bem, pode aumentar para 3 vezes por semana.\n\nDepois, aplicar um hidratante facial. Durante o dia, usar protetor solar!",
    countryOfOrigin: "Coreia do Sul",
    note: "Produto original, comprado pessoalmente no Japão!",
    contentVerified: true,
    publicationStatus: "published",
  },
  {
    ...base,
    id: "016",
    slug: "deve-deep-cleans-cleansing-oil",
    sku: "DEV-DC-OIL",
    brand: "Deve",
    name: "Deep Cleans Cleansing Oil",
    category: "skincare",
    volume: "180 ml",
  },
  {
    ...base,
    id: "017",
    slug: "shesome-collagen-essence-mask-sheet",
    sku: "SHE-COL-MSK",
    brand: "SHESOME",
    name: "Collagen Essence Mask Sheet",
    category: "skincare",
    volume: "25 ml",
    inventoryQuantity: 3,
    availableQuantity: 3,
  },
  {
    ...base,
    id: "018",
    slug: "shesome-hyaluronic-peach-essence-mask-sheet",
    sku: "SHE-HYA-MSK",
    brand: "SHESOME",
    name: "Hyaluronic Acid with Peach Essence Mask Sheet",
    category: "skincare",
    volume: "25 ml",
    inventoryQuantity: 3,
    availableQuantity: 3,
  },

  // Maquiagem
  {
    ...base,
    id: "019",
    slug: "love-maker-mascara-volume-natural-black",
    sku: "LMK-MSC-VOL-BK",
    brand: "LOVE MAKER",
    name: "Mascara Volume",
    subtitle: "Natural Black, à prova d'água",
    category: "maquiagem",
  },
  {
    ...base,
    id: "020",
    slug: "glint-lipcerin",
    sku: "GLI-LIPCERIN",
    brand: "Glint by VDIVOV",
    name: "Lipcerin",
    category: "maquiagem",
    volume: "15 ml",
  },
  {
    ...base,
    id: "021",
    slug: "twinkle-pop-glitter-layering-eye-palette",
    sku: "TWP-GLT-PAL",
    brand: "twinkle pop",
    name: "Glitter Layering Eye Palette",
    category: "maquiagem",
    volume: "4,6 g",
  },

  // Cabelos (cadastrado depois do inventário inicial, a pedido do dono)
  {
    ...base,
    id: "022",
    slug: "diane-lotus-shine-spray-oil",
    sku: "DIA-LOT-SPR",
    brand: "Diane",
    name: "Lotus Shine Spray Oil Óleo Capilar",
    category: "cabelos",
    volume: "80 g",
    // Conteúdo, preço e foto enviados pelo dono em 30/10/2026.
    images: [
      {
        src: "/produtos/diane-lotus-shine-spray-oil.jpg",
        alt: "Spray de óleo capilar Diane Lotus, lilás, 80 g",
        width: 1312,
        height: 1199,
      },
    ],
    priceCents: 10990,
    description:
      "Óleo capilar japonês em spray, desenvolvido para proporcionar brilho, maciez e um acabamento bonito aos cabelos, sem precisar aplicar o produto diretamente com as mãos.",
    indication:
      "Ideal para cabelos opacos, ressecados, com frizz ou que precisam de mais brilho e suavidade.",
    benefits: [
      "Brilho: proporciona um acabamento luminoso e saudável aos fios.",
      "Controle do frizz: ajuda a alinhar os fios arrepiados.",
      "Maciez: deixa o cabelo mais sedoso e agradável ao toque.",
      "Aplicação prática: formato em spray que facilita a distribuição do óleo.",
      "Acabamento: ajuda a melhorar a aparência das pontas ressecadas.",
    ],
    usageInstructions:
      "Borrifar uma pequena quantidade no comprimento e nas pontas dos cabelos secos, mantendo distância dos fios. Espalhar suavemente, se necessário. Evitar a raiz e ajustar a quantidade conforme o tipo de cabelo.",
    highlight:
      "Ideal para finalizar o penteado e dar aquele toque extra de brilho e maciez!",
    countryOfOrigin: "Japão",
    note: "Produto original, comprado pessoalmente durante nossa viagem ao Japão!",
    contentVerified: true,
    publicationStatus: "published",
  },
];
