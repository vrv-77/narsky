import { Card } from "@/components/ui/card";

type EmptyStateProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function EmptyState({ eyebrow, title, description }: EmptyStateProps) {
  return (
    <Card className="border-white/10 bg-[linear-gradient(180deg,rgba(20,27,64,0.94)_0%,rgba(10,15,37,0.98)_100%)] p-8 shadow-[0_18px_46px_rgba(0,0,0,0.28)]">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--secondary)]">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-serif text-3xl text-[var(--foreground)]">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[rgba(208,218,255,0.82)]">
        {description}
      </p>
    </Card>
  );
}
