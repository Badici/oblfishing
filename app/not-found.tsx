import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative flex flex-1 items-center overflow-hidden bg-slate-deep text-paper">
      <div className="pointer-events-none absolute -right-16 -bottom-20 h-72 w-72 rounded-full border border-gold/30" />
      <div className="pointer-events-none absolute top-28 left-10 h-40 w-40 rounded-full bg-[var(--brand-gradient)] opacity-30 blur-2xl" />
      <div className="relative mx-auto w-full max-w-3xl px-5 py-32 md:px-10">
        <p className="text-xs tracking-[0.32em] text-gold uppercase">404</p>
        <h1 className="mt-4 font-display text-4xl leading-tight md:text-6xl">
          Se pare că ai aruncat în afara vadului.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-paper/70">
          Pagina pe care o cauți nu mai este aici sau nu a existat.
        </p>
        <Button href="/" variant="dark" className="mt-8">
          Înapoi la OBL Fishing
        </Button>
      </div>
    </main>
  );
}
