"use client";

import { useCart } from "@/providers/cart-provider";

export function useCartState() {
  return useCart();
}
