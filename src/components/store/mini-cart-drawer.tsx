"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useEffect } from "react";

import { useCart } from "@/components/store/cart-provider";
import { Button } from "@/components/ui/button";
import { formatClp } from "@/lib/utils";

export function MiniCartDrawer() {
  const {
    items,
    subtotal,
    shipping,
    total,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
  } = useCart();

  useEffect(() => {
    if (!isDrawerOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDrawer();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeDrawer, isDrawerOpen]);

  return (
    <>
      <div
        aria-hidden={!isDrawerOpen}
        onClick={closeDrawer}
        className={`fixed inset-0 z-40 bg-[rgba(4,7,18,0.62)] backdrop-blur-[2px] transition ${
          isDrawerOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-[26rem] flex-col border-l border-white/10 bg-[linear-gradient(180deg,rgba(10,14,34,0.98),rgba(5,8,20,0.98))] shadow-[-20px_0_50px_rgba(0,0,0,0.45)] transition-transform duration-300 ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--secondary)]">
              Tu carrito
            </p>
            <h2 className="mt-1 font-serif text-3xl text-white">Narsky</h2>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {items.length === 0 ? (
            <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-[rgba(240,243,255,0.82)]">
              Tu carrito está vacío. Agrega una figura, accesorio o regalo para
              ver el resumen aquí.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.productId}
                className="rounded-[1.4rem] border border-white/10 bg-white/5 p-3"
              >
                <div className="flex gap-3">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[1rem] border border-white/10 bg-[rgba(255,255,255,0.04)]">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">
                      {item.name}
                    </p>
                    <p className="mt-1 text-sm text-[var(--secondary)]">
                      {formatClp(item.unitPrice)}
                    </p>
                    <Link
                      href={`/productos/${item.slug}`}
                      onClick={closeDrawer}
                      className="mt-2 inline-flex text-xs font-medium text-[var(--muted)]"
                    >
                      Ver detalle
                    </Link>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-[rgba(18,24,56,0.96)] text-white"
                    >
                      -
                    </button>
                    <span className="min-w-8 text-center text-sm font-semibold text-white">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-[rgba(18,24,56,0.96)] text-white"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="text-sm text-[rgba(240,243,255,0.72)] hover:text-white"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-white/8 px-5 py-5">
          <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-[rgba(240,243,255,0.82)]">
                <span>Subtotal</span>
                <span>{formatClp(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-[rgba(240,243,255,0.82)]">
                <span>Despacho</span>
                <span>{shipping === 0 ? "Gratis" : formatClp(shipping)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/8 pt-3 text-base font-semibold text-white">
                <span>Total</span>
                <span>{formatClp(total)}</span>
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              <Link href="/carrito" onClick={closeDrawer}>
                <Button className="w-full">Ir al carrito</Button>
              </Link>
              <Link href="/productos" onClick={closeDrawer}>
                <Button variant="secondary" className="w-full">
                  Seguir comprando
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
