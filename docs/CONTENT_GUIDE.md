# Ghid de conținut OBL Fishing

Catalogul se editează în Git. Nu ai nevoie de un CMS. După modificări, fă commit și (dacă e cazul) un deploy pe Vercel.

Toate textele și prețurile inițiale sunt **mock** — bune pentru design, nu pentru comunicare comercială finală.

## Adăugarea unui produs

1. Deschide `data/products.json`.
2. Copiază un obiect existent și completează-l.

Exemplu:

```json
{
  "id": "obl-exemplu",
  "slug": "obl-exemplu",
  "name": "OBL Exemplu",
  "category": "boilies-de-nadit",
  "active": true,
  "eyebrow": "Aromă",
  "tagline": "O frază scurtă.",
  "shortDescription": "Un paragraf de prezentare.",
  "story": ["Primul paragraf.", "Al doilea paragraf."],
  "usage": ["Cum se folosește"],
  "recommendedFor": ["Unde are sens"],
  "basePrice": 32,
  "currency": "RON",
  "images": [
    {
      "src": "/products/obl-exemplu/01.jpg",
      "alt": "OBL Exemplu — boilies de nădit",
      "width": 900,
      "height": 1200
    }
  ],
  "options": {
    "sizes": [{ "value": "20mm", "label": "20 mm", "priceDelta": 0 }],
    "types": [{ "value": "tari", "label": "Tari", "priceDelta": 0 }]
  },
  "featured": false,
  "layout": "split-left"
}
```

`category` trebuie să fie una dintre: `boilies-de-nadit`, `boilies-de-carlig`, `accesorii`.

`layout`: `sticky` (capitol evidențiat pe desktop), `split-left` sau `split-right`.

## Adăugarea unei imagini

1. Creează folderul `public/products/[slug]/`.
2. Pune fișierul (`01.jpg`, `02.webp` etc.).
3. Actualizează `images` în JSON cu `src` începând cu `/products/...`.
4. Completează `alt` în română, `width` și `height` reale.

Nu folosi URL-uri externe care pot dispărea.

## Adăugarea unei capturi

1. Pune fotografia în `public/gallery/`.
2. Adaugă un obiect în `data/gallery.json`:

```json
{
  "id": "capture-09",
  "image": "/gallery/capture-09.jpg",
  "alt": "Descriere scurtă a cadrului",
  "caption": "O frază de atmosferă, fără greutăți inventate.",
  "weight": "wide",
  "width": 1600,
  "height": 900
}
```

## Modificarea prețului

Schimbă `basePrice` (număr). Pentru un plus la o variantă, folosește `priceDelta` pe mărime sau tip.

## Adăugarea unei dimensiuni

În `options.sizes` adaugă:

```json
{ "value": "18mm", "label": "18 mm", "priceDelta": 0 }
```

`value` este intern (fără spații). `label` este ce vede clientul.

## Dezactivarea unui produs

Setează `"active": false`. Produsul nu mai apare pe site, dar rămâne în fișier pentru mai târziu.
