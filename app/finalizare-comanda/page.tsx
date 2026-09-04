import type { Metadata } from "next";
import { CheckoutExperience } from "@/components/checkout/checkout-experience";

export const metadata: Metadata = {
  title: "Finalizare comandă",
  description: "Pregătește solicitarea de comandă OBL Fishing. Confirmarea se face prin WhatsApp.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <main className="flex-1 bg-paper pt-[calc(var(--navbar-height)+2.5rem)] pb-24">
      <div className="mx-auto w-full max-w-[var(--container)] px-5 md:px-10">
        <p className="text-xs tracking-[0.28em] text-slate uppercase">Solicitare de comandă</p>
        <div className="mt-8">
          <CheckoutExperience />
        </div>
      </div>
    </main>
  );
}
