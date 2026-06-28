"use client";

import { ShoppingCart } from "lucide-react";

import { useCart } from "@/components/store/cart-provider";

export function StoreCartButton() {
  const { itemCount, openDrawer } = useCart();

  return (
    <button
      type="button"
      onClick={openDrawer}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-medium text-[var(--foreground)] shadow-[0_0_20px_rgba(52,215,255,0.08)]"
    >
      <div className="relative">
        <ShoppingCart className="size-4" />
        {itemCount > 0 ? (
          <span className="absolute -right-2 -top-2 inline-flex min-w-5 items-center justify-center rounded-full bg-[var(--primary)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--primary-contrast)]">
            {itemCount}
          </span>
        ) : null}
      </div>
      Carrito
    </button>
  );
}
