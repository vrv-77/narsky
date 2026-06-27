import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-2xl border bg-white/90 px-4 py-3 text-sm outline-none ring-0 placeholder:text-[var(--muted)] focus:border-[var(--secondary)]",
        className,
      )}
      {...props}
    />
  );
}
