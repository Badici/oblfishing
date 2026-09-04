"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-ink text-paper hover:bg-gold hover:text-ink border border-ink",
  secondary:
    "bg-transparent text-ink border border-ink/25 hover:border-ink hover:bg-ink hover:text-paper",
  ghost:
    "bg-transparent text-current border-b border-current/30 rounded-none px-0 hover:border-current",
  dark:
    "bg-gold text-ink border border-gold hover:bg-paper",
} as const;

type Variant = keyof typeof variants;

type Common = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = Common &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = Common & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
};

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonAsButton | ButtonAsLink) {
  const classes = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 px-5 text-sm font-medium tracking-wide transition-colors duration-300 ease-[var(--ease-out-premium)]",
    variant === "ghost" ? "rounded-none" : "rounded-[var(--radius-sm)]",
    variants[variant],
    className,
  );

  if ("href" in props && props.href) {
    const { href, target, rel, onClick } = props;
    if (target) {
      return (
        <a href={href} target={target} rel={rel} className={classes} onClick={onClick}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  const { type, ...rest } = props as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={type ?? "button"} className={classes} {...rest}>
      {children}
    </button>
  );
}
