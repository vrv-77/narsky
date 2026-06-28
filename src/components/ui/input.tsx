import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-2xl border border-white/10 bg-[rgba(10,16,42,0.96)] px-4 py-3 text-sm text-[var(--foreground)] outline-none ring-0 placeholder:text-[rgba(162,180,230,0.68)] focus:border-[var(--secondary)]",
        className,
      )}
      {...props}
    />
  );
}
