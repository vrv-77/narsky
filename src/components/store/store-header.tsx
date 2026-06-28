"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";

import { StoreCartButton } from "@/components/store/store-cart-button";
import { storeNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import type { CategoryCard } from "@/types/domain";

type StoreHeaderProps = {
  storeName: string;
  categories: CategoryCard[];
};

export function StoreHeader({ storeName, categories }: StoreHeaderProps) {
  const pathname = usePathname();
  const primaryItems = storeNavigation.filter((item) => item.label !== "Contacto");
  const contactItem = storeNavigation.find((item) => item.label === "Contacto");

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-black/95 backdrop-blur-xl">
      <div className="app-shell flex flex-wrap items-center gap-5 py-4 xl:flex-nowrap">
        <Link href="/" className="flex shrink-0 items-center gap-4">
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
              width={240}
              height={58}
              className="h-9 w-auto md:h-10"
            />
          </div>
        </Link>

        <nav className="ml-4 hidden shrink-0 items-center gap-8 lg:flex xl:ml-10">
          {primaryItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative pb-2 text-base font-medium transition hover:text-white",
                pathname === item.href
                  ? "text-white after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-[linear-gradient(90deg,#ff5ddc_0%,#8f67ff_48%,#39d7ff_100%)] after:shadow-[0_0_18px_rgba(255,93,220,0.45)]"
                  : "text-[var(--foreground)]/78",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form
          action="/productos"
          method="get"
          className="grid min-w-[320px] flex-1 gap-3 p-1 md:ml-6 md:grid-cols-[190px_minmax(240px,1fr)_auto] xl:ml-10"
        >
          <label className="sr-only" htmlFor="header-categoria">
            Categoría
          </label>
          <select
            id="header-categoria"
            name="categoria"
            defaultValue=""
            style={{ colorScheme: "dark" }}
            className="h-12 rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] px-4 text-base text-white outline-none"
          >
            <option value="" style={{ backgroundColor: "#171b3c", color: "#ffffff" }}>
              Todas
            </option>
            {categories.map((category) => (
              <option
                key={category.id}
                value={category.slug}
                style={{ backgroundColor: "#171b3c", color: "#ffffff" }}
              >
                {category.name}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="header-producto">
            Producto en stock
          </label>
          <input
            id="header-producto"
            type="text"
            name="q"
            placeholder="Busca por nombre"
            className="h-12 rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] px-4 text-base text-white outline-none placeholder:text-[var(--muted)]"
          />

          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(90deg,var(--primary),#ff84e7)] px-6 text-base font-semibold text-white shadow-[0_0_24px_rgba(255,79,216,0.28)]"
          >
            <Search className="size-4" />
            Buscar
          </button>
        </form>

        <div className="hidden shrink-0 items-center gap-6 lg:flex">
          {contactItem ? (
            <Link
              href={contactItem.href}
              className={cn(
                "relative pb-2 text-base font-medium transition hover:text-white",
                pathname === contactItem.href
                  ? "text-white after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-[linear-gradient(90deg,#ff5ddc_0%,#8f67ff_48%,#39d7ff_100%)] after:shadow-[0_0_18px_rgba(255,93,220,0.45)]"
                  : "text-[var(--foreground)]/78",
              )}
            >
              {contactItem.label}
            </Link>
          ) : null}

          <StoreCartButton />
        </div>

        <div className="lg:hidden">
          <StoreCartButton />
        </div>
      </div>
    </header>
  );
}
