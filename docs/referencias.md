# Referências visuais do dono

Fonte das decisões do `DESIGN.md`. Recebidas em 30/10/2026, como links com comentários. Os
screenshots foram tirados para análise e não ficam no repositório (são sites de terceiros).

| Site                                                 | O que o dono disse                     |
| ---------------------------------------------------- | -------------------------------------- |
| [Shino Yama Beauty](https://shinoyamabeauty.com.br/) | Gostou da estética, não da usabilidade |
| [YesStyle](https://www.yesstyle.com/pt/home.html)    | Gostou bastante                        |
| [Samashipp](https://www.samashipp.com/)              | Gostou da usabilidade, não da estética |
| [Panvel](https://www.panvel.com/)                    | "O modelo é bom"                       |
| vonny.com                                            | Horrível, não gosta                    |

A Panvel bloqueia navegador automatizado e a vonny.com deu erro de certificado, então essas duas não
foram vistas nesta análise.

## O que tirar de cada um

**Shino Yama (estética).** É o site mais próximo do nosso assunto: também é "trazido do Japão".

- Títulos em serifa de alto contraste com a segunda linha em itálico ("Beleza asiática / _ao seu
  alcance._"). É o traço mais marcante e o que dá o ar de cuidado.
- Azul-marinho profundo como cor da marca, com um azul vivo de acento.
- Muito respiro, poucos elementos por dobra.
- **Usabilidade ruim que não vamos repetir:** várias camadas flutuando ao mesmo tempo (modal de
  cupom, banner de cookies, botão de sacola, botão de WhatsApp, notificação "fulana acabou de
  comprar"); cards de produto sem preço; nomes de produto longos centralizados em serifa, difíceis de
  ler; página muito comprida; tudo escuro, o que apaga as fotos dos produtos.

**YesStyle (o favorito).**

- Fundo branco, produto em primeiro plano, foto grande e limpa.
- Navegação de categorias em caixa alta, curta e centralizada.
- Grid denso e regular; o card mostra marca, nome, preço e pronto.
- **O que não serve aqui:** banners de promoção, contagem regressiva, "-50%", avaliações em
  estrela. Tudo isso é proibido pelas regras do projeto (sem urgência nem prova social inventada) e
  não combina com 21 itens.

**Samashipp (usabilidade).**

- Sacola sempre visível no topo (a busca a gente dispensa: são 21 itens).
- Categorias como atalhos grandes logo depois do hero.
- Card com nome, preço em destaque e botão "Adicionar" de largura total: dá para comprar sem abrir
  o produto.
- **Estética que não queremos:** cerejeiras e modelo em montagem, bordô pesado, botões em pílula
  com foto recortada, rodapé vazio.

**Panvel (modelo, do que se conhece do site, não visto nesta análise).** Varejo claro e funcional: topo com busca, menu de categorias, grid de produtos
com preço e botão de compra. Confirma a direção "loja que funciona" da Samashipp.

## Síntese para o `DESIGN.md`

A estrutura de uma loja de varejo clara (YesStyle, Samashipp, Panvel) com a tipografia e a cor da
Shino Yama, sem o excesso dela.

1. **Base clara.** Fundo branco ou quase branco, para as fotos aparecerem. O marinho entra como cor
   da marca (texto, header, rodapé, uma faixa editorial), não como fundo do site inteiro.
2. **Serifa de display com itálico** nos títulos; sem serifa limpa no resto. Nomes de produto em
   sem serifa, alinhados à esquerda.
3. **Card que vende sozinho:** foto, marca, nome, preço ou "Preço em definição" e botão
   "Adicionar à sacola".
4. **Uma camada flutuante só, no máximo.** Sem modal de cupom, sem notificação de compra, sem
   contador; o WhatsApp entra no fechamento da sacola, não como bolha fixa.
5. **Página curta:** hero, categorias, produtos e "como funciona a compra pelo WhatsApp".
