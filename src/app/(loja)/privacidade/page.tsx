import type { Metadata } from "next";

import { PolicyPage, PolicySection } from "@/components/policy-page";
import { siteConfig } from "@/config/site";
import { formatPhone } from "@/lib/phone";

export const metadata: Metadata = {
  title: "Privacidade",
  description: "Quais dados a ZIVORA usa e para quê.",
};

export default function PrivacyPage() {
  const phone = formatPhone(siteConfig.whatsappNumber);
  return (
    <PolicyPage
      title="Privacidade"
      summary="O site não tem cadastro e não pede seus dados. O que você nos conta na conversa do WhatsApp é usado só para o seu pedido."
    >
      <PolicySection title="No site">
        <ul>
          <li>Não há cadastro, login nem formulário com dados pessoais.</li>
          <li>
            A sacola fica salva só no seu navegador (armazenamento local), para
            você não perder os itens ao fechar a página. Ela não é enviada para
            nós.
          </li>
          <li>
            O provedor que hospeda o site guarda registros técnicos de acesso
            (como endereço IP e data), como exige a lei.
          </li>
        </ul>
      </PolicySection>

      <PolicySection title="No WhatsApp">
        <p>
          Ao finalizar, o site abre o WhatsApp com a lista dos produtos. Seu
          nome, telefone e endereço só chegam até nós se você mandar na
          conversa, e são usados apenas para combinar pagamento e entrega do
          pedido. Não vendemos nem repassamos esses dados.
        </p>
        <p>
          A conversa também segue a política de privacidade do próprio WhatsApp.
        </p>
      </PolicySection>

      <PolicySection title="Seus direitos">
        <p>
          Pela Lei Geral de Proteção de Dados (LGPD), você pode pedir para ver,
          corrigir ou apagar os dados que temos sobre você. Basta pedir no
          WhatsApp{phone ? ` ${phone}` : ""}.
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
