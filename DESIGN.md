# DESIGN.md

Fonte da verdade visual. Em conflito com qualquer skill, este arquivo vence (ver
`docs/design-ferramentas.md`). Revisado em 30/10/2026 após o feedback do dono sobre a primeira
versão.

## 1. Tema

**Uma loja online clara e direta de cosméticos japoneses e coreanos. E só isso.**

A estrutura segue o varejo que o dono gostou de usar (YesStyle, Samashipp, Panvel): fundo branco,
produto em primeiro plano, categorias à mão, preço e botão no card. Da Shino Yama fica só o toque de
tipografia (serifa nos títulos).

Não fazer:

- Contar como os produtos chegaram ("viagem", "na mala", "trazidos por nós").
- Imagem cultural decorativa: gueixa, gravura, cerejeira, bandeira.
- Faixas grandes de cor: o marinho em bloco deixou o site "pesado".
- Pop-ups, cupons, contagem regressiva, "-50%", estrelas, "fulana acabou de comprar", bolha fixa de
  WhatsApp.
- Chamar tudo de "japonês": há marcas coreanas.

## 2. Cor

Paleta "rosa suave", escolhida pelo dono em 30/10/2026 (o marinho com cinza ficou apagado,
"cocozento"). Base branca, tinta quase preta, rosa queimado na ação. Tokens em `src/app/globals.css`.

| Token            | Valor     | Uso                                                         |
| ---------------- | --------- | ----------------------------------------------------------- |
| `surface`        | `#ffffff` | Fundo do site.                                              |
| `surface-raised` | `#fbf2f3` | Fundo das fotos, rodapé, filtros inativos.                  |
| `placeholder`    | `#f4dfe3` | Hover dos filtros e controles claros.                       |
| `ink`            | `#1f1a1c` | Todo texto, inclusive títulos e wordmark.                   |
| `ink-muted`      | `#6e5f64` | Marca no card, notas, "Preço em definição".                 |
| `brand`          | `#c2416b` | Rosa queimado: botões principais e filtro ativo. Nada mais. |
| `brand-hover`    | `#a3304f` | Hover dos botões.                                           |
| `brand-ink`      | `#ffffff` | Texto sobre o rosa.                                         |
| `focus`          | `#a3304f` | Anel de foco.                                               |

## 3. Tipografia

- **DM Serif Display** → `font-display`: títulos, wordmark e preço na página do produto. Escolhida
  pelo dono em 30/10/2026; a Instrument Serif ficava condensada e "espremida". Espaçamento entre
  letras sempre normal (nada de tracking negativo).
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
