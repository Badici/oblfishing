import type { Metadata } from "next";
import { Inter, Roboto_Slab } from "next/font/google";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Footer } from "@/components/footer/footer";
import { Navbar } from "@/components/navigation/navbar";
import { ToastRegion } from "@/components/ui/toast-region";
import { JsonLd } from "@/components/seo/json-ld";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_URL } from "@/lib/constants";
import { getCompany } from "@/lib/catalogue";
import { CartProvider } from "@/providers/cart-provider";
import "./globals.css";

const display = Roboto_Slab({
  variable: "--font-display-family",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const body = Inter({
  variable: "--font-body-family",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const company = getCompany();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | OBL Fishing",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: "OBL Fishing",
  authors: [{ name: company.brand }],
  keywords: [
    "OBL Fishing",
    "boilies",
    "boilies de nădit",
    "boilies de cârlig",
    "pescuit crap",
    "accesorii pescuit",
  ],
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: SITE_URL,
    siteName: "OBL Fishing",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/brand/obl-fishing-logo.png",
    apple: "/brand/obl-fishing-logo.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ro"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink">
        <JsonLd />
        <a className="skip-link" href="#continut">
          Sari la conținut
        </a>
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <ToastRegion />
          <div id="continut" className="flex flex-1 flex-col">
            {children}
          </div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
