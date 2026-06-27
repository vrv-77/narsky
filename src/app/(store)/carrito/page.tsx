import Image from "next/image";
import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { Card } from "@/components/ui/card";
import { formatClp } from "@/lib/utils";
import { getCartPreviewSnapshot } from "@/services/storefront";

export default async function CartPage() {
  const cart = await getCartPreviewSnapshot();

  if (!cart) {
    return (
      <div className="app-shell py-10">
        <EmptyState
          eyebrow="Carrito"
          title="Tu carrito estara aqui"
          description="Cuando agregues tus figuras y articulos favoritos, aqui podras revisar tu seleccion antes de finalizar la compra."
        />
      </div>
    );
  }

  return (
    <div className="app-shell space-y-10 py-10">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--secondary)]">
          Carrito de ejemplo
        </p>
        <h1 className="mt-3 font-serif text-5xl text-[var(--foreground)]">
          Asi podria verse una compra en Narsky
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)]">
          Este carrito de muestra desaparecera automaticamente cuando publiquemos
          el catalogo definitivo de Narsky.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          {cart.items.map((item) => (
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
                  Cantidad: {item.quantity}
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
                <p className="text-sm text-[var(--muted)]">
                  {formatClp(item.unitPrice)} c/u
                </p>
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
                {formatClp(cart.subtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--muted)]">Despacho</span>
              <span className="font-medium text-[var(--foreground)]">
                {cart.shipping === 0 ? "Gratis" : formatClp(cart.shipping)}
              </span>
            </div>
            <div className="border-t border-black/8 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-[var(--foreground)]">
                  Total
                </span>
                <span className="text-xl font-semibold text-[var(--foreground)]">
                  {formatClp(cart.total)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[calc(var(--radius)-0.2rem)] bg-[color-mix(in_srgb,var(--accent)_16%,white)] p-4 text-sm leading-7 text-[var(--foreground)]">
            Aqui veras el resumen completo de tu compra con envio, descuentos y el
            total final antes de pagar.
          </div>
        </Card>
      </div>
    </div>
  );
}
