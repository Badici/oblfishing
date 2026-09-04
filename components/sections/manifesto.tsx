import { Container } from "@/components/ui/container";
import { MediaImage } from "@/components/ui/media-image";

const points = [
  {
    index: "01",
    title: "Detaliul decide partida",
    text: "Nădirea, cârligul și montura lucrează separat. Fiecare e ales ca să-și țină locul, nu ca să umple un catalog.",
  },
  {
    index: "02",
    title: "Același limbaj, de la vad la cârlig",
    text: "Profilurile se recunosc de la o partidă la alta. Schimbi prezentarea, nu mesajul din apă.",
  },
  {
    index: "03",
    title: "Fără zgomot pe mal",
    text: "Produsele sunt aici ca să fie citite și alese. Fără cont, fără plată online, fără un magazin aglomerat.",
  },
];

export function Manifesto() {
  return (
    <section className="relative overflow-hidden bg-slate-deep text-paper">
      <div className="grid min-h-[36rem] lg:grid-cols-2">
        <div className="relative min-h-[22rem] lg:min-h-full">
          <MediaImage
            src="/gallery/mock/captura1.jpeg"
            alt="Captură pe vad: crap ținut deasupra apei, la mal"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-deep via-slate-deep/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-slate-deep/25 lg:to-slate-deep" />
        </div>

        <div className="relative flex flex-col justify-center px-6 py-16 md:px-12 md:py-24 lg:pr-16">
          <Container className="px-0">
            <p className="text-xs tracking-[0.28em] text-gold uppercase">De ce OBL</p>
            <h2 className="mt-4 max-w-xl font-display text-3xl leading-tight md:text-5xl">
              Nu aducem zgomot pe mal.
              <span className="mt-2 block text-gold-soft">Aducem un set de alegeri clare.</span>
            </h2>
            <ul className="mt-10 space-y-7">
              {points.map((point) => (
                <li key={point.index} className="grid grid-cols-[3.5rem_1fr] gap-4">
                  <p className="font-display text-2xl text-gold">{point.index}</p>
                  <div>
                    <h3 className="font-display text-xl">{point.title}</h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-paper/70">{point.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Container>
        </div>
      </div>
    </section>
  );
}
