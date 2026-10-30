# Arquitetura

## Visão geral

Site Next.js 16 sem backend próprio. O catálogo é um arquivo TypeScript (`src/data/products.ts`),
validado com Zod, lido no servidor e renderizado como páginas estáticas. A sacola vive no navegador.
O "pedido" sai do site como um link `wa.me` com texto pronto.

```
products.ts ──► queries.ts ('use cache') ──► Server Components ──► HTML estático
                    │
                    └─ eligibility.ts (isVisible / isPurchasable)

Navegador: sacola (Zustand + localStorage) ──► whatsapp.ts ──► wa.me/<número>?text=...
```

## Camadas

| Camada            | Onde                              | Regra                                                     |
| ----------------- | --------------------------------- | --------------------------------------------------------- |
| Dados             | `src/data/`                       | Só o seed do catálogo.                                    |
| Acesso a dados    | `src/features/catalog/queries.ts` | Única porta de leitura. Valida com Zod, filtra rascunhos. |
| Regras de negócio | `src/features/*/`, `src/lib/`     | Funções puras e testadas.                                 |
| UI                | `src/app/`, `src/components/`     | Só apresentação. Não importa `src/data/`.                 |
| Configuração      | `src/config/`                     | Marca, URL, WhatsApp.                                     |

## Decisões

- **Cache Components (padrão do Next 16).** As queries usam `'use cache'` + `cacheLife('hours')`. Com
  seed local isso é quase gratuito; quando os dados vierem de uma API, o comportamento de cache já
  está no lugar certo.
- **Filtros na URL** (`?categoria=skincare&marca=ihada`). Ler `searchParams` torna a parte filtrada
  dinâmica: envolver em `<Suspense>` para manter o resto da página estático.
- **Sacola só com `{ productId, quantity }`.** Preço e nome são relidos do catálogo na hora de mostrar
  e de montar a mensagem, para que um preço antigo salvo no navegador não vá para o WhatsApp.
- **Nenhum dado pessoal sai do navegador pelo site.** O cliente escreve nome e endereço na conversa.
- **Sem banco de dados.** Marcar um item como vendido = editar o seed e fazer deploy (a Vercel
  publica em ~1 min). Com esse volume, um painel seria custo sem retorno.

## Limitações conhecidas

- Validação de estoque só no navegador. Duas pessoas podem pedir o último item ao mesmo tempo, e o
  dono resolve na conversa. Aceitável para venda manual via WhatsApp.
- Atualizar estoque ou preço exige deploy.

## Como evoluir, se um dia fizer sentido

1. Trocar o corpo de `queries.ts` por chamadas a uma API (ex.: Spring Boot + PostgreSQL) ou a um CMS
   headless. A UI não muda.
2. Validação de preço e estoque no servidor antes de gerar o link do WhatsApp (Server Action).
3. Pagamento real (Pix/cartão) entra como um novo destino do checkout, ao lado do WhatsApp.

Monólito modular basta para essa escala. Sem microsserviços, filas ou Kubernetes.
