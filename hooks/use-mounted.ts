"use client";

import { useSyncExternalStore } from "react";

function subscribeHydration(onStoreChange: () => void) {
  const id = requestAnimationFrame(onStoreChange);
  return () => cancelAnimationFrame(id);
}

export function useMounted(): boolean {
  return useSyncExternalStore(subscribeHydration, () => true, () => false);
}
