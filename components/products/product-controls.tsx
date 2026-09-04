"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { defaultSize, defaultType, isValidVariant, resolveUnitPrice } from "@/lib/catalogue";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useCart } from "@/providers/cart-provider";
import type { Product } from "@/types/catalogue";

export function ProductControls({
  product,
  tone = "light",
}: {
  product: Product;
  tone?: "light" | "dark";
}) {
  const { addItem } = useCart();
  const sizes = product.options?.sizes ?? [];
  const types = product.options?.types ?? [];
  const [size, setSize] = useState(defaultSize(product));
  const [type, setType] = useState(defaultType(product));
  const [quantity, setQuantity] = useState(1);

  const valid = isValidVariant(product, size, type);
  const unitPrice = useMemo(
    () => resolveUnitPrice(product, size, type),
    [product, size, type],
  );

  const onDark = tone === "dark";

  function handleAdd() {
    if (!valid) return;
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      imageSrc: product.images[0]?.src ?? "/brand/obl-fishing-logo.png",
      imageAlt: product.images[0]?.alt ?? product.name,
      size,
      type,
      unitPrice,
      quantity,
    });
  }

  return (
    <div className="relative z-20 isolate space-y-6">
      {sizes.length > 0 ? (
        <fieldset className="relative z-20 min-w-0">
          <legend className={cn("mb-3 text-xs tracking-[0.22em] uppercase", onDark ? "text-paper/60" : "text-ink/50")}>
            Dimensiune
          </legend>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Dimensiune">
            {sizes.map((option) => (
              <OptionChip
                key={option.value}
                label={option.label}
                selected={size === option.value}
                onDark={onDark}
                onSelect={() => setSize(option.value)}
              />
            ))}
          </div>
        </fieldset>
      ) : null}

      {types.length > 0 ? (
        <fieldset className="relative z-20 min-w-0">
          <legend className={cn("mb-3 text-xs tracking-[0.22em] uppercase", onDark ? "text-paper/60" : "text-ink/50")}>
            Tip
          </legend>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Tip">
            {types.map((option) => (
              <OptionChip
                key={option.value}
                label={option.label}
                selected={type === option.value}
                onDark={onDark}
                onSelect={() => setType(option.value)}
              />
            ))}
          </div>
        </fieldset>
      ) : null}

      <div className="relative z-20 flex flex-wrap items-end gap-5">
        <div>
          <p className={cn("mb-3 text-xs tracking-[0.22em] uppercase", onDark ? "text-paper/60" : "text-ink/50")}>
            Cantitate
          </p>
          <div className={cn("inline-flex items-center border", onDark ? "border-paper/25" : "border-ink/20")}>
            <button
              type="button"
              className="relative z-20 min-h-11 min-w-11"
              aria-label="Scade cantitatea"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            >
              −
            </button>
            <span className="min-w-8 text-center" aria-live="polite" aria-label={`Cantitate ${quantity}`}>
              {quantity}
            </span>
            <button
              type="button"
              className="relative z-20 min-h-11 min-w-11"
              aria-label="Crește cantitatea"
              onClick={() => setQuantity((value) => Math.min(99, value + 1))}
            >
              +
            </button>
          </div>
        </div>
        <p className={cn("font-display text-3xl", onDark ? "text-gold" : "text-ink")}>
          {formatPrice(unitPrice)}
        </p>
      </div>

      <Button
        variant={onDark ? "dark" : "primary"}
        onClick={handleAdd}
        disabled={!valid}
        className="relative z-20 min-h-12 w-full sm:w-auto"
      >
        Adaugă în coș
      </Button>
    </div>
  );
}

function OptionChip({
  label,
  selected,
  onDark,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onDark: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "relative z-20 inline-flex min-h-11 cursor-pointer items-center justify-center px-3 text-sm select-none",
        selected
          ? onDark
            ? "bg-gold text-ink"
            : "bg-ink text-paper"
          : onDark
            ? "border border-paper/25 text-paper"
            : "border border-ink/20 text-ink",
      )}
    >
      {label}
    </button>
  );
}
