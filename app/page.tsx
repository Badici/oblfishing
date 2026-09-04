import { BrandPhilosophy } from "@/components/sections/brand-philosophy";
import { CategoryChapter } from "@/components/sections/category-chapter";
import { ContactSection } from "@/components/contact/contact-section";
import { CapturesGallery } from "@/components/gallery/captures-gallery";
import { Hero } from "@/components/hero/hero";
import { Manifesto } from "@/components/sections/manifesto";
import {
  getCategories,
  getCompany,
  getGallery,
  getProductsByCategory,
} from "@/lib/catalogue";

export default function HomePage() {
  const categories = getCategories();
  const gallery = getGallery();
  const company = getCompany();

  return (
    <main>
      <Hero />
      <Manifesto />
      {categories.map((category) => (
        <CategoryChapter
          key={category.id}
          category={category}
          products={getProductsByCategory(category.id)}
        />
      ))}
      <CapturesGallery items={gallery} />
      <BrandPhilosophy />
      <ContactSection company={company} />
    </main>
  );
}
