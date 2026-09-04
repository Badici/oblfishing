import type { Metadata } from "next";
import { CartPageContent } from "@/components/cart/cart-page-content";

export const metadata: Metadata = {
  title: "Coș",
  description: "Verifică produsele alese și continuă către solicitarea de comandă OBL Fishing.",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <main className="flex-1 bg-paper pt-[calc(var(--navbar-height)+2rem)] pb-20">
      <div className="mx-auto w-full max-w-[var(--container)] px-5 md:px-10">
        <CartPageContent />
      </div>
    </main>
  );
}
