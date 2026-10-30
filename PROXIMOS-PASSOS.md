# Próximos passos

> Documento vivo. Atualizar ao fim de cada sessão: marcar o que foi feito, mover o "Agora" e
> registrar decisões novas no fim.

**Última atualização:** 30/10/2026 (noite)

## Onde estamos

**O site funciona de ponta a ponta localmente; falta conteúdo real (fotos, preços, verificação).**

- Visual refeito após o feedback do dono: loja clara e direta, sem história de viagem e sem
  imagem cultural decorativa (ver `DESIGN.md` e a memória de feedback). Marinho só em botões e
  no filtro ativo.
- **Home** (`/`): faixa de aviso do WhatsApp, abertura com foto, quatro atalhos de categoria,
  lista de produtos com filtro por categoria na URL (`?categoria=`), "Como comprar" e rodapé.
- **Produto** (`/produtos/[slug]`): foto, marca, nome, preço ou "Preço em definição", botão de
  compra só quando `isPurchasable`, ficha com o que foi verificado, accordions de benefícios,
  modo de uso e ingredientes (só aparecem quando preenchidos) e "Você também pode gostar".
- **Sacola**: Zustand salvo no navegador (só slug e quantidade), drawer com `<dialog>` e página
  `/sacola`. Revalida contra o catálogo, respeita o estoque e monta o link do WhatsApp com a
  mensagem pronta.
- **Fotos ilustrativas**: enquanto um produto não tem foto própria, o site mostra uma foto CC0 da
  categoria com a etiqueta "Foto ilustrativa" (`src/features/catalog/example-images.ts`).
  **Para colocar a foto real:** salvar em `public/produtos/<slug>.jpg` e preencher `images` do
  produto em `src/data/products.ts` (ver `docs/dados-produtos.md`). A troca é automática.
- **Hoje nenhum produto aparece em produção**: todos estão em `draft`. Localmente aparecem por
  causa de `CATALOG_SHOW_DRAFTS=true`. Para testar a sacola, use `/dev/estados` (produtos de
  exemplo, só local).
- Verificado: `pnpm check` (36 testes), `pnpm build` com e sem rascunhos, screenshots em 390 e
  1440, link do WhatsApp conferido.

Arquivos locais que não estão no git e precisam existir para retomar: `.env.local` (WhatsApp da
Carol e `CATALOG_SHOW_DRAFTS=true`; modelo em `.env.example`) e `product_photos/original/`.

**No ar para demonstração:** https://japanese-commerce.vercel.app (projeto `japanese-commerce` na
Vercel, conta ulysseslopes, deploy pela CLI). **Atenção:** `CATALOG_SHOW_DRAFTS=true` está ligado
também em **produção** na Vercel (30/10/2026, a pedido do dono, para mostrar à Carol). Por isso os
rascunhos e a página `/dev/estados` aparecem no ar. **Desligar antes do lançamento**
(`vercel env rm CATALOG_SHOW_DRAFTS production` e novo deploy).

## ⏳ Esperando o dono

- [ ] **Fotos dos 21 produtos** (o dono vai fazer). Cada foto entra trocando a ilustrativa.
- [ ] **Preço de venda** de cada produto. Sem preço, o produto não pode ir para a sacola.
- [ ] **Conferir cada produto** pelo checklist de `docs/dados-produtos.md` e mudar o status para
      `published` + `purchaseEnabled: true`.
- [ ] Feedback sobre esta versão do visual.
- [x] ~~Lista real dos produtos~~, ~~referências visuais~~, ~~número de WhatsApp~~ (30/10/2026).

## ▶ Agora (próxima sessão)

1. Colher o feedback do dono sobre esta versão e ajustar.
2. Entrar com fotos e preços que chegarem; publicar os produtos conferidos.
3. Fase 5: testes E2E do fluxo de compra, SEO e deploy na Vercel (preview primeiro).

## Fases

### Fase 0 — Fundação ✅

- [x] Next.js 16 + TypeScript strict + Tailwind v4 + ESLint + Prettier
- [x] Skills: `design-taste-frontend`, `web-design-guidelines`, `playwright-cli`
- [x] Schema de produto (Zod), seed do catálogo
- [x] `isPurchasable` / `isVisible`, `formatPrice`, mensagem e link do WhatsApp, com testes
- [x] `CLAUDE.md`, docs, este arquivo

### Fase 1 — Direção visual

- [x] Receber as referências (`docs/referencias.md`)
- [x] Escrever o `DESIGN.md`
- [x] Fontes (Instrument Serif + Instrument Sans) e tokens reais em `globals.css`
- [x] Primeira fatia (header + hero + card) construída
- [x] Primeira fatia refeita após o feedback do dono (loja clara, sem narrativa)

### Fase 2 — Vitrine

- [x] Layout base: header (desktop e mobile), footer
- [x] Home: abertura, categorias, produtos com filtro, como comprar
- [ ] Páginas "Sobre" e "Contato"

### Fase 3 — Catálogo e produto

- [x] Lista com filtro por categoria sincronizado com a URL, na própria home (não há `/produtos` separado: são 21 itens)
- ~~`/produtos` com grid e filtro simples~~ (categoria e marca, sincronizado com a URL). Sem busca nem
  ordenação: com tão poucos itens, não vale o peso.
- [x] `/produtos/[slug]` com galeria, informações verificadas em accordion e "você também pode gostar"
- [x] Estados vazios e "Preço em definição"

### Fase 4 — Sacola e WhatsApp

- [x] Sacola com Zustand, persistida em localStorage (só itens e quantidades)
- [x] Drawer da sacola + página `/sacola`
- [x] Limites: estoque disponível, produto elegível, quantidade válida
- [x] Revalidar a sacola contra o catálogo ao abrir (item que saiu de venda some, com aviso)
- [x] Botão "Finalizar pelo WhatsApp" → `buildOrderMessage` + `buildWhatsAppUrl`

### Fase 5 — Qualidade e publicação

- [ ] Testes de componentes (RTL) e fluxo E2E (Playwright) com produto-fixture
- [ ] Auditoria de acessibilidade (`web-design-guidelines`)
- [ ] SEO: metadata por página, Open Graph, sitemap, robots. Liberar indexação só no lançamento.
- [ ] Deploy na Vercel (preview primeiro), variáveis de ambiente
- [ ] Revisar `docs/prontidao-producao.md` antes de divulgar

### Depois (só se fizer sentido)

- Domínio próprio, marca definitiva (nome, logo, paleta)
- Marcar produto como vendido de forma prática (hoje é editar o seed e fazer deploy)

## Decisões em aberto

| Decisão                                        | Quem               | Impacto                                                            |
| ---------------------------------------------- | ------------------ | ------------------------------------------------------------------ |
| Nome e identidade da marca                     | dono               | Só o texto em `src/config/site.ts` e os tokens; nada bloqueia.     |
| Paleta e fontes                                | dono + `DESIGN.md` | Vem dos prints.                                                    |
| Quando ligar `purchaseEnabled` em cada produto | dono               | Ver `docs/prontidao-producao.md` (Anvisa).                         |
| Como marcar um item como vendido               | dono               | Edição manual do seed por enquanto; um painel seria exagero agora. |

## Registro de decisões

| Data       | Decisão                                                                                | Por quê                                                                                                            |
| ---------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 30/10/2026 | Vender só o estoque trazido do Japão                                                   | Objetivo do dono; não é uma marca de longo prazo.                                                                  |
| 30/10/2026 | "Checkout" = mensagem pronta no WhatsApp                                               | Sem pagamento online, sem dados pessoais no site, fechamento manual.                                               |
| 30/10/2026 | Tudo em português (site e docs)                                                        | Preferência do dono.                                                                                               |
| 30/10/2026 | Hospedagem na Vercel                                                                   | Preferência do dono; casa com Next.js.                                                                             |
| 30/10/2026 | Sem busca, ordenação ou filtros complexos                                              | Catálogo de ~10 itens. Filtro por categoria e marca basta.                                                         |
| 30/10/2026 | Skills: Taste v2, Vercel Web Design Guidelines, Playwright CLI                         | Taste para direção e inspeção; Vercel para auditoria; Playwright para ver o que foi feito.                         |
| 30/10/2026 | Não instalar "image to code"                                                           | O Claude já lê imagens; o valor está nos prints de referência, não numa skill.                                     |
| 30/10/2026 | awesome-design-md: usar só o formato                                                   | Os exemplos são de SaaS, o oposto do tom de boutique.                                                              |
| 30/10/2026 | Categorias: Cabelos, Skincare, Maquiagem, Kits (DHC fora do site)                      | Reflete o estoque real; "Tratamentos" se sobrepunha a Cabelos e Skincare.                                          |
| 30/10/2026 | Fotos nomeadas pelo slug do produto                                                    | Liga foto ↔ produto sem tabela extra.                                                                              |
| 30/10/2026 | Fotos próprias dos produtos como padrão                                                | Autenticidade, direito de uso e consistência visual.                                                               |
| 30/10/2026 | Direção: varejo claro (YesStyle/Samashipp/Panvel) + tipografia e marinho da Shino Yama | Pedido do dono: estética da Shino Yama, usabilidade da Samashipp. Ver `docs/referencias.md`.                       |
| 30/10/2026 | WhatsApp de pedidos: número da Carol, só em variável de ambiente                       | Fora do código e do git.                                                                                           |
| 30/10/2026 | `CATALOG_SHOW_DRAFTS` para ver rascunhos localmente                                    | Revisar o layout com o catálogo real sem mudar o status de nenhum produto. Nunca na Vercel.                        |
| 30/10/2026 | Nada de referência ao Claude/IA em commits e PRs                                       | Regra do dono (ver `CLAUDE.md`, seção Git).                                                                        |
| 30/10/2026 | Site é só uma loja: sem história de viagem, sem gueixa/gravura/cerejeira               | Feedback do dono ao ver a primeira versão ("é um e-commerce e apenas isso"). Gravura removida.                     |
| 30/10/2026 | Visual claro; marinho só em botões e filtro ativo                                      | Dono: "parece um site com um azul pesado". Linha dos sites clean das referências.                                  |
| 30/10/2026 | Fotos ilustrativas CC0 por categoria até as fotos reais                                | Pedido do dono. Sempre com a etiqueta "Foto ilustrativa"; trocam sozinhas quando a foto real entra.                |
| 30/10/2026 | Sem página `/produtos` separada; lista e filtro ficam na home                          | 21 itens cabem numa página; menos navegação.                                                                       |
| 30/10/2026 | Sacola com `<dialog>` nativo, sem Radix                                                | Acessível de graça (foco, Esc) e uma dependência a menos.                                                          |
| 30/10/2026 | Demo na Vercel com rascunhos visíveis em produção                                      | Dono quis mostrar o site completo à Carol. Nada é comprável e o site não é indexado; desligar antes do lançamento. |
