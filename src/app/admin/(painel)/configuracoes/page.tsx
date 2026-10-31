import type { Metadata } from "next";
import { Suspense } from "react";

import { SettingsForm } from "@/components/admin/settings-form";
import { PageHeader } from "@/components/admin/ui";
import { getSettings } from "@/features/admin/queries";

export const metadata: Metadata = { title: "Configurações" };

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Configurações"
        subtitle="Entrega, retirada, taxa e a seção Quem vende."
      />
      <Suspense
        fallback={<div aria-busy className="bg-rule h-96 rounded-lg" />}
      >
        <Settings />
      </Suspense>
    </>
  );
}

async function Settings() {
  return <SettingsForm settings={await getSettings()} />;
}
