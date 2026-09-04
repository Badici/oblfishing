import { describe, expect, it } from "vitest";
import { formatPrice } from "@/lib/format";
import {
  addItemToCart,
  cartItemCount,
  cartSubtotal,
  createLineKey,
  parseCartState,
  removeItem,
  serializeCartState,
  updateQuantity,
} from "@/lib/cart";
import { createOrderReference, buildOrder } from "@/lib/order";
import { buildFormSubmitPayload } from "@/lib/formsubmit";
import { buildOrderWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { isValidRoPhone } from "@/lib/phone";
import { checkoutSchema } from "@/lib/validation";
import { resolveUnitPrice } from "@/lib/catalogue";
import type { CartItem } from "@/types/order";
import type { Product } from "@/types/catalogue";

const sampleItem: Omit<CartItem, "lineKey"> = {
  productId: "obl-squid-strawberry",
  name: "OBL Squid & Strawberry",
  slug: "obl-squid-strawberry",
  imageSrc: "/products/mock/squid-strawberry-01.svg",
  imageAlt: "mock",
  size: "20mm",
  type: "solubile",
  unitPrice: 32,
  quantity: 1,
};

describe("formatPrice", () => {
  it("formats Romanian lei without storing a string price", () => {
    expect(formatPrice(32)).toBe("32 lei");
    expect(formatPrice(64)).toBe("64 lei");
    expect(formatPrice(105)).toBe("105 lei");
  });
});

describe("cart", () => {
  it("merges the same product and variant", () => {
    const once = addItemToCart([], sampleItem);
    const twice = addItemToCart(once, sampleItem);
    expect(twice).toHaveLength(1);
    expect(twice[0]?.quantity).toBe(2);
    expect(cartSubtotal(twice)).toBe(64);
    expect(cartItemCount(twice)).toBe(2);
  });

  it("keeps different variants on separate lines", () => {
    const first = addItemToCart([], sampleItem);
    const second = addItemToCart(first, { ...sampleItem, type: "tari" });
    expect(second).toHaveLength(2);
    expect(createLineKey("a", "16mm", "tari")).toBe("a::16mm::tari");
  });

  it("updates and removes lines", () => {
    const items = addItemToCart([], sampleItem);
    const key = items[0]?.lineKey ?? "";
    const updated = updateQuantity(items, key, 3);
    expect(updated[0]?.quantity).toBe(3);
    expect(removeItem(updated, key)).toHaveLength(0);
  });

  it("rejects malformed localStorage payloads", () => {
    expect(parseCartState("not-json")).toEqual([]);
    expect(parseCartState(JSON.stringify({ version: 1, items: [{ productId: "x" }] }))).toEqual([]);
    const valid = serializeCartState(addItemToCart([], sampleItem));
    expect(parseCartState(valid)).toHaveLength(1);
  });
});

describe("order reference", () => {
  it("uses OBL-YYYYMMDD-XXXX", () => {
    const date = new Date(2026, 8, 4);
    expect(createOrderReference(date, "A7K3")).toBe("OBL-20260904-A7K3");
  });
});

describe("phone", () => {
  it("accepts common Romanian formats", () => {
    expect(isValidRoPhone("0728 241 412")).toBe(true);
    expect(isValidRoPhone("0728241412")).toBe(true);
    expect(isValidRoPhone("+40 728 241 412")).toBe(true);
    expect(isValidRoPhone("123")).toBe(false);
  });
});

describe("checkout schema", () => {
  it("requires address only for delivery", () => {
    const pickup = checkoutSchema.safeParse({
      fulfillment: "pickup",
      lastName: "Badici",
      firstName: "Rares",
      phone: "0728241412",
      email: "",
    });
    expect(pickup.success).toBe(true);

    const delivery = checkoutSchema.safeParse({
      fulfillment: "delivery",
      lastName: "Badici",
      firstName: "Rares",
      phone: "0728241412",
      email: "",
    });
    expect(delivery.success).toBe(false);
  });
});

describe("whatsapp and formsubmit payload", () => {
  const order = buildOrder({
    items: addItemToCart([], sampleItem),
    values: {
      fulfillment: "pickup",
      lastName: "Badici",
      firstName: "Rares",
      phone: "0728 241 412",
      email: "",
      notes: "Dimineața",
      county: "",
      city: "",
      street: "",
      building: "",
      staircase: "",
      floor: "",
      apartment: "",
      postalCode: "",
    },
    reference: "OBL-20260904-A7K3",
  });

  it("builds a short readable WhatsApp message", () => {
    const message = buildOrderWhatsAppMessage(order);
    expect(message).toContain("OBL-20260904-A7K3");
    expect(message).toContain("Squid & Strawberry");
    expect(message).toContain("Ridicare personală");
    expect(buildWhatsAppUrl("40728241412", message)).toContain("https://wa.me/40728241412?text=");
    expect(buildWhatsAppUrl("40728241412", message)).not.toContain("+");
  });

  it("builds an email payload with the client reference", () => {
    const payload = buildFormSubmitPayload(order);
    expect(payload._subject).toBe("Comandă nouă OBL Fishing - OBL-20260904-A7K3");
    expect(payload.order_reference).toBe("OBL-20260904-A7K3");
    expect(payload.customer_name).toBe("Rares Badici");
    expect(payload.subtotal).toBe("32 lei");
  });
});

describe("variant pricing", () => {
  it("adds price deltas when present", () => {
    const product = {
      basePrice: 32,
      options: {
        sizes: [{ value: "24mm", label: "24 mm", priceDelta: 2 }],
        types: [{ value: "tari", label: "Tari", priceDelta: 0 }],
      },
    } as Product;
    expect(resolveUnitPrice(product, "24mm", "tari")).toBe(34);
  });
});
