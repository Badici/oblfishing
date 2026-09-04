import type { Metadata } from "next";
import { LegalDocument, LegalSection } from "@/components/sections/legal-document";
import { getCompany } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "Termeni și condiții",
  description: "Șablon de termeni pentru prezentarea produselor și solicitările de comandă OBL Fishing.",
};

export default function TermsPage() {
  const company = getCompany();

  return (
    <LegalDocument
      kicker="Document legal — șablon"
      title="Termeni și condiții"
      lede="Acești termeni descriu modul în care funcționează site-ul de prezentare OBL Fishing și solicitările de comandă. Informațiile despre societate, plată, retur și livrare vor fi completate când datele legale sunt disponibile."
    >
      <LegalSection id="identitate" title="1. Informații despre societate">
        <p>
          Datele complete ale companiei (denumire, CUI, registrul comerțului, sediu) nu sunt încă publicate. Până atunci, contactul de lucru este {company.phoneDisplay} și {company.orderEmail}.
        </p>
      </LegalSection>

      <LegalSection id="prezentare" title="2. Prezentarea produselor">
        <p>
          Site-ul este o prezentare de brand, cu un catalog ușor. Imaginile, prețurile și textele inițiale pot include conținut mock, marcat pentru înlocuire. Disponibilitatea reală se confirmă la comandă.
        </p>
      </LegalSection>

      <LegalSection id="comandare" title="3. Procesul de comandă">
        <p>
          Coșul trăiește în browser. La finalizare, completezi datele, iar site-ul pregătește o solicitare. Nu există plată online și nu se creează un cont.
        </p>
      </LegalSection>

      <LegalSection id="whatsapp-order" title="4. Comanda prin WhatsApp">
        <p>
          Solicitarea devine comandă abia după ce trimiți mesajul pregătit în WhatsApp și după ce OBL Fishing o confirmă. Referința afișată (de forma OBL-AAAALLZZ-XXXX) este generată în browser, nu într-o bază de date.
        </p>
      </LegalSection>

      <LegalSection id="preturi" title="5. Prețuri">
        <p>
          Prețurile sunt afișate în lei, fără cost de transport inclus. Un preț publicat pe site poate fi actualizat; prețul valabil este cel confirmat înainte de expediere sau ridicare.
        </p>
      </LegalSection>

      <LegalSection id="livrare" title="6. Livrare">
        <p>
          Costul transportului nu este calculat automat. Dacă alegi livrarea, tariful și termenul se confirmă înainte de expediere.
        </p>
      </LegalSection>

      <LegalSection id="ridicare" title="7. Ridicare personală">
        <p>
          Adresa de ridicare nu este publicată încă. Dacă alegi ridicarea personală, te contactăm pentru detalii.
        </p>
      </LegalSection>

      <LegalSection id="plata" title="8. Plată">
        <p>
          Modalitățile de plată vor fi confirmate odată cu comanda. Site-ul nu procesează carduri și nu reține date de plată.
        </p>
      </LegalSection>

      <LegalSection id="disponibilitate" title="9. Disponibilitate">
        <p>
          Produsele din catalog pot fi actualizate. O solicitare nu rezervă automat stocul până la confirmare.
        </p>
      </LegalSection>

      <LegalSection id="retur" title="10. Retur și drepturi legale">
        <p>
          Drepturile de retragere, garanție și retur vor fi detaliate după completarea datelor societății și a politicii comerciale. Până atunci, scrie-ne înainte de a returna un produs.
        </p>
      </LegalSection>

      <LegalSection id="contact-termeni" title="11. Contact">
        <p>
          {company.phoneDisplay} · {company.orderEmail} · WhatsApp
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
