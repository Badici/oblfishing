export type FulfillmentType = "pickup" | "delivery";

export interface DeliveryAddress {
  county: string;
  city: string;
  street: string;
  building?: string;
  staircase?: string;
  floor?: string;
  apartment?: string;
  postalCode?: string;
}

export interface OrderCustomer {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  size?: string;
  type?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export type OrderFulfillment =
  | { type: "pickup" }
  | { type: "delivery"; address: DeliveryAddress };

export interface Order {
  /** Client-generated reference, not a database order ID. */
  reference: string;
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
  currency: "RON";
  fulfillment: OrderFulfillment;
  customer: OrderCustomer;
  notes?: string;
}

export interface CartItem {
  lineKey: string;
  productId: string;
  name: string;
  slug: string;
  imageSrc: string;
  imageAlt: string;
  size?: string;
  type?: string;
  unitPrice: number;
  quantity: number;
}

export interface CartState {
  version: 1;
  items: CartItem[];
}

export interface PreparedOrder {
  order: Order;
  whatsappUrl: string;
  emailSubmitted: boolean;
  emailError?: string;
}
