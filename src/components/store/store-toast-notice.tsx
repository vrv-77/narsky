"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, X } from "lucide-react";
import { useEffect } from "react";

import { useCart } from "@/components/store/cart-provider";
import { Button } from "@/components/ui/button";
import { formatClp } from "@/lib/utils";

export function StoreToastNotice() {
  const { lastAddedItem, isToastOpen, closeToast, openDrawer } = useCart();

  useEffect(() => {
    if (!isToastOpen) {
      return;
    }

    const timer = window.setTimeout(() => {
      closeToast();
    }, 2600);

    return () => window.clearTimeout(timer);
  }, [closeToast, isToastOpen]);

  if (!lastAddedItem) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-5 left-1/2 z-[60] w-[min(calc(100%-1.5rem),28rem)] -translate-x-1/2 transition duration-300 sm:left-auto sm:right-5 sm:w-[28rem] sm:translate-x-0 ${
        isToastOpen
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <div className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-[linear-gradient(180deg,rgba(18,24,58,0.98),rgba(8,12,28,0.98))] shadow-[0_20px_45px_rgba(0,0,0,0.35),0_0_22px_rgba(255,79,216,0.12)]">
        <div className="flex items-start gap-3 p-4">
          <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-[rgba(52,215,255,0.12)] text-[var(--secondary)]">
            <CheckCircle2 className="size-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white">
              Producto agregado al carrito
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[0.95rem] border border-white/10 bg-white/5">
                {lastAddedItem.image ? (
                  <Image
                    src={lastAddedItem.image}
                    alt={lastAddedItem.name}
                    fill
                    className="object-cover"
                  />
                ) : null}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {lastAddedItem.name}
                </p>
                <p className="mt-1 text-sm text-[var(--secondary)]">
                  {formatClp(lastAddedItem.unitPrice)}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                className="px-4 py-2"
                onClick={() => {
                  closeToast();
                  openDrawer();
                }}
              >
                Ver carrito
              </Button>
              <Link href={`/productos/${lastAddedItem.slug}`} onClick={closeToast}>
                <Button variant="secondary" className="px-4 py-2">
                  Ver producto
                </Button>
              </Link>
            </div>
          </div>

          <button
            type="button"
            aria-label="Cerrar aviso"
            onClick={closeToast}
            className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
