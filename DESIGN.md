# DESIGN.md

Fonte da verdade visual. Em conflito com qualquer skill, este arquivo vence (ver
`docs/design-ferramentas.md`). Direção aprovada pelo dono em 30/10/2026, a partir de
`docs/referencias.md`.

## 1. Tema

**Uma loja clara que funciona, com a voz de uma revista.** A estrutura vem do varejo que o dono
gostou de usar (YesStyle, Samashipp, Panvel): fundo claro, produto em primeiro plano, categorias à
mão, preço e botão no card. A personalidade vem da Shino Yama: títulos em serifa com a segunda linha
em itálico e o azul-marinho como cor da marca.

O que é só deste projeto, e por isso entra no texto e nas imagens:

- Os produtos vieram **na mala**, numa viagem ao Japão. Quase tudo é unidade única.
- Marcas japonesas **e coreanas**: o site diz "trazidos do Japão", nunca "todos japoneses".
- Vários itens são **refis** (o hábito japonês do 詰め替え, tsumekae).
- A compra termina numa **conversa no WhatsApp**, não num checkout.
- O ritual de beleza japonês tem séculos de imagem: as gravuras de mulheres se maquiando
  (Utamaro, Goyō) são a imagem editorial do site enquanto as fotos dos produtos não chegam.

Fica de fora: pop-ups, cupons, contagem regressiva, "-50%", estrelas, "fulana acabou de comprar",
bolha fixa de WhatsApp, cerejeiras e bandeiras.

## 2. Cor

Uma base, uma tinta, uma cor de marca. Tokens em `src/app/globals.css`; componentes usam só os nomes.

| Token            | Valor     | Uso                                                                   |
| ---------------- | --------- | --------------------------------------------------------------------- |
| `surface`        | `#ffffff` | Fundo do site.                                                        |
| `surface-raised` | `#f2f3f6` | Degrau de tom: fundo das fotos de produto, faixas. Nunca borda.       |
| `ink`            | `#121729` | Todo texto corrido (marinho quase preto).                             |
| `ink-muted`      | `#565c70` | Só informação secundária: marca no card, notas, "Preço em definição". |
| `brand`          | `#14275e` | Marinho. Botão principal, wordmark, faixas inteiras de marca.         |
| `brand-ink`      | `#ffffff` | Texto sobre o marinho.                                                |
| `brand-soft`     | `#9fb2ec` | Itálico dos títulos **sobre** fundo marinho. Nunca sobre branco.      |
| `focus`          | `#2f55d4` | Anel de foco.                                                         |

- O marinho é a cor de ação e de marca. Não existe uma segunda cor de destaque.
- Nada de violeta, gradiente, brilho ou sombra em elemento parado.

## 3. Tipografia

Duas famílias, do mesmo desenho, via `next/font/google`:

- **Instrument Serif** (400 e itálico) → `font-display`. Só títulos e o wordmark, nunca abaixo de
  28px.
- **Instrument Sans** (400, 500 e 600) → `font-sans`. Todo o resto.

| Passo     | Tamanho    | Uso                                                    |
| --------- | ---------- | ------------------------------------------------------ |
| `display` | 44 → 104px | Título da abertura. Entrelinha 0,95, tracking -0,02em. |
| `head`    | 32 → 56px  | Título de seção.                                       |
| `lead`    | 19 → 22px  | Frase de apoio.                                        |
| `body`    | 16 → 17px  | Texto, nome do produto, botões.                        |
| `small`   | 13 → 14px  | Marca no card, notas, créditos.                        |

**Exceção às regras da Taste, aprovada pelo dono:** o título pode ter a segunda linha em itálico (é o
traço da Shino Yama que ele escolheu). Uma vez por título, sempre a segunda linha, mesma cor. Rodar o
inspector com `--allow` para essa regra.

- Títulos com no máximo duas linhas em qualquer largura.
- Nome de produto em sem serifa, alinhado à esquerda. Nunca centralizado, nunca em serifa.
- Preço com `tabular-nums`.
- Sem caixa alta espaçada, sem monoespaçada, sem numeração "01 / 02".

## 4. Layout

- Grade de 12 colunas, largura máxima 1360px, margens laterais iguais: 16px (celular), 32px (tablet),
  48px (desktop).
- Espaço entre seções: 96px no celular, 160px no desktop.
- Alinhado à esquerda por padrão.
- Página curta: abertura → produtos (com filtro de categoria) → como comprar → rodapé.

### Cabeçalho

Barra branca e simples, sem vidro e sem sombra.

- Desktop: wordmark à esquerda, as quatro categorias no centro (Cabelos, Skincare, Maquiagem, Kits),
  sacola à direita com a contagem.
- Celular: wordmark e sacola na primeira linha; as categorias numa segunda linha que rola na
  horizontal. Com quatro categorias, não precisa de menu hambúrguer.
- Sem busca: são 21 itens.

### Abertura

Duas colunas no desktop: texto à esquerda, imagem editorial à direita, ocupando a altura da dobra.
No celular, texto primeiro e a imagem logo abaixo, cortada.

### Card de produto

- Foto 4:5 sobre `surface-raised`, cantos retos.
- Sem foto: o nome da marca composto em `font-display` sobre `surface-raised`. Nunca uma foto de
  outro produto, nunca imagem gerada.
- Abaixo: marca (`small`, `ink-muted`), nome (`body`, 500), variante ou volume se houver, preço
  (`body`, 600) ou "Preço em definição" (`ink-muted`).
- Se `isPurchasable()`: botão "Adicionar à sacola" de largura total, marinho, cantos retos.
- Se não: sem botão. Nada de botão desabilitado em toda a grade.
- Grade: 2 colunas no celular, 3 no tablet, 4 no desktop. Sem borda nem sombra no card.

## 5. Componentes

- **Botão principal:** fundo `brand`, texto `brand-ink`, cantos retos, 48px de altura, peso 500.
- **Botão secundário:** texto `ink` com sublinhado, sem caixa.
- **Foco:** anel de 2px em `focus`, afastado 2px.
- Hover: o botão escurece um degrau; links ganham sublinhado. Nunca mudar o peso da fonte.

## 6. Imagens

1. Fotos próprias dos produtos (o dono está fazendo). Proporção 4:5, fundo neutro, mesma luz.
2. Gravuras japonesas em domínio público, só como imagem editorial, com crédito no rodapé e na
   legenda. Nunca no lugar do produto. Registradas no manifesto de `docs/dados-produtos.md`.
3. Nada de banco de imagens genérico nem imagem gerada por IA.

## 7. Movimento

Contido. Entradas sutis por seção (subir 16px com opacidade), retorno visual em botões e links, tudo
com alternativa para `prefers-reduced-motion`. Sem carrossel automático.
