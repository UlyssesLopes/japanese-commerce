# Japanese Beauty Studio (nome provisório)

Vitrine online para vender cosméticos japoneses e coreanos trazidos do Japão. O cliente monta a sacola e envia o
pedido pelo WhatsApp com uma mensagem pronta.

**Status:** fundação pronta, telas ainda não construídas. Ver [`PROXIMOS-PASSOS.md`](PROXIMOS-PASSOS.md).

## Requisitos

- Node.js 22+ (testado com 24)
- pnpm 8+
- Chrome ou Edge (para as screenshots das skills de design)
- Opcional: `npm i -g @playwright/cli`

## Rodando

```bash
pnpm install
cp .env.example .env.local   # preencher o número do WhatsApp
pnpm dev                     # http://localhost:3000
```

## Comandos

| Comando                     | O que faz                    |
| --------------------------- | ---------------------------- |
| `pnpm dev`                  | Servidor de desenvolvimento  |
| `pnpm build` / `pnpm start` | Build e servidor de produção |
| `pnpm check`                | Typecheck + lint + testes    |
| `pnpm test`                 | Testes (Vitest)              |
| `pnpm format`               | Prettier                     |

## Variáveis de ambiente

| Variável                      | Uso                                                                      |
| ----------------------------- | ------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`        | URL pública (metadata, canonical, sitemap)                               |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número que recebe os pedidos, só dígitos, com DDI (ex.: `5511999999999`) |

## Documentação

- [`CLAUDE.md`](CLAUDE.md): regras e convenções (lido pelo Claude Code em toda sessão)
- [`docs/produto.md`](docs/produto.md): o que é e o que não é
- [`docs/arquitetura.md`](docs/arquitetura.md): camadas e decisões
- [`docs/dados-produtos.md`](docs/dados-produtos.md): inventário e checklist de publicação
- [`docs/design-ferramentas.md`](docs/design-ferramentas.md): skills de design e o loop visual
- [`docs/prontidao-producao.md`](docs/prontidao-producao.md): antes de vender de verdade

## Limitações atuais

- Sem telas além de um placeholder
- Lista de produtos preliminar e sem preços
- Estoque validado só no navegador; atualizar produto exige deploy
