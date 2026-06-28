import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold shadow-sm disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" &&
          "bg-[var(--primary)] text-[var(--primary-contrast)] hover:-translate-y-0.5 hover:shadow-lg",
        variant === "secondary" &&
          "border border-white/12 bg-[rgba(18,24,56,0.96)] text-[var(--foreground)] shadow-[0_0_18px_rgba(52,215,255,0.12)] hover:-translate-y-0.5 hover:bg-[rgba(28,36,78,0.98)]",
        variant === "ghost" &&
          "text-[var(--muted)] hover:bg-[rgba(255,255,255,0.05)] hover:text-[var(--foreground)]",
        className,
      )}
      {...props}
    />
  );
}
