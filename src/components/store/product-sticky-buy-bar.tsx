"use client";

import Link from "next/link";

import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { formatClp } from "@/lib/utils";
import type { ProductCard } from "@/types/domain";

type ProductStickyBuyBarProps = {
  product: Pick<ProductCard, "id" | "slug" | "name" | "price" | "primaryImage" | "stock">;
};

export function ProductStickyBuyBar({ product }: ProductStickyBuyBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[linear-gradient(180deg,rgba(12,16,36,0.98),rgba(6,8,20,0.98))] px-4 py-3 shadow-[0_-14px_34px_rgba(0,0,0,0.28)] lg:hidden">
      <div className="mx-auto flex w-full max-w-[var(--content-max-width)] items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{product.name}</p>
          <p className="mt-1 text-sm text-[var(--secondary)]">
            {formatClp(product.price)}
          </p>
        </div>
        <Link
          href="/carrito"
          className="inline-flex shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/6 px-4 py-3 text-sm font-semibold text-white"
        >
          Carrito
        </Link>
        <AddToCartButton className="shrink-0 px-5" product={product} />
      </div>
    </div>
  );
}
