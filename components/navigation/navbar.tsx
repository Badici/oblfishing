"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { useNavbarOverlay } from "@/hooks/use-hero-overlay";
import { useLockBody } from "@/hooks/use-lock-body";
import { NAV_LEFT, NAV_RIGHT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useCart } from "@/providers/cart-provider";

export function Navbar() {
  const pathname = usePathname();
  const { itemCount, hydrated, openDrawer } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const isHome = pathname === "/";
  const overlay = useNavbarOverlay(isHome) && !menuOpen;
  const count = hydrated ? itemCount : 0;

  useLockBody(menuOpen);

  useEffect(() => {
    if (menuOpen) closeRef.current?.focus();
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow,border-color] duration-400 ease-[var(--ease-out-premium)]",
        overlay
          ? "border-b border-transparent bg-transparent text-paper"
          : "border-b border-ink/10 bg-paper text-ink shadow-soft",
      )}
    >
      <div className="relative mx-auto flex h-[var(--navbar-height)] w-full max-w-[90rem] items-center px-4 md:px-8">
        <nav
          className="hidden min-w-0 flex-1 items-center justify-end gap-5 pr-24 lg:flex xl:gap-8 xl:pr-28"
          aria-label="Categorii"
        >
          {NAV_LEFT.map((item) => (
            <NavLink key={item.href} href={item.href} onNavigate={() => setMenuOpen(false)}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link
          href="/"
          className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
          aria-label="OBL Fishing — acasă"
        >
          <span
            className={cn(
              "block transition-transform duration-400 ease-[var(--ease-out-premium)]",
              overlay ? "scale-100" : "scale-90",
            )}
          >
            <span className="block h-12 w-12 md:h-[4.25rem] md:w-[4.25rem]">
              <Logo priority size={80} />
            </span>
          </span>
        </Link>

        <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3 lg:ml-0 lg:justify-start lg:gap-5 lg:pl-24 xl:gap-7 xl:pl-28">
          <nav className="hidden min-w-0 items-center gap-5 lg:flex xl:gap-7" aria-label="Navigare principală">
            {NAV_RIGHT.map((item) => (
              <NavLink key={item.href} href={item.href} onNavigate={() => setMenuOpen(false)}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            onClick={openDrawer}
            className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 px-2 text-sm tracking-wide"
            aria-label={count > 0 ? `Coș, ${count} produse` : "Coș"}
          >
            <ShoppingBag className="h-5 w-5 lg:hidden" aria-hidden />
            <span className="hidden font-medium lg:inline">Coș</span>
            <span className="inline-flex min-w-6 justify-center font-display text-sm">
              ({count})
            </span>
          </button>

          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center lg:hidden"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">{menuOpen ? "Închide meniul" : "Deschide meniul"}</span>
            <span className="flex flex-col gap-1.5" aria-hidden>
              <span className={cn("h-px w-6 bg-current transition", menuOpen && "translate-y-[3.5px] rotate-45")} />
              <span className={cn("h-px w-6 bg-current transition", menuOpen && "-translate-y-[3.5px] -rotate-45")} />
            </span>
          </button>
        </div>
      </div>

      <div
        id={menuId}
        className={cn(
          "fixed inset-0 top-[var(--navbar-height)] z-40 bg-slate-deep text-paper lg:hidden",
          menuOpen ? "flex flex-col" : "hidden",
        )}
      >
        <nav className="flex h-full w-full flex-col justify-between px-6 py-10" aria-label="Meniu mobil">
          <ul className="space-y-2">
            {[...NAV_LEFT, ...NAV_RIGHT].map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} className="block py-3 font-display text-3xl" onNavigate={() => setMenuOpen(false)}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <button
            ref={closeRef}
            type="button"
            className="self-start border border-paper/30 px-4 py-3 text-sm"
            onClick={() => setMenuOpen(false)}
          >
            Închide
          </button>
        </nav>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
  className,
  onNavigate,
}: {
  href: string;
  children: string;
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      className={
        className ??
        "font-display text-[0.82rem] tracking-wide whitespace-nowrap transition-opacity hover:opacity-70 xl:text-[0.95rem]"
      }
      onClick={(event) => {
        const id = href.split("#")[1];
        if (!id) {
          onNavigate?.();
          return;
        }
        const target = document.getElementById(id);
        if (!target) {
          onNavigate?.();
          return;
        }
        event.preventDefault();
        onNavigate?.();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", href);
      }}
    >
      {children}
    </Link>
  );
}
