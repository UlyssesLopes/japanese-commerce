# Dados dos produtos

## Inventário

22 produtos e 26 unidades (21 levantados em 30/10/2026; o Diane entrou depois, enviado pelo dono, quantidade 1 a confirmar). Os nomes foram transcritos dos rótulos nas fotos
de identificação em `product_photos/original/` (cada arquivo tem o slug do produto). Essas fotos são
pessoais, ficam fora do git e **não são usadas no site**. Tamanho com "—" significa que não estava
legível na foto e precisa ser conferido no verso ou no fundo da embalagem.

| ID  | Marca               | Produto                                          | Tamanho           | Qtd. | Categoria | Origem da marca | Verificado | Preço     | Foto final |
| --- | ------------------- | ------------------------------------------------ | ----------------- | ---- | --------- | --------------- | ---------- | --------- | ---------- |
| 001 | THERATIS TERA       | Premium Night Moist Shampoo (embalagem original) | —                 | 1    | cabelos   | Japão           | ☑          | R$ 139,90 | ☑          |
| 002 | THERATIS TERA       | Premium Night Moist Shampoo (refil)              | —                 | 1    | cabelos   | Japão           | ☑          | R$ 99,90  | ☑          |
| 003 | &honey              | Rich Luxe Repair Shampoo                         | —                 | 1    | cabelos   | Japão           | ☑          | R$ 139,90 | ☑          |
| 004 | &honey              | Rich Luxe Repair Shampoo (refil)                 | 350 ml            | 1    | cabelos   | Japão           | ☑          | R$ 99,90  | ☑          |
| 005 | NARTH               | Moist Shampoo (refil)                            | —                 | 1    | cabelos   | Japão           | ☐          | ☐         | ☐          |
| 006 | TSUBAKI             | Premium Volume & Repair Condicionador (refil)    | —                 | 1    | cabelos   | Japão           | ☑          | R$ 99,90  | ☑          |
| 007 | fino                | Premium Touch Hair Mask                          | 230 g             | 3    | cabelos   | Japão           | ☑          | R$ 199,90 | ☑          |
| 008 | TSUBAKI             | Premium Moist & Repair (kit shampoo + cond.)     | —                 | 1    | kits      | Japão           | ☐          | ☐         | ☐          |
| 009 | IHADA               | Emulsion Hidratante Facial                       | 135 ml            | 1    | skincare  | Japão           | ☑          | R$ 129,90 | ☑          |
| 010 | IHADA               | Emulsion Hidratante Facial (refil)               | 135 ml            | 1    | skincare  | Japão           | ☑          | R$ 99,90  | ☑          |
| 011 | SANA Nameraka Honpo | Loção de Isoflavona de Soja Sappari              | —                 | 1    | skincare  | Japão           | ☑          | R$ 79,90  | ☑          |
| 012 | anciente            | Sérum Vitamin C Derivatives × Glutathione        | 55 ml             | 1    | skincare  | Japão           | ☐          | ☐         | ☐          |
| 013 | SECRET SCIENCE+     | White Deep Serum                                 | 55 ml             | 1    | skincare  | Japão           | ☑          | R$ 119,90 | ☑          |
| 014 | VARI:HOPE           | 8 Days Pure Vitamin C Creme Facial               | —                 | 1    | skincare  | Coreia          | ☑          | R$ 159,90 | ☑          |
| 015 | medicube            | Zero Pore Pad 2.0                                | 155 g (70 discos) | 1    | skincare  | Coreia          | ☑          | R$ 249,90 | ☑          |
| 016 | Deve                | Deep Cleans Cleansing Oil                        | 180 ml            | 1    | skincare  | Japão           | ☐          | ☐         | ☐          |
| 017 | SHESOME             | Collagen Essence Mask Sheet                      | 25 ml             | 3    | skincare  | Coreia          | ☐          | ☐         | ☐          |
| 018 | SHESOME             | Hyaluronic Acid with Peach Essence Mask Sheet    | 25 ml             | 3    | skincare  | Coreia          | ☐          | ☐         | ☐          |
| 019 | LOVE MAKER          | Mascara Volume, Natural Black (à prova d'água)   | —                 | 1    | maquiagem | Japão           | ☐          | ☐         | ☐          |
| 020 | Glint by VDIVOV     | Lipcerin                                         | 15 ml             | 1    | maquiagem | Coreia          | ☑          | R$ 69,90  | ☑          |
| 021 | twinkle pop         | Glitter Layering Eye Palette (cor a conferir)    | 4,6 g             | 1    | maquiagem | Coreia          | ☑          | R$ 54,90  | ☑          |
| 022 | Diane               | Lotus Shine Spray Oil Óleo Capilar               | 80 g              | 1    | cabelos   | Japão           | ☑          | R$ 109,90 | ☑          |

### Observações

- **Fora do site:** DHC Vitamina B-Mix (2 unidades). É suplemento alimentar, não cosmético, e segue outra
  regra da Anvisa. Decisão do dono em 30/10/2026.
- **Cinco marcas são coreanas**, mesmo tendo sido compradas no Japão. O site fala em "cosméticos japoneses
  e coreanos", nunca "cosméticos japoneses" para tudo.
- **Rótulos com promessas** (clareamento: "白玉美肌", "白を科学する"; "previne acne" no IHADA; "nº 1 em
  vendas") **não são copiados** para o site. São alegações do fabricante, não verificadas, e algumas
  seriam irregulares no Brasil.
- **IHADA 009**: a caixa está amassada. Mencionar o estado da embalagem no anúncio.
- A coluna "Origem da marca" foi preenchida por conhecimento geral sobre as marcas, não pelo rótulo.
  Conferir antes de publicar.

## Checklist para publicar um produto

Um produto só passa de `draft` → `preview` → `published` com:

- [ ] Nome exato e variante conferidos na embalagem
- [ ] Volume/peso conferido na embalagem
- [ ] Descrição escrita a partir da embalagem ou do site oficial do fabricante (sem promessas extras)
- [ ] Ingredientes e modo de uso só se transcritos de fonte oficial; senão, omitidos
- [ ] Validade conferida (e não vencida)
- [ ] Pelo menos uma foto aprovada (ver manifesto abaixo)
- [ ] `contentVerified: true`

E para entrar na sacola (`purchaseEnabled: true`), além disso:

- [ ] Preço de venda definido
- [ ] Itens de `prontidao-producao.md` resolvidos

## Como o modelo funciona

Definido em `src/types/product.ts`. Pontos importantes:

- `inventoryQuantity`: quantas unidades existem; `availableQuantity`: quantas podem ir para a sacola.
- `publicationStatus`: `draft` não aparece no site; `preview` aparece sem poder comprar; `published` pode ser comprado.
- `purchaseEnabled`: chave manual, independente do resto.
- `priceCents: null` mostra "Preço em definição".
- Campos de conteúdo (volume, ingredientes…) ficam ausentes até serem verificados.

A elegibilidade está em `src/features/catalog/eligibility.ts` e tem testes.

## Como colocar a foto real de um produto

1. Guardar o original em `product_photos/site/<slug>.jpeg` (fora do git) e copiar para
   `public/produtos/<slug>.jpg` (com `-2`, `-3`... para as fotos extras) (o slug está em `src/data/products.ts`), quadrada ou 4:5.
2. No produto, preencher `images: [{ src: "/produtos/<slug>.jpg", alt: "<o que aparece na foto>", width: <px>, height: <px> }]`.
3. Pronto: a foto ilustrativa e a etiqueta "Foto ilustrativa" somem sozinhas.
4. Marcar a coluna "Foto final" no inventário acima e registrar a foto no manifesto abaixo.

Enquanto um produto não tem foto, o site usa uma **foto ilustrativa** da categoria
(`src/features/catalog/example-images.ts`), sempre com a etiqueta "Foto ilustrativa". Ela não mostra
o produto e não substitui a foto real no checklist de publicação.

## Manifesto de imagens

Toda imagem usada no site precisa de uma linha aqui.

| Produto                        | Arquivo                                                                                    | Origem                            | Detentor dos direitos | Permissão       | Crédito exigido | Aprovada                          |
| ------------------------------ | ------------------------------------------------------------------------------------------ | --------------------------------- | --------------------- | --------------- | --------------- | --------------------------------- |
| 015 medicube Zero Pore Pad 2.0 | `public/produtos/medicube-zero-pore-pad-2-0.jpg` (original em `product_photos/site/`)      | Enviada pelo dono                 | **A confirmar**       | **A confirmar** | —               | Em uso; ver nota abaixo           |
| (todas, ilustrativas)          | `public/exemplos/*.png` (abertura, cabelos-1..3, skincare-1..3, maquiagem-1..3, kits-1..2) | [StockSnap](https://stocksnap.io) | Autores no StockSnap  | CC0             | Não exigido     | Provisório, até as fotos próprias |

**Nota sobre a foto da medicube (30/10/2026):** o texto do pote aparece embaralhado ("Dedicated to
reel reuls" em vez de "real results"), sinal de imagem gerada ou editada por IA. Pela regra 6 do
`CLAUDE.md`, confirmar a origem e o direito de uso, ou trocar por uma foto própria do produto.

**IHADA (30/10/2026):** os dois IHADA foram publicados com as fotos e o texto (Emulsion) enviados pelo dono.
As fotos mostram a linha clareadora da IHADA; as fotos de identificação mostram a Emulsion (乳液) e o
refil da Lotion (化粧水). Trocar se algum cliente estranhar a diferença.

**Padrão recomendado: fotos próprias** dos produtos (fundo neutro, luz natural, mesmo enquadramento
para todos, proporção 4:5). O detentor dos direitos é o dono, a foto mostra o item real que o cliente
vai receber, e o visual fica consistente.

Imagens de fabricantes só com permissão explícita de uso comercial. Imagem pública não é imagem
liberada. Nunca fazer hotlink de URL de terceiros.
