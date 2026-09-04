import { ProductCarousel } from "@/components/products/product-carousel";
import { ProductControls } from "@/components/products/product-controls";
import { cn } from "@/lib/utils";
import type { Category, Product } from "@/types/catalogue";

export function ProductShowcase({
  product,
  category,
  index,
}: {
  product: Product;
  category: Category;
  index: number;
}) {
  const tone = category.theme === "ink" ? "dark" : "light";

  const imageLeft =
    product.layout === "sticky" ||
    product.layout === "split-left" ||
    (product.layout !== "split-right" && index % 2 === 0);

  return (
    <article className="relative z-10 grid items-start gap-8 py-10 lg:grid-cols-2 lg:gap-16 lg:py-16">
      <div className={cn(imageLeft ? "lg:order-1" : "lg:order-2")}>
        <ProductCarousel images={product.images} name={product.name} eyebrow={product.eyebrow} />
      </div>
      <div className={cn("relative z-10 max-w-xl", imageLeft ? "lg:order-2" : "lg:order-1")}>
        <ProductCopy product={product} tone={tone} compact />
        <div className="mt-8">
          <ProductControls product={product} tone={tone} />
        </div>
        <ProductDetails product={product} tone={tone} />
      </div>
    </article>
  );
}

function ProductCopy({
  product,
  tone,
  compact = false,
}: {
  product: Product;
  tone: "light" | "dark";
  compact?: boolean;
}) {
  return (
    <div>
      {product.eyebrow ? (
        <p className={cn("text-xs tracking-[0.24em] uppercase", tone === "dark" ? "text-gold" : "text-slate")}>
          {product.eyebrow}
        </p>
      ) : null}
      <h3 className="mt-2 font-display text-3xl leading-tight md:text-4xl">{product.name}</h3>
      <p className={cn("mt-4 text-base leading-relaxed", tone === "dark" ? "text-paper/75" : "text-ink/70")}>
        {product.shortDescription}
      </p>
      {compact ? null : <ProductDetails product={product} tone={tone} />}
    </div>
  );
}

function ProductDetails({
  product,
  tone,
}: {
  product: Product;
  tone: "light" | "dark";
}) {
  return (
    <div className="mt-8">
      <div className={cn("space-y-3 text-sm leading-relaxed", tone === "dark" ? "text-paper/65" : "text-ink/65")}>
        {product.story.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {product.usage?.length ? (
        <div className="mt-6">
          <p className="text-xs tracking-[0.22em] uppercase opacity-55">Utilizare</p>
          <ul className="mt-2 space-y-1 text-sm">
            {product.usage.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {product.recommendedFor?.length ? (
        <div className="mt-5">
          <p className="text-xs tracking-[0.22em] uppercase opacity-55">Potrivit pentru</p>
          <ul className="mt-2 space-y-1 text-sm">
            {product.recommendedFor.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
