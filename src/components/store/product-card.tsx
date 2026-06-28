import Image from "next/image";
import Link from "next/link";

import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatClp } from "@/lib/utils";
import type { ProductCard as ProductCardType } from "@/types/domain";

type ProductCardProps = {
  product: ProductCardType;
};

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount =
    product.compareAtPrice !== null && product.compareAtPrice > product.price;

  return (
    <Card className="neon-panel neon-outline flex h-full flex-col overflow-hidden rounded-[1.5rem]">
      <div className="relative aspect-[4/3] bg-[radial-gradient(circle_at_top,rgba(255,79,216,0.28),transparent_34%),linear-gradient(180deg,rgba(40,23,92,0.82),rgba(8,18,43,0.96))] sm:aspect-[5/4]">
        {product.primaryImage ? (
          <Image
            src={product.primaryImage}
            alt={product.name}
            fill
            className="object-cover object-center"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[var(--muted)]">
            Imagen pendiente
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex flex-wrap gap-2">
          {product.isNew ? <Badge>Nuevo</Badge> : null}
          {hasDiscount ? <Badge className="bg-amber-100 text-amber-900">Oferta</Badge> : null}
        </div>
        <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
          {product.categoryName || "Sin categoría"}
        </p>
        <h3 className="mt-2 font-serif text-[1.75rem] leading-tight text-[var(--foreground)] sm:text-2xl">
          {product.name}
        </h3>
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
            {product.stock > 0 ? `${product.stock} unidades disponibles` : "Producto agotado"}
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
  );
}
