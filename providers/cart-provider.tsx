"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  addItemToCart,
  cartItemCount,
  cartSubtotal,
  removeItem,
  updateQuantity,
} from "@/lib/cart";
import {
  getCartServerSnapshot,
  getCartSnapshot,
  subscribeCart,
  writeCart,
} from "@/lib/cart-store";
import { useMounted } from "@/hooks/use-mounted";
import type { CartItem } from "@/types/order";

interface AddItemInput {
  productId: string;
  name: string;
  slug: string;
  imageSrc: string;
  imageAlt: string;
  size?: string;
  type?: string;
  unitPrice: number;
  quantity?: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: AddItemInput) => void;
  removeItem: (lineKey: string) => void;
  updateQuantity: (lineKey: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toast: string | null;
  clearToast: () => void;
  hydrated: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getCartServerSnapshot,
  );
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const hydrated = useMounted();

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const addItem = useCallback((incoming: AddItemInput) => {
    writeCart(
      addItemToCart(getCartSnapshot(), {
        ...incoming,
        quantity: incoming.quantity ?? 1,
      }),
    );
    setToast("Produs adăugat în coș.");
  }, []);

  const removeLine = useCallback((lineKey: string) => {
    writeCart(removeItem(getCartSnapshot(), lineKey));
  }, []);

  const changeQuantity = useCallback((lineKey: string, quantity: number) => {
    writeCart(updateQuantity(getCartSnapshot(), lineKey, quantity));
  }, []);

  const clearCart = useCallback(() => writeCart([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem,
      removeItem: removeLine,
      updateQuantity: changeQuantity,
      clearCart,
      itemCount: cartItemCount(items),
      subtotal: cartSubtotal(items),
      isDrawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      toast,
      clearToast: () => setToast(null),
      hydrated,
    }),
    [
      addItem,
      changeQuantity,
      clearCart,
      hydrated,
      isDrawerOpen,
      items,
      removeLine,
      toast,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart trebuie folosit în interiorul CartProvider.");
  }
  return context;
}
