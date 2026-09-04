import { FORMSUBMIT_ENDPOINT } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import { customerFullName, formatDeliveryAddress, summarizeOrderItems } from "@/lib/order";
import type { Order } from "@/types/order";

export interface FormSubmitPayload {
  _subject: string;
  _template: "table";
  _captcha: "false";
  _replyto?: string;
  order_reference: string;
  customer_name: string;
  phone: string;
  email: string;
  delivery_method: string;
  address: string;
  products: string;
  subtotal: string;
  observations: string;
}

export function buildFormSubmitPayload(order: Order): FormSubmitPayload {
  const deliveryMethod =
    order.fulfillment.type === "pickup" ? "Ridicare personală" : "Livrare";
  const address =
    order.fulfillment.type === "delivery"
      ? formatDeliveryAddress(order.fulfillment.address)
      : "Ridicare personală — detaliile vor fi confirmate telefonic.";

  return {
    _subject: `Comandă nouă OBL Fishing - ${order.reference}`,
    _template: "table",
    _captcha: "false",
    _replyto: order.customer.email,
    order_reference: order.reference,
    customer_name: customerFullName(order),
    phone: order.customer.phone,
    email: order.customer.email ?? "",
    delivery_method: deliveryMethod,
    address,
    products: summarizeOrderItems(order),
    subtotal: formatPrice(order.subtotal, order.currency),
    observations: order.notes ?? "",
  };
}

export interface FormSubmitResult {
  ok: boolean;
  error?: string;
}

export async function submitOrderEmail(
  order: Order,
  fetchImpl: typeof fetch = fetch,
): Promise<FormSubmitResult> {
  try {
    const response = await fetchImpl(FORMSUBMIT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(buildFormSubmitPayload(order)),
    });

    if (!response.ok) {
      return { ok: false, error: `HTTP ${response.status}` };
    }

    const data: unknown = await response.json().catch(() => null);
    if (data && typeof data === "object" && "success" in data) {
      const success = (data as { success: unknown }).success;
      if (success === false || success === "false") {
        return { ok: false, error: "FormSubmit a respins trimiterea." };
      }
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Rețeaua nu a putut trimite copia pe email." };
  }
}
