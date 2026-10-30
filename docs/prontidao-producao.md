# Prontidão para produção

O que precisa estar resolvido **antes de ligar `purchaseEnabled` e divulgar o site**. Isto não é
aconselhamento jurídico: os itens regulatórios devem ser confirmados com um contador ou advogado.

## Regulatório e comercial

- [ ] **Anvisa.** No Brasil, cosméticos vendidos comercialmente precisam estar regularizados na Anvisa
      por uma empresa responsável. Produtos trazidos como bagagem para uso pessoal não ficam
      automaticamente liberados para revenda. Confirmar a situação de cada item (alguns podem já ser
      regularizados por um importador oficial no Brasil) e o risco envolvido.
- [ ] Rotulagem em português: exigência para venda comercial de cosméticos.
- [ ] Forma de vender: pessoa física (venda eventual de itens próprios) ou MEI/CNPJ. Afeta
      emissão de nota fiscal e obrigações.
- [ ] Código de Defesa do Consumidor: direito de arrependimento de 7 dias em compras a distância,
      política de troca e devolução, identificação do vendedor.
- [ ] Páginas de política de privacidade, termos, trocas e envio, revisadas. Até lá, ficam como
      rascunho e fora da navegação de produção.

## Privacidade (LGPD)

- [ ] O site não coleta dados pessoais (nome e endereço vão pela conversa do WhatsApp). Manter assim.
- [ ] A sacola no localStorage guarda só IDs e quantidades.
- [ ] Se entrar analytics, usar uma ferramenta sem cookies ou incluir aviso de consentimento.
- [ ] Política de privacidade explicando o fluxo pelo WhatsApp.

## Técnico

- [ ] HTTPS (automático na Vercel)
- [ ] `NEXT_PUBLIC_WHATSAPP_NUMBER` e `NEXT_PUBLIC_SITE_URL` configurados na Vercel
- [ ] Indexação liberada (`robots` em `src/app/layout.tsx` hoje está `noindex` de propósito)
- [ ] Sitemap sem produtos em `draft`
- [ ] Dados estruturados de produto sem preço, avaliação ou disponibilidade inventados
- [ ] `pnpm check` e `pnpm build` passando
- [ ] Teste manual no celular: navegar, montar sacola, abrir o WhatsApp com a mensagem certa

## Se um dia houver pagamento online

Validação de preço e estoque no servidor, webhooks verificados, processamento idempotente, reserva de
estoque, logs, monitoramento e backups. Nada disso é necessário no fluxo via WhatsApp.
