# OBL Fishing

Site de prezentare pentru brandul OBL Fishing: un parcurs vizual prin boilies de nădit, boilies de cârlig și accesorii, cu coș în browser și solicitare de comandă prin WhatsApp.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript (strict)
- Tailwind CSS 4
- Motion (folosit punctual; animațiile principale sunt CSS)
- Zod + React Hook Form (validare checkout)
- Vitest (unit) și Playwright (E2E)

Nu există bază de date, Docker, autentificare sau plată online. Catalogul trăiește în Git (`data/*.json`).

## Development

```bash
npm install
npm run dev
```

Deschide [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Scripts

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
```

## Deployment to Vercel

1. Importă repository-ul Git în Vercel.
2. Framework-ul (Next.js) este detectat automat.
3. Nu este nevoie de Docker.
4. Nu este nevoie de bază de date.
5. Nu există variabile de mediu obligatorii pentru prima versiune.
6. Opțional, setează `NEXT_PUBLIC_SITE_URL` (ex. `https://domeniul-tau.vercel.app`) pentru metadata canonică / Open Graph.

## Catalogue

Produsele sunt în `data/products.json`. Capitolele de categorie sunt în `data/categories.json`.

Citește produsele prin `lib/catalogue.ts` (`getProducts`, `getProductBySlug`, `getProductsByCategory`). Nu hardcoda carduri de produs în componente.

Fișierul este marcat `meta.isMock: true` până când datele comerciale sunt confirmate.

### Cum înlocuiești produsele

1. Pune fotografiile în `public/products/[slug]/` (ex. `public/products/obl-squid-strawberry/01.jpg`).
2. Actualizează `src`, `width`, `height` și `alt` în `data/products.json`.
3. Prețul se stochează numeric în `basePrice` (nu `"32 lei"`).
4. Variantele stau în `options.sizes` și `options.types`, cu `value`, `label` și opțional `priceDelta`.
5. Dimensiuni recomandate: portret ~900×1200, detaliu ~1200×800, JPEG/WebP, sub 400KB dacă se poate.
6. Pentru a ascunde un produs, setează `"active": false`.

## Product images

- Logo oficial: `public/brand/obl-fishing-logo.png` (nu-l redesena).
- Mock-uri inițiale: `public/products/mock/*.svg`
- Componentele citesc doar calea din JSON. Înlocuiești fișierul + JSON, fără să schimbi React.

## Capturile noastre

### Cum înlocuiești Capturile noastre

Editează `data/gallery.json` și înlocuiește fișierele din `public/gallery/mock/` cu fotografii reale (sau o folder nouă, actualizând `image`).

`weight` (`hero`, `tall`, `wide`, `square`) ghidează compoziția editorială.

## Company information

### Cum completezi datele companiei

Editează `data/company.json`.

Câmpurile `companyName`, `vatNumber`, `tradeRegistry`, `address` și `social.*` sunt `null` intenționat. Interfața afișează un text neutru („Datele complete ale companiei vor fi adăugate.”), nu placeholder-e tehnice.

TODO: completează identitatea legală înainte de comunicare publică fermă.

## Orders

- Coșul este ținut în `localStorage` (`obl-fishing-cart-v1`).
- Nu există bază centrală de comenzi.
- La finalizare, site-ul încearcă o copie pe email prin FormSubmit, apoi pregătește un mesaj WhatsApp.
- Clientul trebuie să apese **Trimite** în WhatsApp. Browserul nu poate trimite mesajul în numele lui.
- Referința (`OBL-YYYYMMDD-XXXX`) este generată în client, nu este un ID de bază de date.
- Coșul se golește abia după confirmarea „Am trimis mesajul”.

## FormSubmit

Destinație: `raresbadici@gmail.com`

Endpoint: `https://formsubmit.co/ajax/raresbadici@gmail.com`

La prima trimitere, FormSubmit poate cere **activarea / confirmarea adresei de email**. Verifică inbox-ul (și spam) și confirmă. Până atunci, emailul poate eșua; checkout-ul rămâne utilizabil prin WhatsApp.

## Legal notice

Paginile `/politica-confidentialitate` și `/termeni-si-conditii` sunt **șabloane**. Trebuie revizuite și completate cu datele reale ale societății. Nu pretind consultanță juridică sau conformitate verificată.

## Replacing placeholders

| Ce | Unde |
| --- | --- |
| Logo | `public/brand/obl-fishing-logo.png` |
| Produse (date) | `data/products.json` |
| Produse (poze) | `public/products/` + căi în JSON |
| Capturi | `data/gallery.json` + `public/gallery/` |
| Firmă | `data/company.json` |
| Hero atmosferă | `public/placeholders/hero-atmosphere.jpg` |
| URL site | `NEXT_PUBLIC_SITE_URL` sau `company.siteUrl` |

Ghid pas cu pas: `docs/CONTENT_GUIDE.md`.
