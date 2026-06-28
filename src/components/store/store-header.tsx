import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

import { StoreCartButton } from "@/components/store/store-cart-button";
import { storeNavigation } from "@/lib/navigation";
import type { CategoryCard } from "@/types/domain";

type StoreHeaderProps = {
  storeName: string;
  categories: CategoryCard[];
};

export function StoreHeader({ storeName, categories }: StoreHeaderProps) {
  const primaryItems = storeNavigation.filter((item) => item.label !== "Contacto");
  const contactItem = storeNavigation.find((item) => item.label === "Contacto");

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-black/95 backdrop-blur-xl">
      <div className="app-shell flex flex-wrap items-center gap-4 py-4 xl:flex-nowrap">
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

        <nav className="hidden shrink-0 items-center gap-6 lg:flex">
          {primaryItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[var(--foreground)]/78 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form
          action="/productos"
          method="get"
          className="grid min-w-[320px] flex-1 gap-3 rounded-[1.4rem] border border-white/10 bg-[rgba(16,20,48,0.88)] p-3 shadow-[0_0_24px_rgba(52,215,255,0.08)] md:grid-cols-[190px_minmax(220px,1fr)_auto]"
        >
          <label className="sr-only" htmlFor="header-categoria">
            Categoría
          </label>
          <select
            id="header-categoria"
            name="categoria"
            defaultValue=""
            style={{ colorScheme: "dark" }}
            className="h-11 rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] px-4 text-sm text-white outline-none"
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
            className="h-11 rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] px-4 text-sm text-white outline-none placeholder:text-[var(--muted)]"
          />

          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(90deg,var(--primary),#ff84e7)] px-5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(255,79,216,0.28)]"
          >
            <Search className="size-4" />
            Buscar
          </button>
        </form>

        <div className="hidden shrink-0 items-center gap-6 lg:flex">
          {contactItem ? (
            <Link
              href={contactItem.href}
              className="text-sm text-[var(--foreground)]/78 hover:text-white"
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
