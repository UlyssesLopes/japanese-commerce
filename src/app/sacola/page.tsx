import type { Metadata } from "next";

import { CartContents } from "@/components/cart/cart-contents";
import { Container } from "@/components/container";

export const metadata: Metadata = { title: "Sacola" };

export default function SacolaPage() {
  return (
    <Container className="py-10 lg:py-16">
      <h1 className="font-display text-head">Sacola</h1>
      <div className="mt-6 max-w-2xl">
        <CartContents />
      </div>
    </Container>
  );
}
