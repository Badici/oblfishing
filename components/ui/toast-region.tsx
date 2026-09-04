"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCart } from "@/providers/cart-provider";

export function ToastRegion() {
  const { toast } = useCart();
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[70] -translate-x-1/2 px-4" aria-live="polite">
      <AnimatePresence>
        {toast ? (
          <motion.p
            key={toast}
            initial={reduceMotion ? false : { y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto bg-ink px-4 py-3 text-sm text-paper shadow-soft"
          >
            {toast}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
