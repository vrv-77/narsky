"use client";

import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/components/store/cart-provider";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatClp } from "@/lib/utils";

export function CartView() {
  const {
    items,
    subtotal,
    shipping,
    total,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="app-shell py-10">
        <EmptyState
          eyebrow="Carrito"
          title="Tu carrito esta vacio"
          description="Cuando agregues tus figuras y articulos favoritos, aqui podras revisar tu seleccion antes de finalizar la compra."
        />
      </div>
    );
  }

  return (
    <div className="app-shell space-y-10 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--secondary)]">
            Tu seleccion
          </p>
          <h1 className="mt-3 font-serif text-5xl text-[var(--foreground)]">
            Tu carrito Narsky
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)]">
            Revisa tus piezas favoritas, ajusta cantidades y confirma tu compra
            cuando quieras.
          </p>
        </div>

        <Button variant="secondary" onClick={clearCart}>
          Vaciar carrito
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          {items.map((item) => (
            <Card
              key={item.productId}
              className="grid gap-4 p-4 md:grid-cols-[120px_1fr_auto]"
            >
              <div className="relative aspect-square overflow-hidden rounded-[calc(var(--radius)-0.35rem)] bg-[color-mix(in_srgb,var(--primary)_9%,white)]">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : null}
              </div>

              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">
                  Seleccion Narsky
                </p>
                <h2 className="mt-2 font-serif text-2xl text-[var(--foreground)]">
                  {item.name}
                </h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {formatClp(item.unitPrice)} c/u
                </p>
                <Link
                  href={`/productos/${item.slug}`}
                  className="mt-3 inline-flex text-sm font-medium text-[var(--secondary)]"
                >
                  Ver detalle
                </Link>
              </div>

              <div className="flex flex-col items-start justify-between gap-4 md:items-end">
                <p className="text-lg font-semibold text-[var(--foreground)]">
                  {formatClp(item.unitPrice * item.quantity)}
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    className="px-3 py-2"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                  >
                    -
                  </Button>
                  <span className="min-w-8 text-center text-sm font-medium text-[var(--foreground)]">
                    {item.quantity}
                  </span>
                  <Button
                    variant="secondary"
                    className="px-3 py-2"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                  >
                    +
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  className="px-0 py-0 text-sm text-[var(--muted)] hover:bg-transparent"
                  onClick={() => removeItem(item.productId)}
                >
                  Quitar
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Card className="h-fit p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--secondary)]">
            Resumen
          </p>
          <h2 className="mt-3 font-serif text-3xl text-[var(--foreground)]">
            Total estimado
          </h2>

          <div className="mt-6 space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[var(--muted)]">Subtotal</span>
              <span className="font-medium text-[var(--foreground)]">
                {formatClp(subtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--muted)]">Despacho</span>
              <span className="font-medium text-[var(--foreground)]">
                {shipping === 0 ? "Gratis" : formatClp(shipping)}
              </span>
            </div>
            <div className="border-t border-black/8 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-[var(--foreground)]">
                  Total
                </span>
                <span className="text-xl font-semibold text-[var(--foreground)]">
                  {formatClp(total)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[calc(var(--radius)-0.2rem)] bg-[color-mix(in_srgb,var(--accent)_16%,white)] p-4 text-sm leading-7 text-[var(--foreground)]">
            Aqui veras el resumen completo de tu compra con envio y total final
            antes de pagar.
          </div>
        </Card>
      </div>
    </div>
  );
}
