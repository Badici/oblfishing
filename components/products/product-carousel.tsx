"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { MediaImage } from "@/components/ui/media-image";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types/catalogue";

const INTERVAL_MS = 4200;

export function ProductCarousel({
  images,
  name,
  eyebrow,
}: {
  images: ProductImage[];
  name: string;
  eyebrow?: string;
}) {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slides = images.length > 0 ? images : [];
  const current = slides[index] ?? slides[0];

  useEffect(() => {
    if (reducedMotion || paused || slides.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % slides.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, slides.length]);

  if (!current) return null;

  return (
    <figure className="relative">
      <div
        className="relative aspect-[4/5] overflow-hidden bg-paper"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current.src}
            className="absolute inset-0"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <MediaImage
              src={current.src}
              alt={current.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={cn(
                "object-cover object-center",
                current.src.endsWith(".png") ? "scale-[2.15]" : "scale-110",
              )}
            />
          </motion.div>
        </AnimatePresence>
        <p className="pointer-events-none absolute top-4 left-4 z-10 bg-paper/85 px-2 py-1 text-[10px] tracking-[0.28em] text-ink/70 uppercase">
          {eyebrow ?? "OBL"}
        </p>
        {slides.length > 1 ? (
          <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center gap-2">
            {slides.map((slide, slideIndex) => (
              <button
                key={slide.src}
                type="button"
                aria-label={`Imagine ${slideIndex + 1} din ${slides.length}`}
                aria-current={slideIndex === index ? "true" : undefined}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-400 ease-[var(--ease-out-premium)]",
                  slideIndex === index ? "w-7 bg-gold" : "w-2.5 bg-ink/25 hover:bg-ink/45",
                )}
                onClick={() => setIndex(slideIndex)}
              />
            ))}
          </div>
        ) : null}
      </div>
      <figcaption className="mt-3 text-xs tracking-wide text-current/50">{name}</figcaption>
    </figure>
  );
}
