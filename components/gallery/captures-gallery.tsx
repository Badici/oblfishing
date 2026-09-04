import { Container } from "@/components/ui/container";
import { MediaImage } from "@/components/ui/media-image";
import { cn } from "@/lib/utils";
import type { GalleryItem } from "@/types/catalogue";

export function CapturesGallery({ items }: { items: GalleryItem[] }) {
  const [hero, ...rest] = items;

  return (
    <section id="capturile-noastre" className="section-anchor bg-slate-deep py-20 text-paper md:py-28">
      <Container>
        <header className="mb-10 max-w-2xl md:mb-14">
          <p className="text-xs tracking-[0.28em] text-gold uppercase">Capitolul 04</p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl">Capturile noastre</h2>
          <p className="mt-4 text-base leading-relaxed text-paper/70">
            Imagini de pe vad, pentru ritmul partidei — nu un album de trofee.
          </p>
        </header>
      </Container>

      <div className="md:hidden">
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4">
          {items.map((item) => (
            <figure key={item.id} className="w-[78vw] shrink-0 snap-center">
              <GalleryFrame item={item} />
            </figure>
          ))}
        </div>
      </div>

      <Container className="hidden md:block">
        {hero ? (
          <figure className="relative mb-6">
            <div className="relative aspect-[16/8] overflow-hidden">
              <MediaImage
                src={hero.image}
                alt={hero.alt}
                fill
                sizes="(max-width: 1280px) 100vw, 1200px"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 max-w-xl text-sm text-paper/65">{hero.caption}</figcaption>
          </figure>
        ) : null}
        <div className="grid grid-cols-12 gap-5">
          {rest.map((item, index) => (
            <figure
              key={item.id}
              className={cn(
                index % 3 === 0 && "col-span-5 mt-10",
                index % 3 === 1 && "col-span-4",
                index % 3 === 2 && "col-span-3 mt-16",
              )}
            >
              <GalleryFrame item={item} />
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}

function GalleryFrame({ item }: { item: GalleryItem }) {
  return (
    <>
      <div
        className="relative overflow-hidden bg-slate-deep"
        style={{ aspectRatio: `${item.width} / ${item.height}` }}
      >
        <MediaImage
          src={item.image}
          alt={item.alt}
          fill
          sizes="(max-width: 768px) 80vw, 40vw"
          className="object-cover"
        />
      </div>
      <figcaption className="mt-3 text-sm text-paper/65">{item.caption}</figcaption>
    </>
  );
}
