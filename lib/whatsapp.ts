import { formatPrice } from "@/lib/format";
import { customerFullName, formatDeliveryAddress } from "@/lib/order";
import type { Order } from "@/types/order";

export function buildWhatsAppUrl(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildContactWhatsAppUrl(
  phone: string,
  message = "Bună ziua! Aș dori câteva detalii despre produsele OBL Fishing.",
): string {
  return buildWhatsAppUrl(phone, message);
}

export function buildOrderWhatsAppMessage(order: Order): string {
  const lines = [
    "Bună ziua! Doresc să plasez următoarea comandă OBL Fishing:",
    "",
    `Comanda: ${order.reference}`,
    "",
  ];

  order.items.forEach((item, index) => {
    const variant = [item.size, item.type].filter(Boolean).join(" • ");
    lines.push(`${index + 1}. ${item.name}`);
    if (variant) lines.push(variant);
    lines.push(
      `${item.quantity} x ${formatPrice(item.unitPrice)} = ${formatPrice(item.lineTotal)}`,
    );
    lines.push("");
  });

  lines.push(`Total produse: ${formatPrice(order.subtotal)}`);
  lines.push("");

  if (order.fulfillment.type === "pickup") {
    lines.push("Ridicare personală:");
    lines.push(customerFullName(order));
    lines.push(order.customer.phone);
    if (order.customer.email) lines.push(order.customer.email);
  } else {
    lines.push("Livrare:");
    lines.push(customerFullName(order));
    lines.push(order.customer.phone);
    if (order.customer.email) lines.push(order.customer.email);
    lines.push(formatDeliveryAddress(order.fulfillment.address));
  }

  if (order.notes) {
    lines.push("");
    lines.push("Observații:");
    lines.push(order.notes);
  }

  lines.push("");
  lines.push("Mulțumesc!");

  return lines.join("\n");
}

export function buildOrderWhatsAppUrl(phone: string, order: Order): string {
  return buildWhatsAppUrl(phone, buildOrderWhatsAppMessage(order));
}
