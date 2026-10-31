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

Identidade ZIVORA, escolhida pela Carol em 30/10/2026 (quadro em `product_photos/design/`).
Substituiu a paleta rosa. Tokens em `src/app/globals.css`.

| Token            | Valor     | Uso                                                        |
| ---------------- | --------- | ---------------------------------------------------------- |
| `surface`        | `#faf6f0` | Fundo do site (creme).                                     |
| `surface-raised` | `#efe6da` | Faixas, rodapé, fundo de blocos (bege).                    |
| `placeholder`    | `#e3d6c6` | Hover dos filtros e controles claros.                      |
| `ink`            | `#24231f` | Todo texto (quase preto).                                  |
| `ink-muted`      | `#6c665b` | Marca no card, notas, "Preço em definição".                |
| `brand`          | `#3b3e2c` | Verde oliva: botões, filtro ativo, observação do vendedor. |
| `brand-hover`    | `#2b2d20` | Hover dos botões.                                          |
| `brand-ink`      | `#f4ece0` | Texto sobre o verde.                                       |

## 3. Tipografia

- **Cormorant Garamond** (500/600) → `font-display`: nome da marca, títulos e preço na página do
  produto. Escolhida pela Carol (opção B) por ser a mais próxima do logo e ler bem.
- **Instrument Sans** → `font-sans`: todo o resto.
- **Assinatura da marca:** "ZIVORA" com tracking largo e "SELECTED GOODS" pequeno em caixa alta
  espaçada embaixo (`src/components/wordmark.tsx`). O slogan "Do mundo, para o seu dia a dia" vai
  em caixa alta espaçada sob o título da abertura. Caixa alta espaçada **só** nesses dois lugares
  (exceção às regras da Taste, por ser a identidade da marca).
- O logo oficial (com o "R" curvado) ainda não existe em arquivo; quando a Carol mandar o SVG ou PNG,
  ele substitui o nome escrito no `Wordmark`.

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
