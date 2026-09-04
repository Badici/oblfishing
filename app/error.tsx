"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex flex-1 items-center bg-paper pt-[var(--navbar-height)]">
      <div className="mx-auto max-w-xl px-5 py-24">
        <p className="text-xs tracking-[0.28em] text-slate uppercase">Eroare</p>
        <h1 className="mt-3 font-display text-4xl">A apărut o problemă.</h1>
        <p className="mt-4 text-ink/70">
          Pagina nu s-a putut încărca corect. Poți reîncerca sau te poți întoarce la prezentarea OBL.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={reset}>Reîncearcă</Button>
          <Button href="/" variant="secondary">
            Înapoi la OBL Fishing
          </Button>
        </div>
      </div>
    </main>
  );
}
