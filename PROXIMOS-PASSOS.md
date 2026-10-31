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
Vercel, conta ulysseslopes, deploy pela CLI). A prévia de rascunhos (`CATALOG_SHOW_DRAFTS`) foi
**desligada em produção em 31/10/2026** a pedido do dono: rascunhos e `/dev/estados` não aparecem
mais no ar (continuam só no localhost).

## Fluxo para cada produto (combinado com o dono)

1. Dono coloca a foto em `product_photos/site/` e manda o texto (descrição, modo de uso, preço).
2. Copiar a foto para `public/produtos/<slug>.jpg` e preencher o produto em `src/data/products.ts`
   (texto do dono como está, sem emojis; `contentVerified: true`, `publicationStatus: "published"`).
3. `pnpm check`, `pnpm build`, conferir a página em 390 e 1440.
4. Commit e push.
5. **Sempre** publicar na Vercel: `vercel deploy --prod --yes` e conferir a página no ar.

## Backend (31/10/2026)

Repositório privado: https://github.com/UlyssesLopes/japanese-commerce-backend (pasta local
`../japanese-commerce-backend`).

**No ar desde 31/10:** https://zivora-api-production.up.railway.app (Railway, plano Hobby, projeto
`zivora-backend`: serviço `zivora-api` + `Postgres` + bucket `zivora-imagens`). Deploy manual com
`railway up --service zivora-api` na pasta do backend. Build pelo Dockerfile, health check e reinício
ficam nas configurações do serviço no painel do Railway (sem `railway.json`, desde 31/10). Fotos ficam no bucket privado e a API serve em
`/images/...`. A senha do backoffice está na variável `ADMIN_PASSWORD` do serviço (o dono recebeu).
Há uma foto de teste de 2×2 px em `produtos/teste-deploy/` no bucket (sem uso).

**Loja ligada à API (31/10):** produtos, kits e cupons vêm da API; o seed local (`src/data/`) foi
removido (o histórico está no git e na migração `V2__seed_products.sql`). Cada mudança no backoffice
avisa a loja (`POST /api/revalidar`, segredo `STOREFRONT_REVALIDATE_SECRET` igual nos dois lados) e
a página seguinte já mostra o dado novo. `CATALOG_SHOW_DRAFTS` só mostra rascunhos com a chave
`STOREFRONT_PREVIEW_KEY` (igual na Vercel e no Railway).

**Kits:** montados no backoffice com produtos da loja; entram na vitrine como produtos da categoria
"Kits" (sacola e WhatsApp sem mudança) e a página mostra "O que vem no kit". O kit não tem estoque
próprio: a API calcula quantos kits completos dá para vender. Kit e produto avulso dividem as
unidades: vendeu um, atualizar o estoque no backoffice.

**Backoffice `/admin` (no ar desde 31/10):** senha única (cookie httpOnly; o token nunca vai ao
navegador), Visão geral, Produtos (busca/filtro, edição completa, fotos), Kits, Cupons. A loja fica no
grupo de rotas `(loja)`; `src/proxy.ts` manda quem não tem sessão para `/admin/entrar`.

**Rodar local:** Postgres em Docker na porta **5433** (a 5432 da máquina está ocupada); API com
`JDBC_DATABASE_URL=jdbc:postgresql://localhost:5433/zivora ADMIN_PASSWORD=zivora-local`
`STOREFRONT_PREVIEW_KEY=previa-local STOREFRONT_REVALIDATE_URL=http://localhost:3100/api/revalidar`
`STOREFRONT_REVALIDATE_SECRET=revalidar-local ./mvnw spring-boot:run`; o `.env.local` do site já tem
os valores locais correspondentes.

## 🚀 Lançamento: pendências em ordem (31/10/2026)

Tudo o que falta para abrir a loja ao público. Atacar **uma de cada vez, na ordem**; marcar aqui ao
terminar. Quem faz: **eu** (código/site), **dono** (decisão ou informação), **Carol** (backoffice).

### 1. Informações da loja (dono → eu)

- [x] **Dono** decidiu (31/10): pessoa física, o site mostra "ZIVORA" + WhatsApp (seção "Quem vende"
      com Caroline Serpa e foto); pagamento por Pix, cartão por link, transferência e dinheiro;
      entrega em mãos em Porto Alegre e região metropolitana, retirada em Estância Velha, tudo
      combinado pelo WhatsApp; taxa de entrega de 5% e frete grátis a partir de um valor definido no
      backoffice; troca em até 7 dias só com produto lacrado (defeito sempre). Prazo sugerido e
      aceito para começar: "até 3 dias úteis depois da confirmação do pagamento" (editável).
- [ ] **Dono** confirma a situação dos produtos na Anvisa (ver `docs/prontidao-producao.md`).
- [x] **Eu**: páginas **Trocas e devoluções**, **Entregas e pagamento** e **Privacidade**, rodapé
      com links, entrega/retirada com taxa na sacola e na mensagem, tela **Configurações** no
      backoffice e seção **Quem vende** (faixa verde-oliva, foto redonda; só aparece com foto). O
      número do WhatsApp não aparece escrito no site: só o link "WhatsApp" com ícone. **No ar desde
      31/10.**
- [ ] **Carol**: no backoffice → Configurações, definir o valor do frete grátis e enviar a foto
      e o texto da seção Quem vende (opções de texto sugeridas na conversa de 31/10).
- [x] ~~Refazer a seção "Como comprar"~~: o dono decidiu manter como está (31/10).

### 2. Produtos (Carol/dono no backoffice)

- [x] Foto correta da **IHADA Emulsion** no ar (31/10).
- [ ] Confirmar origem e direito de uso das fotos; trocar as que parecem geradas/editadas por IA por
      fotos próprias (regra 6 do `CLAUDE.md`).
- [ ] Conferir preço, quantidade e textos de cada produto (ex.: quantidade do Diane; volume do Devé,
      180 ml no rótulo e 170 ml no texto).
- [x] Kit TSUBAKI Premium Moist & Repair publicado com foto, texto do dono e R$ 219,90 (31/10).
- [ ] Rascunhos que forem vender: NARTH Moist Shampoo, SHESOME Collagen e SHESOME Hyaluronic Acid
      precisam de foto, preço e publicação.
- [ ] Criar os kits e cupons de verdade (se houver).
- [ ] Logo oficial da ZIVORA em arquivo (SVG/PNG) e o "Z" para o ícone da aba (**dono → eu**).

### 3. Qualidade (eu)

- [ ] Teste do fluxo completo num celular real: vitrine → sacola → cupom → WhatsApp.
- [ ] Teste automatizado (E2E, Playwright) do mesmo fluxo, rodando antes de cada publicação.
- [ ] Auditoria de acessibilidade e textos (`web-design-guidelines`) nas telas da loja.

### 4. Divulgação (eu)

- [x] Imagem e texto de compartilhamento (Open Graph) para WhatsApp e Instagram, **no ar desde
      31/10**. Loja: marca + 4 fotos reais; produto: foto, marca,
      nome, preço e "Últimas unidades" se marcado. JPEG de 65–95 KB (WhatsApp só mostra imagens
      pequenas). Fontes do site em `assets/fonts/` (woff, OFL), porque o gerador não lê woff2.
- [ ] Sitemap e robots; **liberar a indexação no Google** (hoje o site está marcado para não
      aparecer em buscas).
- [ ] Opcional: domínio próprio; ligar o GitHub à Vercel para publicar a cada envio.

### 5. Abrir (Carol/dono, por último)

- [ ] Liberar a venda ("Liberar venda" no backoffice) em cada produto conferido.
- [ ] Conferir no ar uma compra de teste até a mensagem do WhatsApp.

### Já feito

- [x] Backoffice, API no Railway, loja lendo da API, kits e cupons (31/10).
- [x] Configuração do Railway no painel do serviço (31/10).
- [x] Prévia de rascunhos desligada em produção (31/10).
- [x] Aviso "Últimas unidades" na foto (texto fixo: não revela se há 1 ou mais), só nos marcados no backoffice
      (checkbox no produto); medicube Zero Pore Pad marcado (31/10).
- [x] Branch `preco-produto` (preço, hover no Chrome, categorias) já estava no `main`.
- [x] ~~Lista real dos produtos~~, ~~referências visuais~~, ~~número de WhatsApp~~ (30/10).

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

## Decisões em aberto

| Decisão                                        | Quem               | Impacto                                                        |
| ---------------------------------------------- | ------------------ | -------------------------------------------------------------- |
| Nome e identidade da marca                     | dono               | Só o texto em `src/config/site.ts` e os tokens; nada bloqueia. |
| Paleta e fontes                                | dono + `DESIGN.md` | Vem dos prints.                                                |
| Quando ligar `purchaseEnabled` em cada produto | dono               | Ver `docs/prontidao-producao.md` (Anvisa).                     |
| Como marcar um item como vendido               | dono               | No backoffice: baixar o estoque do produto.                    |

## Registro de decisões

| Data       | Decisão                                                                                           | Por quê                                                                                                                                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 30/10/2026 | Vender só o estoque trazido do Japão                                                              | Objetivo do dono; não é uma marca de longo prazo.                                                                                                                                                            |
| 30/10/2026 | "Checkout" = mensagem pronta no WhatsApp                                                          | Sem pagamento online, sem dados pessoais no site, fechamento manual.                                                                                                                                         |
| 30/10/2026 | Tudo em português (site e docs)                                                                   | Preferência do dono.                                                                                                                                                                                         |
| 30/10/2026 | Hospedagem na Vercel                                                                              | Preferência do dono; casa com Next.js.                                                                                                                                                                       |
| 30/10/2026 | Sem busca, ordenação ou filtros complexos                                                         | Catálogo de ~10 itens. Filtro por categoria e marca basta.                                                                                                                                                   |
| 30/10/2026 | Skills: Taste v2, Vercel Web Design Guidelines, Playwright CLI                                    | Taste para direção e inspeção; Vercel para auditoria; Playwright para ver o que foi feito.                                                                                                                   |
| 30/10/2026 | Não instalar "image to code"                                                                      | O Claude já lê imagens; o valor está nos prints de referência, não numa skill.                                                                                                                               |
| 30/10/2026 | awesome-design-md: usar só o formato                                                              | Os exemplos são de SaaS, o oposto do tom de boutique.                                                                                                                                                        |
| 30/10/2026 | Categorias: Cabelos, Skincare, Maquiagem, Kits (DHC fora do site)                                 | Reflete o estoque real; "Tratamentos" se sobrepunha a Cabelos e Skincare.                                                                                                                                    |
| 30/10/2026 | Fotos nomeadas pelo slug do produto                                                               | Liga foto ↔ produto sem tabela extra.                                                                                                                                                                        |
| 30/10/2026 | Fotos próprias dos produtos como padrão                                                           | Autenticidade, direito de uso e consistência visual.                                                                                                                                                         |
| 30/10/2026 | Direção: varejo claro (YesStyle/Samashipp/Panvel) + tipografia e marinho da Shino Yama            | Pedido do dono: estética da Shino Yama, usabilidade da Samashipp. Ver `docs/referencias.md`.                                                                                                                 |
| 30/10/2026 | WhatsApp de pedidos: número da Carol, só em variável de ambiente                                  | Fora do código e do git.                                                                                                                                                                                     |
| 30/10/2026 | `CATALOG_SHOW_DRAFTS` para ver rascunhos localmente                                               | Revisar o layout com o catálogo real sem mudar o status de nenhum produto. Nunca na Vercel.                                                                                                                  |
| 30/10/2026 | Nada de referência ao Claude/IA em commits e PRs                                                  | Regra do dono (ver `CLAUDE.md`, seção Git).                                                                                                                                                                  |
| 30/10/2026 | Site é só uma loja: sem história de viagem, sem gueixa/gravura/cerejeira                          | Feedback do dono ao ver a primeira versão ("é um e-commerce e apenas isso"). Gravura removida.                                                                                                               |
| 30/10/2026 | Visual claro; marinho só em botões e filtro ativo                                                 | Dono: "parece um site com um azul pesado". Linha dos sites clean das referências.                                                                                                                            |
| 30/10/2026 | Fotos ilustrativas CC0 por categoria até as fotos reais                                           | Pedido do dono. Sempre com a etiqueta "Foto ilustrativa"; trocam sozinhas quando a foto real entra.                                                                                                          |
| 30/10/2026 | Sem página `/produtos` separada; lista e filtro ficam na home                                     | 21 itens cabem numa página; menos navegação.                                                                                                                                                                 |
| 30/10/2026 | Sacola com `<dialog>` nativo, sem Radix                                                           | Acessível de graça (foco, Esc) e uma dependência a menos.                                                                                                                                                    |
| 30/10/2026 | Demo na Vercel com rascunhos visíveis em produção                                                 | Dono quis mostrar o site completo à Carol. Nada é comprável e o site não é indexado; desligar antes do lançamento.                                                                                           |
| 30/10/2026 | Preços redondos terminam em ,90 (R$ 250 → R$ 249,90)                                              | Pedido do dono, para chamar atenção. Preços que já terminam em ,90 ficam como estão.                                                                                                                         |
| 31/10/2026 | Busca de produtos no cabeçalho (lupa, atalho "/")                                                 | Pedido do dono. Revoga a decisão de 30/10 de não ter busca; tudo no navegador, sem servidor de busca.                                                                                                        |
| 31/10/2026 | Cupons: percentual ou valor fixo, mínimo, validade; validação no servidor (/api/cupom)            | A lista de cupons nunca vai ao navegador; o cupom e o desconto vão na mensagem do WhatsApp para a Carol conferir. Cupons reais ficam vazios até a Carol criar; TESTE10/TESTE20 só com COUPONS_DEMO no local. |
| 31/10/2026 | Backend próprio em Java no Railway (banco, produtos, cupons, imagens); backoffice com senha única | Decisão do dono. O site Next continua na Vercel e troca só `catalog/queries.ts` e `coupons/queries.ts` pela API.                                                                                             |
