# Próximos passos

> Documento vivo. Atualizar ao fim de cada sessão: marcar o que foi feito, mover o "Agora" e
> registrar decisões novas no fim.

**Última atualização:** 30/10/2026

## Onde estamos

Fundação pronta: projeto Next.js 16 criado, skills de design instaladas e revisadas, modelo de
produto, regras de elegibilidade, gerador de mensagem do WhatsApp e docs-âncora. Ainda **não há
nenhuma tela de verdade**, de propósito: o visual espera as referências do dono.

## ⏳ Esperando o dono

- [x] ~~Lista real dos produtos~~: 21 produtos, lidos dos rótulos nas fotos (30/10/2026).
- [x] ~~DHC Vitamina B-Mix~~: fora do site (suplemento, não cosmético).
- [ ] **Fotos para o site** dos 21 produtos (o dono vai fazer). As de `product_photos/original/` são só de identificação
      (decisão do dono) e estão fora do git. Até chegarem, o site usa placeholders.
- [x] ~~Referências visuais~~: 5 sites com comentários, analisados em `docs/referencias.md` (30/10/2026).
- [x] ~~Liberar os scripts da skill Taste~~: liberado em `.claude/settings.json` (30/10/2026).
- [x] ~~Número de WhatsApp~~: o da Carol, já no `.env.local` (30/10/2026). Lembrar de cadastrar na Vercel.
- [ ] Endereço exato da "vonny" (vonny.com deu erro de certificado) e, se quiser, um print da Panvel
      (o site bloqueia navegador automático). Não bloqueia nada.
- [ ] Preço de venda de cada produto (pode vir depois; o site mostra "Preço em definição").

## ▶ Agora (próxima sessão)

1. **Dono aprova (ou pede ajustes) na primeira fatia**: header, abertura com a gravura do Goyō e
   cards de produto agrupados por categoria. Ver localmente com `pnpm build && pnpm start` em
   `/` e os estados do card em `/dev/estados` (exige `CATALOG_SHOW_DRAFTS=true` no `.env.local`).
2. Se aprovada: seção "Como comprar pelo WhatsApp" e a camada de movimento contida (DESIGN.md §7).
3. Depois: fase 3 (`/produtos` e página do produto).

**Pendências conhecidas da fatia:** o botão da sacola ainda não faz nada (fase 4); sem fotos dos
produtos, os cards mostram o nome da marca; o inspector da Taste reprova "poucas imagens" e "página
parada" até as fotos e o movimento chegarem, e acusa como "eyebrow" a marca acima do nome no card
(padrão de varejo, mantido de propósito).

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
- [ ] Primeira fatia aprovada pelo dono

### Fase 2 — Vitrine

- [ ] Layout base: header (desktop e mobile, com menu acessível), footer
- [ ] Home: hero, seleção de produtos, categorias, bloco editorial, marcas
- [ ] Páginas "Sobre" e "Contato"

### Fase 3 — Catálogo e produto

- [ ] `/produtos` com grid e filtro simples (categoria e marca, sincronizado com a URL). Sem busca nem
      ordenação: com tão poucos itens, não vale o peso.
- [ ] `/produtos/[slug]` com galeria, informações verificadas em accordion e "você também pode gostar"
- [ ] Estados vazios e "Preço em definição"

### Fase 4 — Sacola e WhatsApp

- [ ] Sacola com Zustand, persistida em localStorage (só itens e quantidades)
- [ ] Drawer da sacola + página `/sacola`
- [ ] Limites: estoque disponível, produto elegível, quantidade válida
- [ ] Revalidar a sacola contra o catálogo ao abrir (item que saiu de venda some, com aviso)
- [ ] Botão "Finalizar pelo WhatsApp" → `buildOrderMessage` + `buildWhatsAppUrl`

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

| Data       | Decisão                                                                                | Por quê                                                                                               |
| ---------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 30/10/2026 | Vender só o estoque trazido do Japão                                                   | Objetivo do dono; não é uma marca de longo prazo.                                                     |
| 30/10/2026 | "Checkout" = mensagem pronta no WhatsApp                                               | Sem pagamento online, sem dados pessoais no site, fechamento manual.                                  |
| 30/10/2026 | Tudo em português (site e docs)                                                        | Preferência do dono.                                                                                  |
| 30/10/2026 | Hospedagem na Vercel                                                                   | Preferência do dono; casa com Next.js.                                                                |
| 30/10/2026 | Sem busca, ordenação ou filtros complexos                                              | Catálogo de ~10 itens. Filtro por categoria e marca basta.                                            |
| 30/10/2026 | Skills: Taste v2, Vercel Web Design Guidelines, Playwright CLI                         | Taste para direção e inspeção; Vercel para auditoria; Playwright para ver o que foi feito.            |
| 30/10/2026 | Não instalar "image to code"                                                           | O Claude já lê imagens; o valor está nos prints de referência, não numa skill.                        |
| 30/10/2026 | awesome-design-md: usar só o formato                                                   | Os exemplos são de SaaS, o oposto do tom de boutique.                                                 |
| 30/10/2026 | Categorias: Cabelos, Skincare, Maquiagem, Kits (DHC fora do site)                      | Reflete o estoque real; "Tratamentos" se sobrepunha a Cabelos e Skincare.                             |
| 30/10/2026 | Fotos nomeadas pelo slug do produto                                                    | Liga foto ↔ produto sem tabela extra.                                                                 |
| 30/10/2026 | Fotos próprias dos produtos como padrão                                                | Autenticidade, direito de uso e consistência visual.                                                  |
| 30/10/2026 | Direção: varejo claro (YesStyle/Samashipp/Panvel) + tipografia e marinho da Shino Yama | Pedido do dono: estética da Shino Yama, usabilidade da Samashipp. Ver `docs/referencias.md`.          |
| 30/10/2026 | WhatsApp de pedidos: número da Carol, só em variável de ambiente                       | Fora do código e do git.                                                                              |
| 30/10/2026 | Gravura de Goyō (1918, domínio público) como imagem da abertura                        | Imagem honesta do ritual de beleza japonês enquanto não há fotos próprias; nunca no lugar de produto. |
| 30/10/2026 | `CATALOG_SHOW_DRAFTS` para ver rascunhos localmente                                    | Revisar o layout com o catálogo real sem mudar o status de nenhum produto. Nunca na Vercel.           |
| 30/10/2026 | Nada de referência ao Claude/IA em commits e PRs                                       | Regra do dono (ver `CLAUDE.md`, seção Git).                                                           |
