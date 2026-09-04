import type { ReactNode } from "react";

export function LegalDocument({
  kicker,
  title,
  lede,
  children,
}: {
  kicker: string;
  title: string;
  lede: string;
  children: ReactNode;
}) {
  return (
    <main className="flex-1 bg-paper pt-[calc(var(--navbar-height)+2.5rem)] pb-24">
      <article className="mx-auto w-full max-w-3xl px-5 md:px-10">
        <p className="text-xs tracking-[0.28em] text-slate uppercase">{kicker}</p>
        <h1 className="mt-4 font-display text-4xl leading-tight md:text-5xl">{title}</h1>
        <p className="mt-5 text-base leading-relaxed text-ink/70">{lede}</p>
        <div className="legal-body mt-12 space-y-10 text-[1.05rem] leading-[1.7] text-ink/80">
          {children}
        </div>
        <p className="mt-16 border-t border-ink/10 pt-6 text-sm text-ink/50">
          Acest text este un șablon de lucru. Nu constituie consultanță juridică și trebuie revizuit de un specialist înainte de publicarea finală.
        </p>
      </article>
    </main>
  );
}

export function LegalSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="section-anchor">
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}
