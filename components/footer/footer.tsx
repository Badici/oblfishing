import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { FOOTER_NAV } from "@/lib/constants";
import { getCompany } from "@/lib/catalogue";

export function Footer() {
  const company = getCompany();
  const hasLegalIdentity = Boolean(
    company.companyName && company.vatNumber && company.tradeRegistry && company.address,
  );

  return (
    <footer className="border-t border-paper/10 bg-slate-deep text-paper">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.1fr_1fr_1fr] md:py-20">
        <div>
          <Link href="/" aria-label="OBL Fishing — acasă" className="inline-block">
            <span className="block h-20 w-20">
              <Logo size={96} />
            </span>
          </Link>
          <p className="editorial-measure mt-6 text-sm leading-relaxed text-paper/70">
            Boilies și accesorii pentru pescari care își cunosc apa și își aleg fiecare detaliu al monturii.
          </p>
        </div>

        <div>
          <p className="font-display text-sm tracking-[0.2em] text-gold uppercase">Navigare</p>
          <ul className="mt-5 space-y-2">
            {FOOTER_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-paper/80 hover:text-gold">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-display text-sm tracking-[0.2em] text-gold uppercase">Legal</p>
          <ul className="mt-5 space-y-2">
            <li>
              <Link href="/politica-confidentialitate" className="text-sm text-paper/80 hover:text-gold">
                Politica de confidențialitate
              </Link>
            </li>
            <li>
              <Link href="/termeni-si-conditii" className="text-sm text-paper/80 hover:text-gold">
                Termeni și condiții
              </Link>
            </li>
          </ul>

          <div className="mt-8 text-sm text-paper/55">
            {hasLegalIdentity ? (
              <>
                <p>{company.companyName}</p>
                <p>CUI {company.vatNumber}</p>
                <p>Reg. Com. {company.tradeRegistry}</p>
                <p>{company.address}</p>
              </>
            ) : (
              // TODO: completează company.json cu datele legale reale.
              <p>Datele complete ale companiei vor fi adăugate.</p>
            )}
            <p className="mt-4">{company.phoneDisplay}</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
