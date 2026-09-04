import type { Metadata } from "next";
import { LegalDocument, LegalSection } from "@/components/sections/legal-document";
import { getCompany } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "Politica de confidențialitate",
  description: "Cum sunt folosite datele personale în cadrul solicitărilor de comandă OBL Fishing.",
};

export default function PrivacyPage() {
  const company = getCompany();

  return (
    <LegalDocument
      kicker="Document legal — șablon"
      title="Politica de confidențialitate"
      lede="Această pagină descrie, în formă de lucru, ce date pot fi prelucrate când folosești site-ul OBL Fishing. Identitatea completă a operatorului și detaliile legale vor fi completate când datele firmei sunt disponibile."
    >
      <LegalSection id="operator" title="1. Operatorul">
        <p>
          Operatorul datelor va fi entitatea legală OBL Fishing, ale cărei date de identificare (denumire, CUI, sediu) nu sunt încă publicate pe acest site.
        </p>
        <p>
          Până la completare, poți folosi contactul: {company.phoneDisplay}, WhatsApp și {company.orderEmail}.
        </p>
      </LegalSection>

      <LegalSection id="date-colectate" title="2. Date colectate prin comandă">
        <p>Când pregătești o solicitare de comandă, poți introduce:</p>
        <ul className="list-disc pl-5">
          <li>nume și prenume;</li>
          <li>număr de telefon;</li>
          <li>adresă de email, dacă o completezi;</li>
          <li>adresă de livrare, dacă alegi livrarea;</li>
          <li>observații despre comandă;</li>
          <li>produsele, variantele și cantitățile alese.</li>
        </ul>
      </LegalSection>

      <LegalSection id="scop" title="3. Scop">
        <p>
          Datele sunt folosite doar pentru a procesa solicitarea ta: confirmarea comenzii, comunicarea pe WhatsApp sau telefon și, dacă este cazul, livrarea.
        </p>
        <p>Nu există newsletter și nu cerem consimțământ de marketing.</p>
      </LegalSection>

      <LegalSection id="formsubmit" title="4. FormSubmit">
        <p>
          O copie a solicitării poate fi trimisă prin serviciul FormSubmit către {company.orderEmail}. FormSubmit este un procesator extern. Trimiterea poate necesita, la prima utilizare, confirmarea adresei de email de către destinatar.
        </p>
      </LegalSection>

      <LegalSection id="whatsapp" title="5. WhatsApp">
        <p>
          Comanda se confirmă printr-un mesaj pregătit în browser, deschis către WhatsApp / WhatsApp Web. Mesajul este trimis doar dacă tu apeși Trimite în aplicația WhatsApp. WhatsApp este un serviciu Meta, cu propria politică de confidențialitate.
        </p>
      </LegalSection>

      <LegalSection id="stocare-locala" title="6. Stocare locală în browser">
        <p>
          Coșul este păstrat în localStorage, pe dispozitivul tău, sub cheia <code>obl-fishing-cart-v1</code>. Conține produse, variante, prețuri și cantități — nu date de identitate.
        </p>
        <p>
          O comandă pregătită poate fi ținută temporar în sessionStorage, ca să nu se piardă dacă WhatsApp se deschide în altă filă. Datele personale de checkout nu sunt stocate permanent în localStorage.
        </p>
        <p>Site-ul nu folosește, în această versiune, cookie-uri de marketing sau analitice.</p>
      </LegalSection>

      <LegalSection id="pastrare" title="7. Păstrare">
        <p>
          Durata de păstrare a datelor trimise pe email sau WhatsApp va fi stabilită după completarea identității operatorului. Până atunci, datele sunt păstrate doar cât este necesar pentru a răspunde solicitării.
        </p>
      </LegalSection>

      <LegalSection id="drepturi" title="8. Drepturile tale">
        <p>
          Poți cere acces, rectificare, ștergere sau restricționare, în limitele legii aplicabile. Pentru aceste cereri, scrie la {company.orderEmail} sau pe WhatsApp.
        </p>
      </LegalSection>

      <LegalSection id="procesatori" title="9. Procesatori externi">
        <ul className="list-disc pl-5">
          <li>FormSubmit — trimiterea copiei pe email;</li>
          <li>WhatsApp / Meta — dacă alegi să trimiți mesajul;</li>
          <li>Vercel — găzduirea site-ului.</li>
        </ul>
      </LegalSection>

      <LegalSection id="contact-privacy" title="10. Contact">
        <p>
          Pentru întrebări despre date: {company.orderEmail}, {company.phoneDisplay}.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
