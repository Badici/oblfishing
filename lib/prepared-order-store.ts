import { PREPARED_ORDER_KEY } from "@/lib/constants";
import type { PreparedOrder } from "@/types/order";

const EVENT = "obl-prepared-order-changed";

let cachedRaw: string | null | undefined;
let cached: PreparedOrder | null = null;

function parse(raw: string | null): PreparedOrder | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as PreparedOrder;
    if (parsed?.order?.reference && parsed.whatsappUrl) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function getPreparedSnapshot(): PreparedOrder | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(PREPARED_ORDER_KEY);
  if (raw === cachedRaw) return cached;
  cachedRaw = raw;
  cached = parse(raw);
  return cached;
}

export function getPreparedServerSnapshot(): PreparedOrder | null {
  return null;
}

export function subscribePrepared(onStoreChange: () => void): () => void {
  window.addEventListener(EVENT, onStoreChange);
  return () => window.removeEventListener(EVENT, onStoreChange);
}

export function writePrepared(value: PreparedOrder | null): void {
  if (value) {
    const raw = JSON.stringify(value);
    window.sessionStorage.setItem(PREPARED_ORDER_KEY, raw);
    cachedRaw = raw;
    cached = value;
  } else {
    window.sessionStorage.removeItem(PREPARED_ORDER_KEY);
    cachedRaw = null;
    cached = null;
  }
  window.dispatchEvent(new Event(EVENT));
}
