import type { Metadata } from "next";

import { PolicyPage, PolicySection } from "@/components/policy-page";
import { WhatsAppLink } from "@/components/whatsapp-link";

export const metadata: Metadata = {
  title: "Trocas e devoluções",
  description: "Como devolver ou trocar um produto comprado na ZIVORA.",
};

export default function ReturnsPage() {
  return (
    <PolicyPage
      title="Trocas e devoluções"
      summary="Você pode desistir da compra em até 7 dias do recebimento, com o produto lacrado. Produto com defeito é sempre trocado."
    >
      <PolicySection title="Desistência em até 7 dias">
        <p>
          Comprou e mudou de ideia? Você tem até{" "}
          <strong>7 dias corridos</strong> a partir do dia em que recebeu o
          produto para desistir da compra, como garante o Código de Defesa do
          Consumidor (art. 49).
        </p>
        <ul>
          <li>
            O produto precisa estar lacrado, sem uso e na embalagem original.
          </li>
          <li>
            Devolvemos o valor total pago, incluindo a taxa de entrega, pelo
            mesmo meio de pagamento.
          </li>
          <li>
            A devolução do produto é combinada pelo WhatsApp, sem custo para
            você.
          </li>
        </ul>
      </PolicySection>

      <PolicySection title="Produtos abertos ou usados">
        <p>
          Por segurança e higiene, cosméticos abertos ou usados não podem ser
          trocados nem devolvidos por desistência. Isso não vale para defeito:
          veja abaixo.
        </p>
      </PolicySection>

      <PolicySection title="Defeito ou problema na entrega">
        <p>
          Se o produto chegar com defeito, vazando, com a embalagem violada ou
          diferente do que você pediu, avise em até <strong>30 dias</strong> do
          recebimento. Trocamos o produto ou devolvemos o valor pago, como você
          preferir.
        </p>
      </PolicySection>

      <PolicySection title="Como pedir">
        <p>
          Chame no <WhatsAppLink /> com o seu nome, o produto e, se for defeito,
          uma foto. A gente combina a troca ou a devolução por lá.
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
