import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "surface-panel rounded-[calc(var(--radius)+0.25rem)] border border-white/60",
        className,
      )}
      {...props}
    />
  );
}
