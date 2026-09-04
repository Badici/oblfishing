import { MediaImage } from "@/components/ui/media-image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  priority?: boolean;
  size?: number;
}

export function Logo({ className, priority = false, size = 72 }: LogoProps) {
  return (
    <MediaImage
      src="/brand/obl-fishing-logo.png"
      alt="OBL Fishing"
      width={size}
      height={size}
      priority={priority}
      className={cn("h-full w-full object-contain", className)}
    />
  );
}
