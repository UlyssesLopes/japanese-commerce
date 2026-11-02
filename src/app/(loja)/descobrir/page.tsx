import type { Metadata } from "next";
import { Suspense } from "react";

import { Container } from "@/components/container";
import { RoutineQuiz } from "@/components/routine/routine-quiz";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { siteConfig } from "@/config/site";
import { getVisibleProducts } from "@/features/catalog/queries";
import { buildQuiz } from "@/features/routine/recommend";

const description =
  "Responda poucas perguntas sobre sua pele e seu cabelo e veja os produtos da loja que combinam com você, na ordem de uso.";

export const metadata: Metadata = {
  title: "Descubra sua rotina",
  description,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: siteConfig.name,
    title: "Descubra sua rotina",
    description,
  },
};

export default async function DiscoverPage() {
  const products = await getVisibleProducts();
  const quiz = buildQuiz(products);

  return (
    <Container className="pt-10 pb-20 lg:pt-16 lg:pb-32">
      {quiz.length > 0 ? (
        // As respostas ficam na URL e são lidas no navegador.
        <Suspense fallback={<div className="min-h-[60vh]" />}>
          <RoutineQuiz products={products} quiz={quiz} />
        </Suspense>
      ) : (
        <div className="max-w-[52ch]">
          <h1 className="font-display text-head">Descubra sua rotina</h1>
          <p className="text-lead text-ink-muted mt-4">
            Estamos preparando as perguntas. Enquanto isso, conte para a gente
            no <WhatsAppLink /> o que você procura.
          </p>
        </div>
      )}
    </Container>
  );
}
