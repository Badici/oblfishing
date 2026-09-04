import { getCompany } from "@/lib/catalogue";
import { SITE_URL } from "@/lib/constants";

export function JsonLd() {
  const company = getCompany();
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.brand,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/obl-fishing-logo.png`,
    telephone: `+${company.phoneInternational}`,
    email: company.orderEmail,
    description:
      "Prezentare OBL Fishing: boilies și accesorii. Comenzile se transmit ca solicitare prin WhatsApp, nu ca plată online.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
