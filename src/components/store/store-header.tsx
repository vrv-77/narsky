import Link from "next/link";
import { ShoppingBag, ShoppingCart } from "lucide-react";

import { storeNavigation } from "@/lib/navigation";

type StoreHeaderProps = {
  storeName: string;
};

export function StoreHeader({ storeName }: StoreHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-[color-mix(in_srgb,var(--background)_80%,white)]/90 backdrop-blur-xl">
      <div className="app-shell flex items-center justify-between gap-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-full bg-[var(--secondary)] text-white">
            <ShoppingBag className="size-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
              Figuras y arte artesanal
            </p>
            <p className="text-sm font-semibold text-[var(--foreground)]">
              {storeName}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {storeNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[var(--foreground)]/80 hover:text-[var(--foreground)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/carrito"
          className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm font-medium text-[var(--foreground)]"
        >
          <ShoppingCart className="size-4" />
          Carrito
        </Link>
      </div>
    </header>
  );
}
