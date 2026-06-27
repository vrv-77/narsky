import Image from "next/image";
import Link from "next/link";

import { StoreCartButton } from "@/components/store/store-cart-button";
import { storeNavigation } from "@/lib/navigation";

type StoreHeaderProps = {
  storeName: string;
};

export function StoreHeader({ storeName }: StoreHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-black/95 backdrop-blur-xl">
      <div className="app-shell flex items-center justify-between gap-4 py-4">
        <Link href="/" className="flex items-center gap-4">
          <Image
            src="/narsky-icon.svg"
            alt={`${storeName} icono`}
            width={56}
            height={56}
            className="size-14 rounded-full"
          />
          <div className="flex flex-col gap-1">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
              Anime, gamer y kawaii
            </p>
            <Image
              src="/narsky-wordmark.svg"
              alt={`${storeName} nombre`}
              width={220}
              height={64}
              className="h-10 w-auto"
            />
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {storeNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[var(--foreground)]/78 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <StoreCartButton />
      </div>
    </header>
  );
}
