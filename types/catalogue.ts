export type ProductCategoryId =
  | "boilies-de-nadit"
  | "boilies-de-carlig"
  | "accesorii";

export type CategoryTheme = "paper" | "ink" | "gold";

export type ProductLayout = "split-left" | "split-right" | "sticky";

export interface ProductImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ProductVariantOption {
  value: string;
  label: string;
  /** Added to basePrice. Mock catalogue currently uses 0. */
  priceDelta?: number;
}

export interface ProductOptionSet {
  sizes?: ProductVariantOption[];
  types?: ProductVariantOption[];
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategoryId;
  /** When false, the product is omitted from the public catalogue. */
  active: boolean;
  eyebrow?: string;
  tagline?: string;
  shortDescription: string;
  story: string[];
  usage?: string[];
  recommendedFor?: string[];
  basePrice: number;
  currency: "RON";
  images: ProductImage[];
  options?: ProductOptionSet;
  featured?: boolean;
  tags?: string[];
  specifications?: ProductSpecification[];
  layout: ProductLayout;
  /**
   * Marks mock/placeholder catalogue entries. Confirmed commercial data
   * should set this to false or omit it after replacement.
   */
  isMock?: boolean;
}

export interface Category {
  id: ProductCategoryId;
  slug: string;
  name: string;
  chapter: string;
  anchor: string;
  kicker: string;
  title: string;
  intro: string[];
  theme: CategoryTheme;
}

export interface GalleryItem {
  id: string;
  image: string;
  alt: string;
  caption: string;
  weight: "hero" | "tall" | "wide" | "square";
  width: number;
  height: number;
}

export interface CompanySocial {
  facebook: string | null;
  instagram: string | null;
  tiktok: string | null;
  youtube: string | null;
}

export interface Company {
  brand: string;
  siteUrl: string;
  phoneDisplay: string;
  phoneInternational: string;
  whatsapp: string;
  orderEmail: string;
  companyName: string | null;
  vatNumber: string | null;
  tradeRegistry: string | null;
  address: string | null;
  pickupNote: string;
  social: CompanySocial;
}

export interface CatalogueFile {
  meta: {
    isMock: boolean;
    note: string;
  };
  items: Product[];
}

export interface CategoriesFile {
  meta: {
    isMock: boolean;
    note: string;
  };
  items: Category[];
}

export interface GalleryFile {
  meta: {
    isMock: boolean;
    note: string;
  };
  items: GalleryItem[];
}
