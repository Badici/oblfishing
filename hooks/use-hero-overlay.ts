"use client";

import { useSyncExternalStore } from "react";

function readScrollTop(): number {
  return Math.max(
    window.scrollY,
    document.documentElement.scrollTop,
    document.body.scrollTop,
  );
}

function subscribe(onStoreChange: () => void) {
  const opts = { passive: true, capture: true } as const;
  window.addEventListener("scroll", onStoreChange, opts);
  window.addEventListener("resize", onStoreChange);
  document.addEventListener("scroll", onStoreChange, opts);
  return () => {
    window.removeEventListener("scroll", onStoreChange, opts);
    window.removeEventListener("resize", onStoreChange);
    document.removeEventListener("scroll", onStoreChange, opts);
  };
}

function getOverlaySnapshot(): boolean {
  const hero = document.getElementById("hero");
  if (!hero) return false;
  if (readScrollTop() > 12) return false;
  return hero.getBoundingClientRect().bottom > 96;
}

export function useNavbarOverlay(enabled: boolean): boolean {
  const overlay = useSyncExternalStore(subscribe, getOverlaySnapshot, () => true);
  return enabled && overlay;
}
