"use client";

import { Button } from "@/components/ui/button";
import { MediaImage } from "@/components/ui/media-image";
import { findOption, getProductById } from "@/lib/catalogue";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/providers/cart-provider";

export function CartPageContent() {
  const { items, hydrated, subtotal, updateQuantity, removeItem, clearCart } = useCart();

  if (!hydrated) {
    return <p className="text-sm text-ink/60">Se încarcă coșul…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg">
        <h1 className="font-display text-4xl md:text-5xl">Coșul este încă gol.</h1>
        <p className="mt-4 text-base leading-relaxed text-ink/70">
          Descoperă produsele OBL și pregătește următoarea partidă.
        </p>
        <Button href="/#boilies-de-nadit" className="mt-8">
          Descoperă produsele
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <h1 className="font-display text-4xl">Coșul tău</h1>
        <ul className="mt-8 space-y-8">
          {items.map((item) => {
            const product = getProductById(item.productId);
            const sizeLabel = findOption(product?.options?.sizes, item.size)?.label ?? item.size;
            const typeLabel = findOption(product?.options?.types, item.type)?.label ?? item.type;
            return (
              <li key={item.lineKey} className="grid grid-cols-[6rem_1fr] gap-4 border-b border-ink/10 pb-6">
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-deep">
                  <MediaImage src={item.imageSrc} alt={item.imageAlt} fill sizes="96px" className="object-cover" />
                </div>
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-display text-2xl">{item.name}</h2>
                      {sizeLabel || typeLabel ? (
                        <p className="mt-1 text-sm text-ink/55">
                          {[sizeLabel, typeLabel].filter(Boolean).join(" • ")}
                        </p>
                      ) : null}
                    </div>
                    <p className="font-display">{formatPrice(item.unitPrice * item.quantity)}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="inline-flex items-center border border-ink/15">
                      <button type="button" className="min-h-11 min-w-11" aria-label="Scade cantitatea" onClick={() => updateQuantity(item.lineKey, item.quantity - 1)}>
                        −
                      </button>
                      <span className="min-w-8 text-center">{item.quantity}</span>
                      <button type="button" className="min-h-11 min-w-11" aria-label="Crește cantitatea" onClick={() => updateQuantity(item.lineKey, item.quantity + 1)}>
                        +
                      </button>
                    </div>
                    <button type="button" className="text-sm underline-offset-4 hover:underline" onClick={() => removeItem(item.lineKey)}>
                      Elimină
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <button type="button" className="mt-4 text-sm underline-offset-4 hover:underline" onClick={clearCart}>
          Golește coșul
        </button>
      </div>
      <aside className="h-fit border border-ink/10 bg-[#efece3] p-6">
        <div className="flex justify-between font-display text-2xl">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <p className="mt-3 text-sm text-ink/60">Transportul, dacă este cazul, se confirmă înainte de expediere.</p>
        <Button href="/finalizare-comanda" className="mt-6 w-full">
          Finalizează comanda
        </Button>
        <Button href="/#boilies-de-nadit" variant="ghost" className="mt-3">
          Continuă cumpărăturile
        </Button>
      </aside>
    </div>
  );
}
