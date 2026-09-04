import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { buildContactWhatsAppUrl } from "@/lib/whatsapp";
import type { Company } from "@/types/catalogue";

export function ContactSection({ company }: { company: Company }) {
  const social = Object.entries(company.social).filter(([, url]) => Boolean(url));
  const whatsappHref = buildContactWhatsAppUrl(company.whatsapp);

  return (
    <section id="contact" className="section-anchor relative overflow-hidden py-20 text-paper md:py-28">
      <div className="brand-gradient pointer-events-none absolute inset-0 opacity-90" aria-hidden />
      <div className="grain pointer-events-none absolute inset-0" />
      <Container className="relative">
        <p className="text-xs tracking-[0.28em] uppercase">Contact</p>
        <h2 className="mt-4 max-w-3xl font-display text-3xl leading-tight md:text-5xl">
          Ai o întrebare despre un produs sau vrei să alegem împreună varianta potrivită pentru partida ta?
        </h2>
        <p className="editorial-measure mt-5 text-base leading-relaxed text-paper/80">
          Scrie-ne pe WhatsApp. Răspundem acolo unde comanda se confirmă oricum: într-un mesaj clar, fără conturi și fără plată online.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button href={whatsappHref} variant="dark" target="_blank" rel="noopener noreferrer">
            Scrie-ne pe WhatsApp
          </Button>
          <Button href={`tel:+${company.phoneInternational}`} variant="ghost" className="text-paper">
            {company.phoneDisplay}
          </Button>
        </div>
        <p className="mt-6 text-sm">
          <a className="underline-offset-4 hover:underline" href={`mailto:${company.orderEmail}`}>
            {company.orderEmail}
          </a>
        </p>
        {social.length > 0 ? (
          <ul className="mt-6 flex gap-4 text-sm">
            {social.map(([name, url]) => (
              <li key={name}>
                <a href={url ?? undefined} className="capitalize underline-offset-4 hover:underline">
                  {name}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </Container>
    </section>
  );
}
