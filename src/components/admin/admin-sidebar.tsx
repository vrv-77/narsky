"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { adminNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const currentPath = usePathname();

  return (
    <aside className="border-r border-white/60 bg-[var(--secondary)] px-6 py-8 text-white">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.24em] text-white/60">
          Negocio Nicole
        </p>
        <h2 className="mt-3 font-serif text-3xl">Panel administrativo</h2>
      </div>

      <nav className="space-y-2">
        {adminNavigation.map((item) => {
          const isActive = currentPath === item.href || currentPath.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-2xl px-4 py-3 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white",
                isActive && "bg-white/14 text-white",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
