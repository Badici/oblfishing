"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { getCompany } from "@/lib/catalogue";
import { buildOrder } from "@/lib/order";
import { submitOrderEmail } from "@/lib/formsubmit";
import {
  getPreparedServerSnapshot,
  getPreparedSnapshot,
  subscribePrepared,
  writePrepared,
} from "@/lib/prepared-order-store";
import { checkoutSchema, emptyCheckoutValues, type CheckoutFormValues } from "@/lib/validation";
import { buildOrderWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { useCart } from "@/providers/cart-provider";
import { findOption, getProductById } from "@/lib/catalogue";
import type { PreparedOrder } from "@/types/order";

export function CheckoutExperience() {
  const { items, subtotal, hydrated, clearCart } = useCart();
  const prepared = useSyncExternalStore(
    subscribePrepared,
    getPreparedSnapshot,
    getPreparedServerSnapshot,
  );
  const [whatsappOpened, setWhatsappOpened] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!hydrated) {
    return <p className="text-sm text-ink/60">Se încarcă comanda…</p>;
  }

  if (items.length === 0 && !prepared) {
    return (
      <div className="max-w-lg">
        <h1 className="font-display text-4xl">Coșul este încă gol.</h1>
        <p className="mt-4 text-base leading-relaxed text-ink/70">
          Descoperă produsele OBL și pregătește următoarea partidă.
        </p>
        <Button href="/#boilies-de-nadit" className="mt-8">
          Descoperă produsele
        </Button>
      </div>
    );
  }

  if (prepared) {
    return (
      <CheckoutSuccess
        prepared={prepared}
        whatsappOpened={whatsappOpened}
        onWhatsApp={() => setWhatsappOpened(true)}
        onConfirmSent={() => {
          clearCart();
          writePrepared(null);
        }}
      />
    );
  }

  return (
    <CheckoutForm
      submitting={submitting}
      setSubmitting={setSubmitting}
      onPrepared={writePrepared}
      subtotal={subtotal}
    />
  );
}

function CheckoutForm({
  submitting,
  setSubmitting,
  onPrepared,
  subtotal,
}: {
  submitting: boolean;
  setSubmitting: (value: boolean) => void;
  onPrepared: (value: PreparedOrder) => void;
  subtotal: number;
}) {
  const { items } = useCart();
  const company = useMemo(() => getCompany(), []);
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: emptyCheckoutValues,
  });
  const fulfillment = useWatch({ control: form.control, name: "fulfillment" });

  async function onSubmit(values: CheckoutFormValues) {
    if (submitting) return;
    setSubmitting(true);
    const order = buildOrder({ items, values });
    const emailResult = await submitOrderEmail(order);
    const prepared: PreparedOrder = {
      order,
      whatsappUrl: buildOrderWhatsAppUrl(company.whatsapp, order),
      emailSubmitted: emailResult.ok,
      emailError: emailResult.error,
    };
    onPrepared(prepared);
    setSubmitting(false);
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" noValidate>
        <h1 className="font-display text-4xl md:text-5xl">Finalizare comandă</h1>
        <fieldset>
          <legend className="font-display text-2xl">Cum vrei să primești comanda?</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <FulfillmentOption
              selected={fulfillment === "pickup"}
              onSelect={() => form.setValue("fulfillment", "pickup")}
              title="Ridicare personală"
              text="Te vom contacta pentru stabilirea detaliilor de ridicare."
            />
            <FulfillmentOption
              selected={fulfillment === "delivery"}
              onSelect={() => form.setValue("fulfillment", "delivery")}
              title="Livrare"
              text="Costul transportului va fi confirmat înainte de expediere."
            />
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nume" error={form.formState.errors.lastName?.message}>
            <input
              autoComplete="family-name"
              className="field"
              {...form.register("lastName")}
            />
          </Field>
          <Field label="Prenume" error={form.formState.errors.firstName?.message}>
            <input
              autoComplete="given-name"
              className="field"
              {...form.register("firstName")}
            />
          </Field>
          <Field label="Telefon" error={form.formState.errors.phone?.message}>
            <input
              autoComplete="tel"
              inputMode="tel"
              className="field"
              {...form.register("phone")}
            />
          </Field>
          <Field label="Email" optional error={form.formState.errors.email?.message}>
            <input
              autoComplete="email"
              inputMode="email"
              className="field"
              {...form.register("email")}
            />
          </Field>
        </div>

        {fulfillment === "pickup" ? (
          <p className="text-sm leading-relaxed text-ink/65">{company.pickupNote}</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Județ" error={form.formState.errors.county?.message}>
              <input autoComplete="address-level1" className="field" {...form.register("county")} />
            </Field>
            <Field label="Localitate" error={form.formState.errors.city?.message}>
              <input autoComplete="address-level2" className="field" {...form.register("city")} />
            </Field>
            <Field label="Stradă și număr" className="sm:col-span-2" error={form.formState.errors.street?.message}>
              <input autoComplete="address-line1" className="field" {...form.register("street")} />
            </Field>
            <Field label="Bloc" optional>
              <input autoComplete="address-line2" className="field" {...form.register("building")} />
            </Field>
            <Field label="Scară" optional>
              <input className="field" {...form.register("staircase")} />
            </Field>
            <Field label="Etaj" optional>
              <input className="field" {...form.register("floor")} />
            </Field>
            <Field label="Apartament" optional>
              <input className="field" {...form.register("apartment")} />
            </Field>
            <Field label="Cod poștal" optional error={form.formState.errors.postalCode?.message}>
              <input autoComplete="postal-code" inputMode="numeric" className="field" {...form.register("postalCode")} />
            </Field>
          </div>
        )}

        <Field label="Observații" optional error={form.formState.errors.notes?.message}>
          <textarea rows={4} className="field min-h-28" {...form.register("notes")} />
        </Field>

        <p className="text-xs leading-relaxed text-ink/55">
          Prin trimiterea comenzii, datele introduse vor fi folosite pentru procesarea solicitării tale. Vezi{" "}
          <Link href="/politica-confidentialitate" className="underline underline-offset-4">
            Politica de confidențialitate
          </Link>
          .
        </p>

        <Button type="submit" disabled={submitting} className="min-h-12">
          {submitting ? "Pregătim comanda..." : "Pregătește comanda"}
        </Button>
      </form>

      <OrderSummary subtotal={subtotal} fulfillment={fulfillment} />
    </div>
  );
}

function OrderSummary({
  subtotal,
  fulfillment,
}: {
  subtotal: number;
  fulfillment: CheckoutFormValues["fulfillment"];
}) {
  const { items } = useCart();

  return (
    <aside className="border border-ink/10 bg-[#efece3] p-6 md:p-8">
      <h2 className="font-display text-2xl">Comanda ta</h2>
      <ul className="mt-6 space-y-4">
        {items.map((item) => {
          const product = getProductById(item.productId);
          const sizeLabel = findOption(product?.options?.sizes, item.size)?.label ?? item.size;
          const typeLabel = findOption(product?.options?.types, item.type)?.label ?? item.type;
          return (
            <li key={item.lineKey} className="border-b border-ink/10 pb-4 text-sm">
              <p className="font-display text-lg">{item.name}</p>
              {sizeLabel || typeLabel ? (
                <p className="text-ink/55">{[sizeLabel, typeLabel].filter(Boolean).join(" • ")}</p>
              ) : null}
              <p className="mt-1">
                {item.quantity} × {formatPrice(item.unitPrice)} = {formatPrice(item.unitPrice * item.quantity)}
              </p>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 flex justify-between font-display text-xl">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-ink/60">
        {fulfillment === "delivery"
          ? "Costul transportului va fi confirmat înainte de expediere."
          : "Ridicare personală — detaliile vor fi confirmate telefonic."}
      </p>
    </aside>
  );
}

function CheckoutSuccess({
  prepared,
  whatsappOpened,
  onWhatsApp,
  onConfirmSent,
}: {
  prepared: PreparedOrder;
  whatsappOpened: boolean;
  onWhatsApp: () => void;
  onConfirmSent: () => void;
}) {
  const { order } = prepared;

  return (
    <div className="max-w-2xl">
      <p className="text-xs tracking-[0.28em] text-slate uppercase">Referință client</p>
      <h1 className="mt-3 font-display text-4xl md:text-5xl">Comanda este pregătită</h1>
      <p className="mt-4 font-display text-2xl text-slate">{order.reference}</p>
      <p className="mt-6 text-base leading-relaxed text-ink/70">
        Mai este un singur pas: trimite mesajul pregătit pe WhatsApp. Această referință este generată în browser, nu este un număr de comandă dintr-o bază de date.
      </p>
      <p className="mt-4 text-sm">
        {prepared.emailSubmitted
          ? "Copia comenzii a fost trimisă."
          : "Nu am putut trimite copia comenzii pe email. Poți continua comanda prin WhatsApp."}
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Button
          href={prepared.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onWhatsApp}
        >
          Trimite pe WhatsApp
        </Button>
        <Button href="/#boilies-de-nadit" variant="secondary">
          Înapoi la produse
        </Button>
      </div>
      {whatsappOpened ? (
        <div className="mt-8 border border-ink/10 p-5">
          <p className="text-sm leading-relaxed">
            Dacă mesajul a fost trimis din WhatsApp, confirmă aici ca să golim coșul din acest browser.
          </p>
          <Button className="mt-4" onClick={onConfirmSent}>
            Am trimis mesajul
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function FulfillmentOption({
  selected,
  onSelect,
  title,
  text,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  text: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "min-h-24 border p-4 text-left",
        selected ? "border-ink bg-ink text-paper" : "border-ink/15 bg-paper",
      )}
      aria-pressed={selected}
    >
      <span className="font-display text-lg">{title}</span>
      <span className="mt-2 block text-sm opacity-75">{text}</span>
    </button>
  );
}

function Field({
  label,
  optional,
  error,
  children,
  className,
}: {
  label: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block text-sm", className)}>
      <span className="mb-2 flex items-baseline justify-between">
        <span>{label}</span>
        {optional ? <span className="text-xs text-ink/45">opțional</span> : null}
      </span>
      {children}
      {error ? <span className="mt-1 block text-xs text-red-800">{error}</span> : null}
    </label>
  );
}
