import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Container({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "header" | "footer" | "nav";
}) {
  return (
    <Tag className={cn("mx-auto w-full max-w-[var(--container)] px-5 md:px-10", className)}>
      {children}
    </Tag>
  );
}
