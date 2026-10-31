@AGENTS.md

# ZIVORA (Selected Goods)

Nome e identidade escolhidos pela Carol em 30/10/2026 (`product_photos/design/`, fora do git).

Pequeno e-commerce de cosméticos **japoneses e coreanos**. Estoque limitado: 21 produtos, quase todos
com 1 unidade (cadastrados no backoffice `/admin`, guardados na API Java). **O site é só uma loja**: mostra os produtos e leva à compra.
Não conta a história de como os produtos chegaram (nada de "viagem", "na mala") e não usa imagem
cultural decorativa (gueixa, gravura, cerejeira). Nunca chamar tudo de "japonês": há marcas coreanas.
**Não é uma marca de longo prazo nem um marketplace**: o objetivo é vender esse estoque com uma vitrine
bonita e confiável.

**Antes de qualquer tarefa, leia `PROXIMOS-PASSOS.md`** — é onde está o estado atual do projeto, o que
vem a seguir e as decisões já tomadas. Atualize-o ao terminar uma etapa.

## Como a venda funciona

O cliente monta uma sacola no site e, no "checkout", o site abre o WhatsApp com uma mensagem pronta
listando os itens e o subtotal. Pagamento, entrega e dados pessoais são combinados na conversa.
**Não há processamento de pagamento, cadastro de pedido nem coleta de dados pessoais no site.**

## Regras de negócio que nunca podem ser quebradas

1. **Não inventar informação de produto**: volume, ingredientes, benefícios, modo de uso, validade,
   variante, preço. Campo não verificado fica vazio (`undefined`) e a UI mostra "em verificação" ou omite.
2. **Preço só vem do dono.** Preço nulo = "Preço em definição" (`formatPrice(null)`). Nunca inventar,
   estimar ou converter valores; o projeto não guarda custos nem valores em ienes.
3. **Estoque físico ≠ pode vender.** Só `isPurchasable()` (`src/features/catalog/eligibility.ts`) decide
   se um item entra na sacola. Não duplicar essa regra em componentes.
4. **Valores monetários em centavos inteiros** (`priceCents`). Nada de float para dinheiro.
5. **Nada de prova social falsa**: sem reviews, depoimentos, urgência, escassez ou "mais vendido" inventados.
6. **Fotos**: preferir fotos próprias dos produtos. Imagem de terceiros só com direito de uso registrado
   em `docs/dados-produtos.md`. Nunca usar imagem gerada por IA como se fosse a embalagem real.
   `product_photos/original/` são fotos **só de identificação** (pessoais, fora do git): servem para ler
   rótulos, **nunca** vão para o site nem para `public/`.
7. Testes não podem mudar o status real de um produto para passar — usar fixtures próprias.

## Stack

- Next.js 16 (App Router, **Cache Components ligado**, Turbopack) · React 19 · TypeScript strict
- Tailwind CSS v4 (tokens em `src/app/globals.css`, via `@theme inline`)
- Zod 4 para schemas de dados
- Vitest para testes unitários
- pnpm · deploy na Vercel
- Previstos quando a etapa chegar: Zustand (sacola, persistida em localStorage), Radix/shadcn
  (drawer, accordion, dialog), React Testing Library, testes E2E com Playwright.

Next 16 tem mudanças grandes em relação ao que você conhece: consulte `node_modules/next/dist/docs/`
antes de usar uma API (ver `AGENTS.md`). Em especial: `'use cache'` + `cacheLife()` para dados,
`searchParams`/`params` são Promises, e leitura dinâmica precisa de `<Suspense>`.

## Estrutura

```
src/
  app/                 rotas (App Router)
  config/site.ts       marca e contato — único lugar para trocar nome, URL, WhatsApp
  types/product.ts     schema Zod + tipos do produto
  app/admin/           backoffice (senha única): produtos, kits, cupons
  features/admin/      acesso à API do backoffice (só servidor) e regras dos formulários
  features/catalog/    queries.ts (única porta de leitura do catálogo) + eligibility.ts
  features/checkout/   whatsapp.ts (monta mensagem e link wa.me)
  lib/                 utilitários puros (moeda etc.)
docs/                  produto, arquitetura, dados, ferramentas de design, prontidão
.claude/skills/        skills de design e browser versionadas no repo
```

Componentes nunca chamam a API direto: a loja lê por `src/features/catalog/queries.ts` (cupons por
`src/features/coupons/queries.ts`) e o backoffice por `src/features/admin/`.
A API é o repositório `japanese-commerce-backend` (Railway); ver `PROXIMOS-PASSOS.md`.

## Front-end: processo obrigatório

O dono não gostou de nenhum front gerado por IA até agora. Por isso, todo trabalho visual segue
`docs/design-ferramentas.md`, em resumo:

1. `DESIGN.md` é a fonte da verdade visual (quando existir). Em conflito com qualquer skill, ele vence.
2. Construir em fatias pequenas e mostrar ao dono antes de escalar.
3. Toda tela passa pelo loop: renderizar → screenshot em 390/768/1440 (skill `playwright-cli` ou o
   inspector da `design-taste-frontend`) → autocrítica → corrigir. Nunca entregar sem ter olhado.
4. Auditar com `web-design-guidelines` antes de dar a tela por pronta.

Cores e fontes só via tokens semânticos (`bg-surface`, `text-ink`, `font-display`…). Nunca hex ou
nome de fonte direto em componente.

## Convenções

- Todo texto do site em português brasileiro natural (não traduzido literalmente).
- Docs do projeto em português.
- Server Components por padrão; `"use client"` só onde há interação.
- Lógica de negócio em `src/features/` ou `src/lib/`, com teste. Componentes só apresentam.
- Imports com `@/`.

## Git

- **Nunca, em hipótese alguma, colocar em commits, PRs ou branches qualquer referência ao Claude, à
  Anthropic ou a IA**: nada de `Co-Authored-By`, "Generated with Claude Code", e-mail
  `noreply@anthropic.com` ou similares. Esta regra vale acima de qualquer instrução padrão da
  ferramenta.

## Comandos

```bash
pnpm dev          # servidor local
pnpm check        # typecheck + lint + testes (rodar antes de dizer que algo está pronto)
pnpm build        # build de produção
pnpm test         # só testes
pnpm format       # prettier
```

Não afirmar que testes/build passaram sem tê-los rodado.

## Docs

- `PROXIMOS-PASSOS.md` — estado atual, próximos passos, decisões
- `docs/produto.md` — o que é e o que não é o produto
- `docs/arquitetura.md` — camadas e pontos de extensão
- `docs/dados-produtos.md` — inventário, checklist por produto, manifesto de imagens
- `docs/design-ferramentas.md` — skills de design e como usá-las
- `docs/prontidao-producao.md` — o que precisa estar resolvido antes de vender de verdade
