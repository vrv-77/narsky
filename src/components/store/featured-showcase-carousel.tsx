"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatClp } from "@/lib/utils";
import type { ProductCard } from "@/types/domain";

type FeaturedShowcaseCarouselProps = {
  products: ProductCard[];
};

export function FeaturedShowcaseCarousel({
  products,
}: FeaturedShowcaseCarouselProps) {
  const slides = useMemo(() => products.slice(0, 5), [products]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 4800);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return null;
  }

  const activeProduct = slides[activeIndex];
  const hasDiscount =
    activeProduct.compareAtPrice !== null &&
    activeProduct.compareAtPrice > activeProduct.price;

  return (
    <Card className="neon-panel overflow-hidden rounded-[1.8rem] border border-white/10 p-4 sm:p-5">
      <div className="grid gap-5 xl:grid-cols-[1.38fr_0.62fr]">
        <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,79,216,0.18),rgba(52,215,255,0.08))]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,79,216,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(52,215,255,0.12),transparent_28%)]" />

          <div className="relative p-5 lg:p-7">
            <div className="relative h-[270px] overflow-hidden rounded-[1.3rem] border border-white/10 bg-[rgba(8,12,32,0.45)] sm:h-[340px] lg:h-[390px]">
              {activeProduct.primaryImage ? (
                <Image
                  src={activeProduct.primaryImage}
                  alt={activeProduct.name}
                  fill
                  className="object-cover object-center"
                />
              ) : null}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,transparent,rgba(5,8,20,0.9))]" />
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                {activeProduct.isNew ? <Badge>Nuevo</Badge> : null}
                {activeProduct.isFeatured ? (
                  <Badge className="bg-fuchsia-100 text-fuchsia-900">Top</Badge>
                ) : null}
                {hasDiscount ? (
                  <Badge className="bg-amber-100 text-amber-900">Oferta</Badge>
                ) : null}
              </div>
            </div>

            <div className="mt-5 flex min-h-[10.5rem] flex-col justify-end">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--secondary)]">
                Carrusel destacado
              </p>
              <h3 className="mt-3 font-serif text-3xl text-white sm:text-4xl">
                {activeProduct.name}
              </h3>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[rgba(240,243,255,0.82)]">
                {activeProduct.categoryName ?? "Colección Narsky"} con estilo
                anime, gamer y presencia visual para destacar la vitrina.
              </p>

              <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex items-end gap-3">
                  <p className="text-2xl font-semibold text-white">
                    {formatClp(activeProduct.price)}
                  </p>
                  {hasDiscount ? (
                    <p className="text-sm text-[var(--muted)] line-through">
                      {formatClp(activeProduct.compareAtPrice!)}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-3">
                  <AddToCartButton
                    className="min-w-[10rem]"
                    product={{
                      id: activeProduct.id,
                      slug: activeProduct.slug,
                      name: activeProduct.name,
                      price: activeProduct.price,
                      primaryImage: activeProduct.primaryImage,
                      stock: activeProduct.stock,
                    }}
                  />
                  <Link
                    href={`/productos/${activeProduct.slug}`}
                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/7 px-5 py-3 text-sm font-semibold text-white"
                  >
                    Ver detalle
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          {slides.map((product, index) => {
            const selected = index === activeIndex;

            return (
              <button
                key={product.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`group flex items-center gap-3 rounded-[1.3rem] border p-3 text-left ${
                  selected
                    ? "border-[rgba(255,79,216,0.35)] bg-[rgba(255,79,216,0.09)] shadow-[0_0_22px_rgba(255,79,216,0.12)]"
                    : "border-white/10 bg-white/5 hover:bg-white/8"
                }`}
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[1rem] border border-white/10 bg-[rgba(9,13,34,0.7)]">
                  {product.primaryImage ? (
                    <Image
                      src={product.primaryImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {product.name}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                    {product.categoryName ?? "Narsky"}
                  </p>
                  <p className="mt-2 text-sm text-[var(--secondary)]">
                    {formatClp(product.price)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {slides.length > 1 ? (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {slides.map((product, index) => (
              <button
                key={product.id}
                type="button"
                aria-label={`Ir al slide ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === activeIndex
                    ? "w-10 bg-[linear-gradient(90deg,var(--primary),var(--secondary))]"
                    : "w-2.5 bg-white/18"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Anterior"
              onClick={() =>
                setActiveIndex((current) =>
                  current === 0 ? slides.length - 1 : current - 1,
                )
              }
              className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Siguiente"
              onClick={() =>
                setActiveIndex((current) => (current + 1) % slides.length)
              }
              className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
