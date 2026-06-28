import Link from "next/link";

import { AlertTriangle, Package, ShoppingCart, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { AdminProductRecord } from "@/services/admin-catalog";

type AdminOverviewProps = {
  configured: boolean;
  metrics: {
    totalProducts: number;
    featuredProducts: number;
    lowStockProducts: number;
    outOfStockProducts: number;
    categories: number;
  };
  recentProducts: AdminProductRecord[];
};

export function AdminOverview({
  configured,
  metrics,
  recentProducts,
}: AdminOverviewProps) {
  const cards = [
    {
      label: "Productos cargados",
      value: metrics.totalProducts.toString(),
      detail: configured
        ? "Lectura activa desde Supabase."
        : "Mostrando catálogo demo para revisión.",
      icon: Package,
    },
    {
      label: "Productos destacados",
      value: metrics.featuredProducts.toString(),
      detail: "Ayuda a revisar vitrina y selección principal.",
      icon: Wallet,
    },
    {
      label: "Stock bajo",
      value: metrics.lowStockProducts.toString(),
      detail: "Productos con 5 unidades o menos.",
      icon: AlertTriangle,
    },
    {
      label: "Categorías activas",
      value: metrics.categories.toString(),
      detail: "Base lista para escalar el catálogo.",
      icon: ShoppingCart,
    },
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--secondary)]">
            Base operativa
          </p>
          <h1 className="mt-3 font-serif text-4xl text-[var(--foreground)]">
            Panel administrativo
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[rgba(208,218,255,0.82)]">
            El panel ya permite revisar catálogo, abrir fichas administrativas y
            validar cómo se está viendo la operación antes de conectar edición,
            pedidos y automatizaciones.
          </p>
        </div>

        <Link href="/admin/productos">
          <Button>Ir a productos</Button>
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="border-white/10 p-5">
              <div className="flex items-center justify-between">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-[rgba(230,215,255,0.9)] text-[var(--secondary)] shadow-[0_0_18px_rgba(52,215,255,0.18)]">
                  <Icon className="size-5" />
                </div>
                <p className="text-4xl font-semibold text-[var(--foreground)]">
                  {metric.value}
                </p>
              </div>
              <p className="mt-5 text-sm font-semibold text-[var(--foreground)]">
                {metric.label}
              </p>
              <p className="mt-2 text-sm leading-6 text-[rgba(196,209,248,0.72)]">
                {metric.detail}
              </p>
            </Card>
          );
        })}
      </div>

      <Card className="border-white/10 p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--secondary)]">
              Revisión rápida
            </p>
            <h2 className="mt-2 font-serif text-3xl text-[var(--foreground)]">
              Últimos productos visibles
            </h2>
          </div>
          <Link href="/admin/productos">
            <Button variant="secondary">Ver catálogo</Button>
          </Link>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {recentProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-[1.3rem] border border-white/10 bg-[linear-gradient(180deg,rgba(24,31,72,0.92)_0%,rgba(13,19,48,0.96)_100%)] p-4 shadow-[0_14px_34px_rgba(0,0,0,0.24)]"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-[rgba(162,180,230,0.72)]">
                {product.categoryName ?? "Sin categoría"}
              </p>
              <h3 className="mt-2 font-serif text-2xl text-[var(--foreground)]">
                {product.name}
              </h3>
              <p className="mt-2 text-sm text-[rgba(208,218,255,0.82)]">
                {product.statusLabel}
              </p>
              <p className="mt-4 text-sm text-[rgba(162,180,230,0.76)]">
                Stock:{" "}
                <span className="font-medium text-[var(--foreground)]">
                  {product.stock}
                </span>
              </p>
              <Link href={`/admin/productos/${product.id}`} className="mt-4 inline-flex">
                <Button className="px-4 py-2">Abrir ficha</Button>
              </Link>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
