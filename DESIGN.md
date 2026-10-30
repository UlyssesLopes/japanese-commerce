# DESIGN.md

Fonte da verdade visual. Em conflito com qualquer skill, este arquivo vence (ver
`docs/design-ferramentas.md`). Revisado em 30/10/2026 após o feedback do dono sobre a primeira
versão.

## 1. Tema

**Uma loja online clara e direta de cosméticos japoneses e coreanos. E só isso.**

A estrutura segue o varejo que o dono gostou de usar (YesStyle, Samashipp, Panvel): fundo branco,
produto em primeiro plano, categorias à mão, preço e botão no card. Da Shino Yama fica só o toque de
tipografia (serifa nos títulos) e o marinho como cor de ação.

Não fazer:

- Contar como os produtos chegaram ("viagem", "na mala", "trazidos por nós").
- Imagem cultural decorativa: gueixa, gravura, cerejeira, bandeira.
- Faixas grandes de cor: o marinho em bloco deixou o site "pesado".
- Pop-ups, cupons, contagem regressiva, "-50%", estrelas, "fulana acabou de comprar", bolha fixa de
  WhatsApp.
- Chamar tudo de "japonês": há marcas coreanas.

## 2. Cor

Uma base clara, uma tinta escura, o marinho só na ação. Tokens em `src/app/globals.css`.

| Token            | Valor     | Uso                                                        |
| ---------------- | --------- | ---------------------------------------------------------- |
| `surface`        | `#ffffff` | Fundo do site.                                             |
| `surface-raised` | `#f2f3f6` | Fundo das fotos, faixa de aviso, rodapé, filtros inativos. |
| `placeholder`    | `#dadfe9` | Hover dos filtros e controles claros.                      |
| `ink`            | `#121729` | Todo texto, inclusive títulos e wordmark.                  |
| `ink-muted`      | `#565c70` | Marca no card, notas, "Preço em definição".                |
| `brand`          | `#14275e` | Marinho: botões principais e filtro ativo. Nada mais.      |
| `brand-hover`    | `#0c1a45` | Hover dos botões.                                          |
| `brand-ink`      | `#ffffff` | Texto sobre o marinho.                                     |
| `focus`          | `#2f55d4` | Anel de foco.                                              |

## 3. Tipografia

- **Instrument Serif** → `font-display`: títulos, wordmark e preço na página do produto.
- **Instrument Sans** (400/500/600) → `font-sans`: todo o resto.
- Passos: `display` (40 → 72px), `head` (32 → 56px), `lead` (19 → 22px), `body` (16 → 17px),
  `small` (13 → 14px).
- Sem itálico decorativo, sem caixa alta espaçada, sem monoespaçada.
- Nome de produto em sem serifa, alinhado à esquerda. Preço com `tabular-nums`.

## 4. Layout

- Largura máxima 1360px, margens laterais iguais (16 / 32 / 48px).
- **Home:** faixa de aviso do WhatsApp → cabeçalho → abertura (texto + foto) → quatro atalhos de
  categoria com foto → "Produtos" com filtro por categoria (na URL) → "Como comprar" → rodapé.
- **Cabeçalho:** wordmark, as quatro categorias, sacola com contagem. No celular, as categorias
  numa linha rolável abaixo. Sem busca (21 itens).
- **Card:** foto quadrada, marca, nome, variante/volume, preço ou "Preço em definição", e
  "Adicionar à sacola" só quando `isPurchasable()`. Grade 2 / 3 / 4 colunas.
- **Produto:** foto à esquerda, informações à direita; ficha só com o que foi verificado;
  accordions só para campos preenchidos; "Você também pode gostar" da mesma categoria.
- **Sacola:** drawer lateral (`<dialog>`) e página `/sacola` com a mesma lista.

## 5. Componentes

- Botão principal: `brand`, cantos retos, 44–48px de altura.
- Filtros: pílulas; ativo em `brand`, inativos em `surface-raised`.
- Foco visível em tudo. Hover: botão escurece, link sublinha, foto aproxima 3%.

## 6. Imagens

1. Fotos próprias dos produtos (o dono está fazendo).
2. Até lá, **fotos ilustrativas CC0 por categoria**, sempre com a etiqueta "Foto ilustrativa".
   Trocam sozinhas quando a foto real é cadastrada (ver `docs/dados-produtos.md`).
3. Nunca imagem gerada por IA, nunca foto de outro produto como se fosse o vendido.
