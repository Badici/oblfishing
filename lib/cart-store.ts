import {
  parseCartState,
  serializeCartState,
} from "@/lib/cart";
import { CART_STORAGE_KEY } from "@/lib/constants";
import type { CartItem } from "@/types/order";

const CART_EVENT = "obl-cart-changed";

let cachedRaw: string | null | undefined;
let cachedItems: CartItem[] = [];
const empty: CartItem[] = [];

function readRaw(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(CART_STORAGE_KEY);
}

export function getCartSnapshot(): CartItem[] {
  const raw = readRaw();
  if (raw === cachedRaw) return cachedItems;
  cachedRaw = raw;
  cachedItems = parseCartState(raw);
  return cachedItems;
}

export function getCartServerSnapshot(): CartItem[] {
  return empty;
}

export function subscribeCart(onStoreChange: () => void): () => void {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CART_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CART_EVENT, onStoreChange);
  };
}

export function writeCart(items: CartItem[]): void {
  const raw = serializeCartState(items);
  window.localStorage.setItem(CART_STORAGE_KEY, raw);
  cachedRaw = raw;
  cachedItems = items;
  window.dispatchEvent(new Event(CART_EVENT));
}
