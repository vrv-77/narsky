"use client";

import { ShieldCheck, Sparkles, Star, Truck } from "lucide-react";

const items = [
  { icon: ShieldCheck, label: "Compra segura" },
  { icon: Truck, label: "Despacho flexible" },
  { icon: Sparkles, label: "Drops anime y gamer" },
  { icon: Star, label: "Piezas destacadas cada semana" },
];

export function MarqueeStrip() {
  const loopItems = [...items, ...items, ...items];

  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-[linear-gradient(90deg,rgba(255,79,216,0.1),rgba(52,215,255,0.08),rgba(139,92,246,0.12))] py-3">
      <div className="marquee-track flex min-w-max items-center gap-8 px-6">
        {loopItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={`${item.label}-${index}`}
              className="inline-flex items-center gap-3 text-sm font-medium text-white"
            >
              <span className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/8 text-[var(--secondary)]">
                <Icon className="size-4" />
              </span>
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
