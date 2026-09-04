import type { Company } from "@/types/catalogue";
import company from "@/data/company.json";

export const CART_STORAGE_KEY = "obl-fishing-cart-v1";
export const PREPARED_ORDER_KEY = "obl-fishing-prepared-order-v1";
export const CART_VERSION = 1 as const;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? (company as Company).siteUrl;

export const DEFAULT_TITLE =
  "OBL Fishing | Boilies și accesorii pentru pescuit";

export const DEFAULT_DESCRIPTION =
  "Descoperă gama OBL Fishing: boilies de nădit, boilies de cârlig și accesorii pentru partide pregătite până la ultimul detaliu.";

export const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${(company as Company).orderEmail}`;

export const MAX_LINE_QUANTITY = 99;

export const NAV_LEFT = [
  { href: "/#boilies-de-nadit", label: "Boilies de nădit", id: "boilies-de-nadit" },
  { href: "/#boilies-de-carlig", label: "Boilies de cârlig", id: "boilies-de-carlig" },
] as const;

export const NAV_RIGHT = [
  { href: "/#accesorii", label: "Accesorii", id: "accesorii" },
  { href: "/#capturile-noastre", label: "Capturile noastre", id: "capturile-noastre" },
  { href: "/#contact", label: "Contact", id: "contact" },
] as const;

export const FOOTER_NAV = [
  { href: "/", label: "Acasă" },
  ...NAV_LEFT,
  ...NAV_RIGHT,
] as const;
