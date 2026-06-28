import Image from "next/image";
import { notFound } from "next/navigation";

import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatClp } from "@/lib/utils";
import { getProductBySlug } from "@/services/storefront";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const images = Array.isArray(product.product_images)
    ? (product.product_images as Array<Record<string, unknown>>)
    : [];
  const primaryImage =
    images.find((image) => image.is_primary)?.image_url?.toString() ??
    images[0]?.image_url?.toString() ??
    null;
  const hasDiscount =
    product.compare_at_price &&
    Number(product.compare_at_price) > Number(product.price);
  const productForCart = {
    id: product.id?.toString() ?? "",
    slug,
    name: product.name?.toString() ?? "Producto",
    price: Number(product.price ?? 0),
    primaryImage,
    stock: Number(product.stock ?? 0),
  };

  return (
    <div className="app-shell py-10">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="relative flex aspect-square items-center justify-center overflow-hidden p-6">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={product.name?.toString() || "Producto"}
              fill
              className="rounded-[calc(var(--radius)-0.25rem)] object-cover p-6"
            />
          ) : (
            <div className="text-sm text-[var(--muted)]">Imagen pendiente</div>
          )}
        </Card>

        <Card className="p-8">
          <div className="flex flex-wrap gap-2">
            {product.stock && Number(product.stock) > 0 ? (
              <Badge>Disponible</Badge>
            ) : (
              <Badge className="bg-rose-100 text-rose-900">Agotado</Badge>
            )}
            {hasDiscount ? (
              <Badge className="bg-amber-100 text-amber-900">Oferta</Badge>
            ) : null}
          </div>

          <h1 className="mt-5 font-serif text-5xl text-[var(--foreground)]">
            {product.name?.toString()}
          </h1>
          <p className="mt-4 text-sm uppercase tracking-[0.18em] text-[var(--muted)]">
            SKU {product.sku?.toString() || "Sin SKU"}
          </p>
          <p className="mt-6 text-base leading-8 text-[rgba(240,243,255,0.82)]">
            {product.short_description?.toString() ||
              "Este producto aún no tiene descripción corta publicada."}
          </p>

          <div className="mt-8 flex items-end gap-4">
            <p className="text-3xl font-semibold text-[var(--foreground)]">
              {formatClp(Number(product.price ?? 0))}
            </p>
            {hasDiscount ? (
              <p className="text-lg text-[var(--muted)] line-through">
                {formatClp(Number(product.compare_at_price))}
              </p>
            ) : null}
          </div>

          <div className="mt-6">
            <AddToCartButton className="w-full sm:w-auto" product={productForCart} />
          </div>

          <div className="mt-8 rounded-[calc(var(--radius)-0.2rem)] border border-white/10 bg-[rgba(21,28,62,0.96)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <p className="text-sm font-semibold text-white">Descripción</p>
            <p className="mt-3 text-sm leading-7 text-[rgba(240,243,255,0.82)]">
              {product.description?.toString() ||
                "No hay descripción detallada publicada todavía."}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
