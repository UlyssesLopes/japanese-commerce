# Ferramentas de design e como usá-las

Três skills ficam versionadas em `.claude/skills/`, para que qualquer sessão tenha as mesmas
ferramentas. Foram lidas e revisadas antes de entrar no repositório.

| Skill                              | Papel                                                      | Quando usar                                  |
| ---------------------------------- | ---------------------------------------------------------- | -------------------------------------------- |
| `design-taste-frontend` (Taste v2) | Direção de arte e controle de qualidade                    | Ao desenhar ou refazer qualquer tela pública |
| `web-design-guidelines` (Vercel)   | Auditoria de acessibilidade e UX                           | Antes de dar uma tela por pronta             |
| `playwright-cli` (Microsoft)       | Abrir o site num navegador real, clicar e tirar screenshot | Em todo ciclo visual e nos testes E2E        |

Origem e hash das duas primeiras estão em `skills-lock.json`. Para atualizar:
`npx skills update -p` (e reler o que mudou antes de commitar). O Playwright CLI é instalado
globalmente (`npm i -g @playwright/cli`); a skill é recriada com `playwright-cli install --skills`.

## Hierarquia em caso de conflito

1. **Regras de negócio do `CLAUDE.md`** (não inventar dados, sem prova social falsa…)
2. **`DESIGN.md`** (quando existir): decisões visuais aprovadas pelo dono
3. **Regras da casa da Taste**
4. Preferências gerais do modelo

## Onde a Taste conflita com este projeto

A Taste foi pensada para landing pages "nível Awwwards". Algumas regras dela não se aplicam aqui:

| Regra da Taste                                                                        | Neste projeto                                                                                                                                               |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pede no mínimo 8 elementos em movimento por página (o inspector reprova abaixo disso) | **Movimento contido.** Boutique, não showcase. Entradas sutis, sem espetáculo. Rodar o inspector e aceitar a reprovação de movimento, registrando o motivo. |
| "Conteúdo de exemplo é esperado onde o briefing tem lacunas"                          | **Proibido para dados de produto.** Texto editorial pode ter rascunho marcado; produto nunca.                                                               |
| Mínimo de 4 imagens reais por página, com busca em acervos de museus                  | Fotos dos produtos são as imagens. Acervos abertos só para imagem editorial, com crédito, e nunca como se fosse o produto.                                  |
| Sem linhas finas, sem labels pequenos em caixa alta                                   | Ponto de partida, mas o `DESIGN.md` pode liberar com justificativa: lojas como a Aesop usam bem os dois.                                                    |
| "Uma coisa interativa" por página                                                     | Na vitrine, a coisa interativa é a própria sacola. Não inventar brinquedo.                                                                                  |
| Catálogo, sacola e filtros                                                            | São mais "tela de app" do que "página": seguir `references/app-screens.md` da skill nessas telas.                                                           |

O que **adotamos integralmente** da Taste: o inventário do assunto (o que é só deste projeto), a
"argumentação" de cada seção antes do layout, os títulos de no máximo duas linhas, as margens iguais,
a proibição de gradientes, sombras, glassmorphism, emoji e cards com ícone, e o loop de screenshot
seguido de crítica e correção.

## O loop de cada tela

1. Ler o `DESIGN.md` e a seção correspondente do `PROXIMOS-PASSOS.md`.
2. Escrever o texto da tela antes do markup.
3. Construir com tokens (`globals.css`), nunca cores ou fontes literais.
4. `pnpm build && pnpm start`, depois rodar o inspector da Taste
   (`node .claude/skills/design-taste-frontend/scripts/inspect.mjs http://localhost:3000/<rota>`)
   ou tirar screenshots com o `playwright-cli` em 390, 768 e 1440 px.
5. **Abrir as screenshots e criticar** (`references/critique.md` da Taste). Corrigir os 3 piores
   problemas. No máximo 3 rodadas.
6. Auditar com `web-design-guidelines` nos arquivos alterados.
7. Mostrar ao dono com as screenshots.

## Permissão dos scripts da Taste

Os scripts (`node .claude/skills/design-taste-frontend/scripts/*.mjs`) estão liberados em
`.claude/settings.json`; sem isso o modo automático os bloqueia por serem código de terceiros.
**Ao atualizar a skill, reler os scripts antes de commitar**, porque a permissão vale para o que
estiver na pasta. Os scripts foram revisados: sobem um servidor local, abrem o Chrome via
CDP para medir e fotografar a página, e (`assets.mjs`) consultam APIs abertas de acervos (Openverse,
Wikimedia, Met, Art Institute of Chicago). Não usam chaves nem enviam dados do projeto. Também gravam
um histórico de sorteios em `~/.taste-skill/history.json`.

## Ferramentas avaliadas e não adotadas

- **awesome-design-md**: coleção de DESIGN.md de marcas como Stripe, Linear e Notion. Usamos só o
  **formato** das seções no nosso `DESIGN.md`; o conteúdo é de SaaS e puxaria para o visual errado.
- **image to code / screenshot-to-code**: o Claude já lê imagens. O valor está em receber prints de
  referência; uma skill de conversão tende a copiar layout em vez de captar princípios.
- **`frontend-design` (Anthropic)**: sobrepõe-se à Taste. Duas skills de estética ao mesmo tempo geram
  regras conflitantes.
