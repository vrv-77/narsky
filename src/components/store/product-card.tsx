"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useState } from "react";

import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatClp } from "@/lib/utils";
import type { ProductCard as ProductCardType } from "@/types/domain";

type ProductCardProps = {
  product: ProductCardType;
};

export function ProductCard({ product }: ProductCardProps) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const hasDiscount =
    product.compareAtPrice !== null && product.compareAtPrice > product.price;

  return (
    <>
      <Card className="group neon-panel neon-outline flex h-full flex-col overflow-hidden rounded-[1.5rem]">
        <div className="relative aspect-[4/3] overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,79,216,0.28),transparent_34%),linear-gradient(180deg,rgba(40,23,92,0.82),rgba(8,18,43,0.96))] sm:aspect-[5/4]">
        {product.primaryImage ? (
          <>
            <Image
              src={product.primaryImage}
              alt={product.name}
              fill
              className={`object-cover object-center transition duration-500 ${
                product.secondaryImage ? "group-hover:scale-[1.04]" : ""
              }`}
            />
            {product.secondaryImage ? (
              <Image
                src={product.secondaryImage}
                alt={`${product.name} vista alternativa`}
                fill
                className="object-cover object-center opacity-0 transition duration-500 group-hover:opacity-100"
              />
            ) : null}
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[var(--muted)]">
            Imagen pendiente
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(180deg,transparent,rgba(5,8,20,0.72))]" />
        <button
          type="button"
          onClick={() => setIsQuickViewOpen(true)}
          className="absolute right-3 top-3 rounded-full border border-white/10 bg-[rgba(8,12,28,0.78)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white opacity-100 shadow-[0_0_18px_rgba(255,79,216,0.12)] transition lg:opacity-0 lg:group-hover:opacity-100"
        >
          Vista rápida
        </button>
        </div>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="min-h-[8.2rem]">
          <div className="flex flex-wrap gap-2">
            {product.isNew ? <Badge>Nuevo</Badge> : null}
            {hasDiscount ? (
              <Badge className="bg-amber-100 text-amber-900">Oferta</Badge>
            ) : null}
          </div>
          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
            {product.categoryName || "Sin categoría"}
          </p>
          <h3 className="mt-2 font-serif text-[1.75rem] leading-tight text-[var(--foreground)] sm:text-2xl">
            {product.name}
          </h3>
        </div>

        <div className="mt-auto pt-4">
          <div className="flex items-end gap-3">
            <p className="text-lg font-semibold text-[var(--foreground)]">
              {formatClp(product.price)}
            </p>
            {hasDiscount ? (
              <p className="text-sm text-[var(--muted)] line-through">
                {formatClp(product.compareAtPrice!)}
              </p>
            ) : null}
          </div>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {product.stock > 0
              ? `${product.stock} unidades disponibles`
              : "Producto agotado"}
          </p>
          <div className="mt-5 flex items-center gap-3">
            <AddToCartButton className="flex-1" product={product} />
            <Link
              href={`/productos/${product.slug}`}
              className="inline-flex min-w-[4.5rem] items-center justify-center rounded-full border border-white/10 bg-white/6 px-4 py-3 text-sm font-semibold text-[var(--foreground)]"
            >
              Ver
            </Link>
          </div>
        </div>
        </div>
      </Card>
      {isQuickViewOpen ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(3,5,14,0.72)] p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-4xl overflow-hidden rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,20,48,0.98),rgba(7,10,24,0.98))] shadow-[0_24px_60px_rgba(0,0,0,0.42)]">
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--secondary)]">
                  Vista rápida
                </p>
                <p className="mt-1 font-serif text-3xl text-white">{product.name}</p>
              </div>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => setIsQuickViewOpen(false)}
                className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="grid gap-6 p-5 lg:grid-cols-[0.95fr_1.05fr] lg:p-6">
              <div className="relative min-h-[320px] overflow-hidden rounded-[1.35rem] border border-white/10 bg-[rgba(255,255,255,0.04)]">
                {product.primaryImage ? (
                  <Image
                    src={product.primaryImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : null}
              </div>

              <div className="flex flex-col">
                <div className="flex flex-wrap gap-2">
                  {product.isNew ? <Badge>Nuevo</Badge> : null}
                  {hasDiscount ? (
                    <Badge className="bg-amber-100 text-amber-900">Oferta</Badge>
                  ) : null}
                </div>
                <p className="mt-5 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  {product.categoryName || "Sin categoría"}
                </p>
                <p className="mt-4 text-sm leading-7 text-[rgba(240,243,255,0.82)]">
                  Una vista rápida del producto para explorar la colección sin salir
                  de la vitrina principal.
                </p>

                <div className="mt-auto pt-8">
                  <div className="flex items-end gap-3">
                    <p className="text-3xl font-semibold text-white">
                      {formatClp(product.price)}
                    </p>
                    {hasDiscount ? (
                      <p className="text-sm text-[var(--muted)] line-through">
                        {formatClp(product.compareAtPrice!)}
                      </p>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {product.stock > 0
                      ? `${product.stock} unidades disponibles`
                      : "Producto agotado"}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <AddToCartButton className="min-w-[10rem]" product={product} />
                    <Link
                      href={`/productos/${product.slug}`}
                      onClick={() => setIsQuickViewOpen(false)}
                      className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/6 px-5 py-3 text-sm font-semibold text-white"
                    >
                      Ver detalle
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
