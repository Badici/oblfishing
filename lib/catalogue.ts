import categoriesFile from "@/data/categories.json";
import companyFile from "@/data/company.json";
import galleryFile from "@/data/gallery.json";
import productsFile from "@/data/products.json";
import type {
  CategoriesFile,
  CatalogueFile,
  Category,
  Company,
  GalleryFile,
  GalleryItem,
  Product,
  ProductCategoryId,
  ProductVariantOption,
} from "@/types/catalogue";

const catalogue = productsFile as CatalogueFile;
const categoriesData = categoriesFile as CategoriesFile;
const galleryData = galleryFile as GalleryFile;
const companyData = companyFile as Company;

export function getCompany(): Company {
  return companyData;
}

export function getCategories(): Category[] {
  return categoriesData.items;
}

export function getCategoryById(id: ProductCategoryId): Category | undefined {
  return categoriesData.items.find((category) => category.id === id);
}

export function getProducts(): Product[] {
  return catalogue.items.filter((product) => product.active);
}

export function getProductBySlug(slug: string): Product | undefined {
  return getProducts().find((product) => product.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find((product) => product.id === id);
}

export function getProductsByCategory(category: ProductCategoryId): Product[] {
  return getProducts().filter((product) => product.category === category);
}

export function getGallery(): GalleryItem[] {
  return galleryData.items;
}

export function isValidVariant(
  product: Product,
  size?: string,
  type?: string,
): boolean {
  const sizes = product.options?.sizes ?? [];
  const types = product.options?.types ?? [];

  if (sizes.length > 0) {
    if (!size || !sizes.some((option) => option.value === size)) return false;
  } else if (size) {
    return false;
  }

  if (types.length > 0) {
    if (!type || !types.some((option) => option.value === type)) return false;
  } else if (type) {
    return false;
  }

  return true;
}

export function findOption(
  options: ProductVariantOption[] | undefined,
  value?: string,
): ProductVariantOption | undefined {
  if (!options || !value) return undefined;
  return options.find((option) => option.value === value);
}

export function resolveUnitPrice(
  product: Product,
  size?: string,
  type?: string,
): number {
  const sizeDelta = findOption(product.options?.sizes, size)?.priceDelta ?? 0;
  const typeDelta = findOption(product.options?.types, type)?.priceDelta ?? 0;
  return product.basePrice + sizeDelta + typeDelta;
}

export function defaultSize(product: Product): string | undefined {
  return product.options?.sizes?.[0]?.value;
}

export function defaultType(product: Product): string | undefined {
  return product.options?.types?.[0]?.value;
}

export function variantLabel(
  product: Product,
  size?: string,
  type?: string,
): string | undefined {
  const sizeLabel = findOption(product.options?.sizes, size)?.label;
  const typeLabel = findOption(product.options?.types, type)?.label;
  return [sizeLabel, typeLabel].filter(Boolean).join(" • ") || undefined;
}
