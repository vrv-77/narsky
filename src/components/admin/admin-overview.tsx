import { AlertTriangle, Package, ShoppingCart, Wallet } from "lucide-react";

import { Card } from "@/components/ui/card";

const metrics = [
  {
    label: "Ventas confirmadas hoy",
    value: "0",
    detail: "Se reemplaza automáticamente por datos reales cuando existan órdenes pagadas.",
    icon: Wallet,
  },
  {
    label: "Órdenes pendientes",
    value: "0",
    detail: "El tablero nunca mostrará métricas simuladas.",
    icon: ShoppingCart,
  },
  {
    label: "Productos con stock bajo",
    value: "0",
    detail: "Se alimenta desde `inventory_movements`, `products` y reservas vigentes.",
    icon: AlertTriangle,
  },
  {
    label: "Catálogo activo",
    value: "0",
    detail: "Los productos aparecen cuando existan registros activos en Supabase.",
    icon: Package,
  },
];

export function AdminOverview() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--secondary)]">
          Base operativa
        </p>
        <h1 className="mt-3 font-serif text-4xl text-[var(--foreground)]">
          Panel preparado para datos reales
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)]">
          Esta primera entrega deja lista la base del e-commerce: arquitectura
          Next.js, autenticación administrativa, esquema SQL completo, RLS,
          buckets y layouts separados para tienda y backoffice.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--accent)_24%,white)] text-[var(--secondary)]">
                  <Icon className="size-5" />
                </div>
                <p className="text-4xl font-semibold text-[var(--foreground)]">
                  {metric.value}
                </p>
              </div>
              <p className="mt-5 text-sm font-semibold text-[var(--foreground)]">
                {metric.label}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                {metric.detail}
              </p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
