import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <Card className="overflow-hidden">
      <div className="relative aspect-[4/5] bg-[color-mix(in_srgb,var(--primary)_9%,white)]">
        {product.primaryImage ? (
          <Image
            src={product.primaryImage}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[var(--muted)]">
            Imagen pendiente
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          {product.isNew ? <Badge>Nuevo</Badge> : null}
          {hasDiscount ? <Badge className="bg-amber-100 text-amber-900">Oferta</Badge> : null}
        </div>
        <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
          {product.categoryName || "Sin categoría"}
        </p>
        <h3 className="mt-2 font-serif text-2xl text-[var(--foreground)]">
          {product.name}
        </h3>
        <div className="mt-3 flex items-end gap-3">
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
        <div className="mt-5 flex gap-3">
          <Button className="flex-1" disabled={product.stock <= 0}>
            Agregar
          </Button>
          <Link
            href={`/productos/${product.slug}`}
            className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/80 px-4 py-3 text-sm font-semibold text-[var(--foreground)]"
          >
            Ver
          </Link>
        </div>
      </div>
    </Card>
  );
}
