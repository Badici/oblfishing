import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

type MediaImageProps = Omit<ImageProps, "alt"> & {
  alt: string;
};

export function MediaImage({
  src,
  alt,
  unoptimized,
  fill,
  sizes,
  className,
  ...props
}: MediaImageProps) {
  const isSvg = typeof src === "string" && src.endsWith(".svg");

  if (isSvg && typeof src === "string") {
    return (
      // Native img keeps mock SVGs painting reliably; raster product photos still use next/image.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={cn(fill && "absolute inset-0 h-full w-full", className)}
        decoding="async"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      unoptimized={unoptimized}
      className={className}
      {...props}
    />
  );
}
