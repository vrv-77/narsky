"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { adminNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const currentPath = usePathname();

  return (
    <aside className="border-r border-white/10 bg-[linear-gradient(180deg,rgba(9,14,36,0.98)_0%,rgba(5,8,20,1)_100%)] px-6 py-8 text-white">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.24em] text-[rgba(193,208,255,0.68)]">
          Negocio Nicole
        </p>
        <h2 className="mt-3 font-serif text-3xl leading-tight text-white">
          Panel administrativo
        </h2>
      </div>

      <nav className="space-y-2">
        {adminNavigation.map((item) => {
          const isActive = currentPath === item.href || currentPath.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-2xl border border-transparent px-4 py-3 text-sm font-medium text-[rgba(222,229,255,0.76)] hover:border-[rgba(52,215,255,0.18)] hover:bg-[rgba(52,215,255,0.08)] hover:text-white",
                isActive &&
                  "border-[rgba(52,215,255,0.2)] bg-[linear-gradient(90deg,rgba(52,215,255,0.18)_0%,rgba(255,79,216,0.14)_100%)] text-white shadow-[0_0_24px_rgba(52,215,255,0.12)]",
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
