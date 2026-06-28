import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/card";

type BentoCategory = {
  name: string;
  description: string;
  href: string;
  image: string;
};

type StoreCategoryBentoProps = {
  items: BentoCategory[];
};

export function StoreCategoryBento({ items }: StoreCategoryBentoProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.15fr_0.85fr]">
      <Card className="neon-panel overflow-hidden rounded-[1.9rem] border border-white/10 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {items.slice(0, 2).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,79,216,0.12),transparent_30%)] opacity-80" />
              <div className="relative flex h-full flex-col">
                <div className="relative mx-auto h-40 w-full max-w-[12rem]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain transition duration-300 group-hover:scale-[1.06]"
                  />
                </div>
                <div className="mt-4">
                  <p className="font-serif text-3xl text-white">{item.name}</p>
                  <p className="mt-2 text-sm leading-7 text-[rgba(240,243,255,0.8)]">
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Card>

      <div className="grid gap-4">
        {items.slice(2, 5).map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="group"
          >
            <Card className="neon-panel flex items-center gap-4 rounded-[1.6rem] border border-white/10 p-4">
              <div className="relative h-28 w-28 shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain transition duration-300 group-hover:scale-[1.08]"
                />
              </div>
              <div>
                <p className="font-serif text-2xl text-white">{item.name}</p>
                <p className="mt-2 text-sm leading-7 text-[rgba(240,243,255,0.78)]">
                  {item.description}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
