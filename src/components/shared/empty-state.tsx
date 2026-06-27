import { Card } from "@/components/ui/card";

type EmptyStateProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function EmptyState({ eyebrow, title, description }: EmptyStateProps) {
  return (
    <Card className="p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--secondary)]">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-serif text-3xl text-[var(--foreground)]">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
        {description}
      </p>
    </Card>
  );
}
