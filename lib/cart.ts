import { CART_VERSION, MAX_LINE_QUANTITY } from "@/lib/constants";
import { clamp } from "@/lib/utils";
import type { CartItem, CartState } from "@/types/order";

export function createLineKey(
  productId: string,
  size?: string,
  type?: string,
): string {
  return [productId, size ?? "", type ?? ""].join("::");
}

export function lineTotal(item: Pick<CartItem, "unitPrice" | "quantity">): number {
  return item.unitPrice * item.quantity;
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + lineTotal(item), 0);
}

export function cartItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function addItemToCart(
  items: CartItem[],
  incoming: Omit<CartItem, "lineKey">,
): CartItem[] {
  const lineKey = createLineKey(incoming.productId, incoming.size, incoming.type);
  const existing = items.find((item) => item.lineKey === lineKey);

  if (!existing) {
    return [
      ...items,
      {
        ...incoming,
        lineKey,
        quantity: clamp(incoming.quantity, 1, MAX_LINE_QUANTITY),
      },
    ];
  }

  return items.map((item) =>
    item.lineKey === lineKey
      ? {
          ...item,
          quantity: clamp(item.quantity + incoming.quantity, 1, MAX_LINE_QUANTITY),
          unitPrice: incoming.unitPrice,
          name: incoming.name,
        }
      : item,
  );
}

export function updateQuantity(
  items: CartItem[],
  lineKey: string,
  quantity: number,
): CartItem[] {
  if (quantity < 1) {
    return items.filter((item) => item.lineKey !== lineKey);
  }

  return items.map((item) =>
    item.lineKey === lineKey
      ? { ...item, quantity: clamp(quantity, 1, MAX_LINE_QUANTITY) }
      : item,
  );
}

export function removeItem(items: CartItem[], lineKey: string): CartItem[] {
  return items.filter((item) => item.lineKey !== lineKey);
}

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.lineKey === "string" &&
    typeof item.productId === "string" &&
    typeof item.name === "string" &&
    typeof item.slug === "string" &&
    typeof item.imageSrc === "string" &&
    typeof item.imageAlt === "string" &&
    typeof item.unitPrice === "number" &&
    Number.isFinite(item.unitPrice) &&
    item.unitPrice >= 0 &&
    typeof item.quantity === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0 &&
    (item.size === undefined || typeof item.size === "string") &&
    (item.type === undefined || typeof item.type === "string")
  );
}

export function parseCartState(raw: string | null): CartItem[] {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return [];
    const state = parsed as Partial<CartState>;
    if (state.version !== CART_VERSION || !Array.isArray(state.items)) return [];
    return state.items.filter(isCartItem).map((item) => ({
      ...item,
      quantity: clamp(item.quantity, 1, MAX_LINE_QUANTITY),
      lineKey: createLineKey(item.productId, item.size, item.type),
    }));
  } catch {
    return [];
  }
}

export function serializeCartState(items: CartItem[]): string {
  const state: CartState = { version: CART_VERSION, items };
  return JSON.stringify(state);
}
