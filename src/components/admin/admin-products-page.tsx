import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatClp } from "@/lib/utils";
import type { AdminProductRecord } from "@/services/admin-catalog";

type AdminProductsPageProps = {
  configured: boolean;
  products: AdminProductRecord[];
  categories: Array<{ id: string; name: string; slug: string }>;
  metrics: {
    totalProducts: number;
    featuredProducts: number;
    lowStockProducts: number;
    outOfStockProducts: number;
    newProducts: number;
    categories: number;
  };
  query: string;
  category: string;
  view: string;
};

export function AdminProductsPage({
  configured,
  products,
  categories,
  metrics,
  query,
  category,
  view,
}: AdminProductsPageProps) {
  const visibleProducts = products.filter((product) => {
    const matchesQuery =
      query.length === 0 ||
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.slug.toLowerCase().includes(query.toLowerCase());

    const matchesCategory =
      category.length === 0 || product.categoryName?.toLowerCase() === category;

    const matchesView =
      view === "all" ||
      (view === "featured" && product.isFeatured) ||
      (view === "new" && product.isNew) ||
      (view === "low-stock" && product.stock > 0 && product.stock <= 5) ||
      (view === "out-of-stock" && product.stock <= 0);

    return matchesQuery && matchesCategory && matchesView;
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--secondary)]">
            Control de catálogo
          </p>
          <h1 className="mt-3 font-serif text-4xl text-[var(--foreground)]">
            Productos
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[color:#53627f]">
            Ya puedes revisar el catálogo, confirmar estado, stock, precios e
            imágenes antes de conectar la edición persistente con Supabase.
          </p>
        </div>

        <Link href="/admin/productos/nuevo">
          <Button>Nuevo producto</Button>
        </Link>
      </div>

      <Card className="rounded-[1.6rem] border-[#e8d8c9] bg-[#fff9f3] p-4 text-sm text-[#725a45]">
        {configured
          ? "El panel está leyendo productos reales desde Supabase."
          : "El panel está mostrando productos demo para revisar diseño, estructura y flujo administrativo."}
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Productos totales" value={metrics.totalProducts.toString()} />
        <MetricCard label="Destacados" value={metrics.featuredProducts.toString()} />
        <MetricCard label="Stock bajo" value={metrics.lowStockProducts.toString()} />
        <MetricCard label="Sin stock" value={metrics.outOfStockProducts.toString()} />
      </div>

      <Card className="space-y-4 p-5">
        <form className="grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_220px_220px_auto]">
          <Input
            name="q"
            defaultValue={query}
            placeholder="Buscar por nombre o slug"
          />

          <select
            name="categoria"
            defaultValue={category}
            className="w-full rounded-2xl border bg-white/90 px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--secondary)]"
          >
            <option value="">Todas las categorías</option>
            {categories.map((item) => (
              <option key={item.id} value={item.name.toLowerCase()}>
                {item.name}
              </option>
            ))}
          </select>

          <select
            name="vista"
            defaultValue={view}
            className="w-full rounded-2xl border bg-white/90 px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--secondary)]"
          >
            <option value="all">Todas</option>
            <option value="featured">Destacados</option>
            <option value="new">Nuevos</option>
            <option value="low-stock">Stock bajo</option>
            <option value="out-of-stock">Sin stock</option>
          </select>

          <Button type="submit" className="w-full lg:w-auto">
            Filtrar
          </Button>
        </form>

        <div className="flex flex-wrap items-center gap-2 text-sm text-[#6a7897]">
          <span>{visibleProducts.length} productos visibles</span>
          <span>•</span>
          <span>{metrics.newProducts} marcados como nuevos</span>
          <span>•</span>
          <span>{metrics.categories} categorías activas</span>
        </div>
      </Card>

      <div className="grid gap-4">
        {visibleProducts.map((product) => (
          <Card
            key={product.id}
            className="grid gap-4 p-4 lg:grid-cols-[112px_minmax(0,1fr)_180px_180px]"
          >
            <div className="relative aspect-square overflow-hidden rounded-[1.2rem] border border-black/5 bg-[#f6efe8]">
              {product.primaryImage ? (
                <Image
                  src={product.primaryImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-[#7f8aa5]">
                  Sin imagen
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                {product.isNew ? <Badge>Nuevo</Badge> : null}
                {product.isFeatured ? (
                  <Badge className="bg-fuchsia-100 text-fuchsia-900">Destacado</Badge>
                ) : null}
                <Badge className="bg-slate-100 text-slate-900">
                  {product.statusLabel}
                </Badge>
              </div>

              <h2 className="mt-3 font-serif text-2xl text-[var(--foreground)]">
                {product.name}
              </h2>
              <p className="mt-1 text-sm text-[#6a7897]">{product.slug}</p>
              <p className="mt-2 text-sm text-[#53627f]">
                {product.categoryName ?? "Sin categoría"}
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <p className="text-[#6a7897]">Precio</p>
              <p className="text-lg font-semibold text-[var(--foreground)]">
                {formatClp(product.price)}
              </p>
              <p className="text-[#6a7897]">
                {product.compareAtPrice
                  ? `Antes ${formatClp(product.compareAtPrice)}`
                  : "Sin precio anterior"}
              </p>
            </div>

            <div className="flex flex-col justify-between gap-3">
              <div>
                <p className="text-sm text-[#6a7897]">Stock</p>
                <p className="mt-1 text-lg font-semibold text-[var(--foreground)]">
                  {product.stock}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link href={`/admin/productos/${product.id}`}>
                  <Button className="px-4 py-2">Gestionar</Button>
                </Link>
                <Link href={`/productos/${product.slug}`} target="_blank">
                  <Button variant="secondary" className="px-4 py-2">
                    Ver tienda
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}

        {visibleProducts.length === 0 ? (
          <Card className="p-8 text-center text-[#6a7897]">
            No hay productos que coincidan con ese filtro.
          </Card>
        ) : null}
      </div>
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-[#6a7897]">{label}</p>
      <p className="mt-3 text-4xl font-semibold text-[var(--foreground)]">{value}</p>
    </Card>
  );
}
