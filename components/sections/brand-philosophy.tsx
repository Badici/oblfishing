import { Container } from "@/components/ui/container";

export function BrandPhilosophy() {
  return (
    <section className="bg-paper py-20 md:py-28">
      <Container>
        <p className="text-xs tracking-[0.28em] text-slate uppercase">De ce OBL</p>
        <h2 className="mt-4 max-w-3xl font-display text-3xl leading-tight md:text-5xl">
          Mai puțin zgomot.
          <span className="mt-2 block">Mai multă încredere în ceea ce ajunge în apă.</span>
        </h2>
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <p className="text-base leading-relaxed text-ink/70">
            Lucrăm cu profiluri pe care le poți ține de la o partidă la alta. Nu schimbăm mesajul din apă doar ca să pară ceva nou.
          </p>
          <p className="text-base leading-relaxed text-ink/70">
            Prefacem nădirea și cârligul în alegeri distincte. Un vad bun se construiește; montura trebuie să rămână precisă.
          </p>
          <p className="text-base leading-relaxed text-ink/70">
            Accesoriile rămân în rolul lor: să țină lucrurile în ordine. Nimic în plus, nimic care să ceară atenție când peștele e deja pe vad.
          </p>
        </div>
      </Container>
    </section>
  );
}
