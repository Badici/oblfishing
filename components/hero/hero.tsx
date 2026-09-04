import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { MediaImage } from "@/components/ui/media-image";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[100dvh] items-center justify-center overflow-hidden bg-slate-deep text-paper"
    >
      <div className="absolute inset-0 overflow-hidden">
        <MediaImage
          src="/gallery/mock/poza-hero.jpeg"
          alt="Pescar ținând un crap în apă, fundal de atmosferă pentru OBL Fishing"
          fill
          priority
          sizes="100vw"
          className="hero-photo object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(44,52,72,0.18)_0%,rgba(28,36,56,0.4)_55%,rgba(17,17,17,0.66)_100%)]" />
      <div className="grain pointer-events-none absolute inset-0" />

      <div className="relative mx-auto grid w-full max-w-[var(--container)] items-center gap-10 px-5 pt-[calc(var(--navbar-height)+1.25rem)] pb-16 md:px-10 md:pb-20 lg:grid-cols-2 lg:gap-12">
        <div className="order-1 flex w-full justify-center lg:order-2">
          <div className="relative aspect-square w-48 sm:w-56 md:w-72 lg:w-[20rem]">
            <div
              className="pointer-events-none absolute -inset-10 rounded-full bg-[var(--brand-gradient)] opacity-35 blur-3xl"
              aria-hidden
            />
            <Logo priority size={352} className="relative drop-shadow-sm" />
          </div>
        </div>

        <div className="order-2 max-w-2xl text-center lg:order-1 lg:text-left">
          <p className="text-xs tracking-[0.32em] text-gold uppercase">OBL Fishing</p>
          <h1 className="mt-4 font-display text-[2.35rem] leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl">
            Făcut pentru apă.
            <span className="mt-2 block">Gândit pentru captură.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-paper/75 md:text-lg lg:mx-0">
            Boilies și accesorii dezvoltate pentru pescari care își cunosc apa și își aleg fiecare detaliu al monturii.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
            <Button href="/#boilies-de-nadit" variant="dark">
              Descoperă produsele
            </Button>
            <Button href="/#capturile-noastre" variant="ghost" className="text-paper">
              Vezi capturile
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
