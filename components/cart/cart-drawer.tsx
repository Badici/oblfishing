"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaImage } from "@/components/ui/media-image";
import { useLockBody } from "@/hooks/use-lock-body";
import { formatPrice } from "@/lib/format";
import { findOption, getProductById } from "@/lib/catalogue";
import { cn } from "@/lib/utils";
import { useCart } from "@/providers/cart-provider";
import type { CartItem } from "@/types/order";

export function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, subtotal, itemCount, hydrated } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useLockBody(isDrawerOpen);

  useEffect(() => {
    if (isDrawerOpen) {
      lastFocus.current = document.activeElement as HTMLElement | null;
      closeRef.current?.focus();
    } else {
      lastFocus.current?.focus();
    }
  }, [isDrawerOpen]);

  useEffect(() => {
    if (!isDrawerOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeDrawer, isDrawerOpen]);

  return (
    <div
        className={cn(
          "fixed inset-0 z-[60]",
          isDrawerOpen ? "visible" : "invisible pointer-events-none",
        )}
    >
      <button
        type="button"
        aria-label="Închide coșul"
        className={cn(
          "absolute inset-0 bg-ink/50 transition-opacity duration-400",
          isDrawerOpen ? "opacity-100" : "opacity-0",
        )}
        onClick={closeDrawer}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className={cn(
          "absolute inset-y-0 right-0 flex h-full w-full max-w-full flex-col bg-paper text-ink shadow-soft transition-transform duration-500 ease-[var(--ease-out-premium)] sm:max-w-md",
          isDrawerOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <h2 id="cart-drawer-title" className="font-display text-2xl">
            Coșul tău
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={closeDrawer}
            className="inline-flex min-h-11 min-w-11 items-center justify-center"
            aria-label="Închide"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          {!hydrated ? (
            <p className="text-sm text-ink/60">Se încarcă coșul…</p>
          ) : items.length === 0 ? (
            <EmptyCart onContinue={closeDrawer} />
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={item.lineKey}>
                  <CartLine item={item} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {hydrated && items.length > 0 ? (
          <div className="border-t border-ink/10 px-5 py-5">
            <div className="flex items-baseline justify-between font-display">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-2 text-xs text-ink/55">{itemCount} produse</p>
            <div className="mt-5 flex flex-col gap-3">
              <Button href="/finalizare-comanda" variant="primary" className="w-full" onClick={closeDrawer}>
                Finalizează comanda
              </Button>
              <Button variant="ghost" className="self-start" onClick={closeDrawer}>
                Continuă cumpărăturile
              </Button>
            </div>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

function EmptyCart({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="max-w-sm">
      <p className="font-display text-2xl">Coșul este încă gol.</p>
      <p className="mt-3 text-sm leading-relaxed text-ink/65">
        Descoperă produsele OBL și pregătește următoarea partidă.
      </p>
      <Button href="/#boilies-de-nadit" className="mt-6" onClick={onContinue}>
        Descoperă produsele
      </Button>
    </div>
  );
}

function CartLine({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();
  const product = getProductById(item.productId);
  const sizeLabel = findOption(product?.options?.sizes, item.size)?.label ?? item.size;
  const typeLabel = findOption(product?.options?.types, item.type)?.label ?? item.type;

  return (
    <article className="grid grid-cols-[5.5rem_1fr] gap-4">
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-dark">
        <MediaImage
          src={item.imageSrc}
          alt={item.imageAlt}
          fill
          className="object-cover"
          sizes="88px"
        />
      </div>
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg leading-tight">{item.name}</h3>
            {sizeLabel || typeLabel ? (
              <p className="mt-1 text-xs tracking-wide text-ink/55">
                {[sizeLabel, typeLabel].filter(Boolean).join(" • ")}
              </p>
            ) : null}
          </div>
          <p className="font-display text-sm">{formatPrice(item.unitPrice * item.quantity)}</p>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="inline-flex items-center border border-ink/15">
            <button
              type="button"
              className="min-h-11 min-w-11"
              aria-label="Scade cantitatea"
              onClick={() => updateQuantity(item.lineKey, item.quantity - 1)}
            >
              −
            </button>
            <span className="min-w-8 text-center text-sm" aria-live="polite">
              {item.quantity}
            </span>
            <button
              type="button"
              className="min-h-11 min-w-11"
              aria-label="Crește cantitatea"
              onClick={() => updateQuantity(item.lineKey, item.quantity + 1)}
            >
              +
            </button>
          </div>
          <button
            type="button"
            className="text-xs tracking-wide underline-offset-4 hover:underline"
            onClick={() => removeItem(item.lineKey)}
          >
            Elimină
          </button>
        </div>
        <p className="sr-only">
          <Link href={`/#${product?.category ?? ""}`}>{item.name}</Link>
        </p>
      </div>
    </article>
  );
}
