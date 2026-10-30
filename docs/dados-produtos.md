# Dados dos produtos

## Inventário

21 produtos e 25 unidades, levantados em 30/10/2026. Os nomes foram transcritos dos rótulos nas fotos
de identificação em `product_photos/original/` (cada arquivo tem o slug do produto). Essas fotos são
pessoais, ficam fora do git e **não são usadas no site**. Tamanho com "—" significa que não estava
legível na foto e precisa ser conferido no verso ou no fundo da embalagem.

| ID  | Marca               | Produto                                        | Tamanho           | Qtd. | Categoria | Origem da marca | Verificado | Preço | Foto final |
| --- | ------------------- | ---------------------------------------------- | ----------------- | ---- | --------- | --------------- | ---------- | ----- | ---------- |
| 001 | THERATIS TERA       | Premium EX Night Moist Treatment               | —                 | 1    | cabelos   | Japão           | ☐          | ☐     | ☐          |
| 002 | THERATIS TERA       | Premium EX Night Moist Treatment (refil)       | —                 | 1    | cabelos   | Japão           | ☐          | ☐     | ☐          |
| 003 | &honey              | Rich Luxe Repair Shampoo                       | —                 | 1    | cabelos   | Japão           | ☐          | ☐     | ☐          |
| 004 | &honey              | Rich Luxe Repair Shampoo (refil)               | —                 | 1    | cabelos   | Japão           | ☐          | ☐     | ☐          |
| 005 | NARTH               | Moist Shampoo (refil)                          | —                 | 1    | cabelos   | Japão           | ☐          | ☐     | ☐          |
| 006 | TSUBAKI             | Premium Volume & Repair Condicionador (refil)  | —                 | 1    | cabelos   | Japão           | ☐          | ☐     | ☐          |
| 007 | fino                | Premium Touch Hair Mask                        | —                 | 3    | cabelos   | Japão           | ☐          | ☐     | ☐          |
| 008 | TSUBAKI             | Premium Moist & Repair (kit shampoo + cond.)   | —                 | 1    | kits      | Japão           | ☐          | ☐     | ☐          |
| 009 | IHADA               | Emulsão Medicinal Shittori                     | —                 | 1    | skincare  | Japão           | ☐          | ☐     | ☐          |
| 010 | IHADA               | Loção Medicinal Totemo Shittori (refil)        | —                 | 1    | skincare  | Japão           | ☐          | ☐     | ☐          |
| 011 | SANA Nameraka Honpo | Loção de Isoflavona de Soja Sappari            | —                 | 1    | skincare  | Japão           | ☐          | ☐     | ☐          |
| 012 | anciente            | Sérum Vitamin C Derivatives × Glutathione      | 55 ml             | 1    | skincare  | Japão           | ☐          | ☐     | ☐          |
| 013 | SECRET SCIENCE+     | White Deep Serum                               | 55 ml             | 1    | skincare  | a confirmar     | ☐          | ☐     | ☐          |
| 014 | VARI:HOPE           | 8 Days Pure Vitamin C Cream                    | —                 | 1    | skincare  | Coreia          | ☐          | ☐     | ☐          |
| 015 | medicube            | Zero Pore Pad 2.0                              | 155 g (70 discos) | 1    | skincare  | Coreia          | ☐          | ☐     | ☐          |
| 016 | Deve                | Deep Cleans Cleansing Oil                      | 180 ml            | 1    | skincare  | Japão           | ☐          | ☐     | ☐          |
| 017 | SHESOME             | Collagen Essence Mask Sheet                    | 25 ml             | 3    | skincare  | Coreia          | ☐          | ☐     | ☐          |
| 018 | SHESOME             | Hyaluronic Acid with Peach Essence Mask Sheet  | 25 ml             | 3    | skincare  | Coreia          | ☐          | ☐     | ☐          |
| 019 | LOVE MAKER          | Mascara Volume, Natural Black (à prova d'água) | —                 | 1    | maquiagem | Japão           | ☐          | ☐     | ☐          |
| 020 | Glint by VDIVOV     | Lipcerin                                       | 15 ml             | 1    | maquiagem | Coreia          | ☐          | ☐     | ☐          |
| 021 | twinkle pop         | Glitter Layering Eye Palette (cor a conferir)  | 4,6 g             | 1    | maquiagem | Coreia          | ☐          | ☐     | ☐          |

### Observações

- **Fora do site:** DHC Vitamina B-Mix (2 unidades). É suplemento alimentar, não cosmético, e segue outra
  regra da Anvisa. Decisão do dono em 30/10/2026.
- **Cinco marcas são coreanas**, mesmo tendo sido compradas no Japão. O texto do site deve dizer
  "trazidos do Japão", nunca "cosméticos japoneses" para tudo.
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

## Manifesto de imagens

Toda imagem usada no site precisa de uma linha aqui.

| Produto               | Arquivo                                         | Origem                                                                         | Detentor dos direitos                   | Permissão                | Crédito exigido                               | Aprovada        |
| --------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------ | --------------------------------------- | ------------------------ | --------------------------------------------- | --------------- |
| (editorial, abertura) | `public/editorial/goyo-mulher-se-maquiando.jpg` | [The Met, obj. 908751](https://www.metmuseum.org/art/collection/search/908751) | Domínio público (Hashiguchi Goyō, 1918) | CC0 (Open Access do Met) | Não exigido; creditado na legenda e no rodapé | Aguardando o dono |

**Padrão recomendado: fotos próprias** dos produtos (fundo neutro, luz natural, mesmo enquadramento
para todos, proporção 4:5). O detentor dos direitos é o dono, a foto mostra o item real que o cliente
vai receber, e o visual fica consistente.

Imagens de fabricantes só com permissão explícita de uso comercial. Imagem pública não é imagem
liberada. Nunca fazer hotlink de URL de terceiros.
