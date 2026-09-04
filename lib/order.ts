import { formatPrice } from "@/lib/format";
import { normalizePhoneDisplay } from "@/lib/phone";
import type { CheckoutFormValues } from "@/lib/validation";
import type { CartItem, DeliveryAddress, Order, OrderItem } from "@/types/order";

const REFERENCE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateReferencePart(
  length = 4,
  randomValues: () => Uint8Array = defaultRandom,
): string {
  const bytes = randomValues();
  let result = "";
  for (let index = 0; index < length; index += 1) {
    const byte = bytes[index % bytes.length] ?? 0;
    result += REFERENCE_ALPHABET[byte % REFERENCE_ALPHABET.length];
  }
  return result;
}

function defaultRandom(): Uint8Array {
  const bytes = new Uint8Array(8);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
    return bytes;
  }
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
  return bytes;
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/** Client-generated order reference. Not a database order ID. */
export function createOrderReference(
  date: Date = new Date(),
  randomPart?: string,
): string {
  const stamp = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
  return `OBL-${stamp}-${randomPart ?? generateReferencePart()}`;
}

export function cartItemsToOrderItems(items: CartItem[]): OrderItem[] {
  return items.map((item) => ({
    productId: item.productId,
    name: item.name,
    size: item.size,
    type: item.type,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    lineTotal: item.unitPrice * item.quantity,
  }));
}

function compact(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function buildDeliveryAddress(
  values: CheckoutFormValues,
): DeliveryAddress | undefined {
  if (values.fulfillment !== "delivery") return undefined;

  return {
    county: values.county?.trim() ?? "",
    city: values.city?.trim() ?? "",
    street: values.street?.trim() ?? "",
    building: compact(values.building),
    staircase: compact(values.staircase),
    floor: compact(values.floor),
    apartment: compact(values.apartment),
    postalCode: compact(values.postalCode),
  };
}

export function formatDeliveryAddress(address: DeliveryAddress): string {
  const line = [
    address.street,
    address.building ? `Bl. ${address.building}` : null,
    address.staircase ? `Sc. ${address.staircase}` : null,
    address.floor ? `Et. ${address.floor}` : null,
    address.apartment ? `Ap. ${address.apartment}` : null,
  ]
    .filter(Boolean)
    .join(", ");

  const locality = [address.city, address.county].filter(Boolean).join(", ");
  const postal = address.postalCode ? ` ${address.postalCode}` : "";
  return [line, `${locality}${postal}`].filter(Boolean).join("\n");
}

export function buildOrder(input: {
  items: CartItem[];
  values: CheckoutFormValues;
  reference?: string;
  createdAt?: string;
}): Order {
  const items = cartItemsToOrderItems(input.items);
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const email = compact(input.values.email);
  const notes = compact(input.values.notes);
  const address = buildDeliveryAddress(input.values);

  return {
    reference: input.reference ?? createOrderReference(),
    createdAt: input.createdAt ?? new Date().toISOString(),
    items,
    subtotal,
    currency: "RON",
    fulfillment: address ? { type: "delivery", address } : { type: "pickup" },
    customer: {
      firstName: input.values.firstName.trim(),
      lastName: input.values.lastName.trim(),
      phone: normalizePhoneDisplay(input.values.phone),
      email,
    },
    notes,
  };
}

export function summarizeOrderItems(order: Order): string {
  return order.items
    .map((item, index) => {
      const variant = [item.size, item.type].filter(Boolean).join(" • ");
      const variantLine = variant ? `\n${variant}` : "";
      return `${index + 1}. ${item.name}${variantLine}\n${item.quantity} x ${formatPrice(item.unitPrice)} = ${formatPrice(item.lineTotal)}`;
    })
    .join("\n\n");
}

export function customerFullName(order: Order): string {
  return `${order.customer.firstName} ${order.customer.lastName}`.trim();
}
