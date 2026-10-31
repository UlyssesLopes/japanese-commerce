# Arquitetura

## Visão geral

Loja em Next.js 16 (Vercel) + API Java (Railway, repositório `japanese-commerce-backend`) com
Postgres e bucket de fotos. Produtos, kits, preços, estoque e cupons são editados no backoffice
`/admin` e lidos pela loja na API. A sacola vive no navegador. O "pedido" sai do site como um link
`wa.me` com texto pronto.

```
/admin (Server Actions, cookie httpOnly) ──► API Java ──► Postgres / bucket
                                                 │
                                                 └─ POST /api/revalidar (avisa a loja)

API ──► catalog/queries.ts ('use cache' + cacheTag) ──► Server Components ──► HTML estático
              │
              └─ kits.ts (kit vira produto "kits") · eligibility.ts (isVisible / isPurchasable)

Navegador: sacola (Zustand + localStorage) ──► whatsapp.ts ──► wa.me/<número>?text=...
```

## Camadas

| Camada            | Onde                              | Regra                                                     |
| ----------------- | --------------------------------- | --------------------------------------------------------- |
| Dados             | API Java (`BACKEND_URL`)          | Produtos, kits, cupons e fotos, editados no `/admin`.     |
| Acesso a dados    | `src/features/catalog/queries.ts` | Única porta de leitura. Valida com Zod, filtra rascunhos. |
| Regras de negócio | `src/features/*/`, `src/lib/`     | Funções puras e testadas.                                 |
| UI                | `src/app/`, `src/components/`     | Só apresentação. Não chama a API direto.                  |
| Configuração      | `src/config/`                     | Marca, URL, WhatsApp.                                     |

## Decisões

- **Cache Components (padrão do Next 16).** O catálogo usa `'use cache'` + `cacheTag('catalog')`. A
  API chama `/api/revalidar` depois de cada mudança no backoffice; a visita seguinte já traz o dado
  novo.
- **Filtros na URL** (`?categoria=skincare&marca=ihada`). Ler `searchParams` torna a parte filtrada
  dinâmica: envolver em `<Suspense>` para manter o resto da página estático.
- **Sacola só com `{ productId, quantity }`.** Preço e nome são relidos do catálogo na hora de mostrar
  e de montar a mensagem, para que um preço antigo salvo no navegador não vá para o WhatsApp.
- **Nenhum dado pessoal sai do navegador pelo site.** O cliente escreve nome e endereço na conversa.
- **Backoffice com senha única** (decisão do dono, 31/10/2026). O token da API fica num cookie
  httpOnly; o navegador nunca fala direto com a API do admin.
- **Kit = produto no catálogo**, na categoria "kits". Sem estoque próprio: a API calcula quantos
  kits completos dá para vender com as unidades dos produtos.

## Limitações conhecidas

- Validação de estoque só no navegador. Duas pessoas podem pedir o último item ao mesmo tempo, e o
  dono resolve na conversa. Aceitável para venda manual via WhatsApp.
- Kit e produto avulso dividem as mesmas unidades; a sacola não impede pedir os dois além do
  estoque. O dono confere na conversa e atualiza o estoque no backoffice.

## Como evoluir, se um dia fizer sentido

1. Trocar o corpo de `queries.ts` por chamadas a uma API (ex.: Spring Boot + PostgreSQL) ou a um CMS
   headless. A UI não muda.
2. Validação de preço e estoque no servidor antes de gerar o link do WhatsApp (Server Action).
3. Pagamento real (Pix/cartão) entra como um novo destino do checkout, ao lado do WhatsApp.

Monólito modular basta para essa escala. Sem microsserviços, filas ou Kubernetes.
