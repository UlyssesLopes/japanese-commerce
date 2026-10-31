import type { Metadata } from "next";

import { PolicyPage, PolicySection } from "@/components/policy-page";
import { getStoreSettings } from "@/features/catalog/queries";
import { formatPrice } from "@/lib/currency";

export const metadata: Metadata = {
  title: "Entregas e pagamento",
  description:
    "Onde a ZIVORA entrega, como funciona a retirada e as formas de pagamento.",
};

export default async function DeliveryPage() {
  const s = await getStoreSettings();
  const fee =
    s.deliveryFeePercent > 0
      ? `A entrega tem taxa de ${s.deliveryFeePercent}% do valor do pedido`
      : "A entrega não tem taxa";
  const free =
    s.freeDeliveryFromCents !== undefined && s.deliveryFeePercent > 0
      ? ` e sai grátis em pedidos a partir de ${formatPrice(s.freeDeliveryFromCents)}`
      : "";

  return (
    <PolicyPage
      title="Entregas e pagamento"
      summary="Todo pedido é combinado pelo WhatsApp: você escolhe entrega em mãos ou retirada e paga como preferir."
    >
      <PolicySection title="Entrega em mãos">
        <p>
          Entregamos pessoalmente
          {s.deliveryArea ? ` em ${s.deliveryArea}` : ""}. Endereço, dia e
          horário são combinados na conversa.
        </p>
        <p>
          {fee}
          {free}. O valor aparece na sacola antes de você enviar o pedido.
        </p>
        {s.deliveryLeadTime && <p>Prazo: {s.deliveryLeadTime}.</p>}
      </PolicySection>

      <PolicySection title="Retirada">
        <p>
          Prefere buscar? A retirada
          {s.pickupLocation ? ` é em ${s.pickupLocation}` : " é combinada"}, sem
          custo. O local exato e o horário são combinados pelo WhatsApp.
        </p>
      </PolicySection>

      <PolicySection title="Formas de pagamento">
        <ul>
          <li>Pix</li>
          <li>Cartão de crédito ou débito, por link de pagamento</li>
          <li>Transferência bancária</li>
          <li>Dinheiro, na entrega em mãos ou na retirada</li>
        </ul>
      </PolicySection>
    </PolicyPage>
  );
}
