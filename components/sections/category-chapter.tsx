import { Container } from "@/components/ui/container";
import { ProductShowcase } from "@/components/products/product-showcase";
import { cn } from "@/lib/utils";
import type { Category, Product } from "@/types/catalogue";

const themeClasses: Record<Category["theme"], string> = {
  paper: "bg-paper text-ink",
  ink: "bg-slate-deep text-paper",
  gold: "bg-[#f3ead0] text-ink",
};

export function CategoryChapter({
  category,
  products,
}: {
  category: Category;
  products: Product[];
}) {
  return (
    <section
      id={category.anchor}
      className={cn("section-anchor relative overflow-x-clip pt-20 pb-16 md:pt-28 md:pb-24", themeClasses[category.theme])}
    >
      <div className="scale-pattern pointer-events-none absolute inset-0" aria-hidden />
      <Container className="relative">
        <header className="grid gap-8 lg:grid-cols-[8rem_1fr] lg:items-end">
          <p className="font-display text-6xl text-gold md:text-7xl">{category.chapter}</p>
          <div>
            <p className="text-xs tracking-[0.28em] uppercase opacity-60">{category.kicker}</p>
            <h2 className="mt-3 max-w-3xl font-display text-3xl leading-tight md:text-5xl">
              {category.name}
            </h2>
            <p className="mt-4 max-w-2xl font-display text-xl leading-snug md:text-2xl">
              {category.title}
            </p>
            <div className="editorial-measure mt-6 space-y-3 text-base leading-relaxed opacity-75">
              {category.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </header>

        <div className="mt-8 lg:mt-12">
          {products.map((product, index) => (
            <ProductShowcase
              key={product.id}
              product={product}
              category={category}
              index={index}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
