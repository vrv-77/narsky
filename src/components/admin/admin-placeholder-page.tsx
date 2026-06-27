import { EmptyState } from "@/components/shared/empty-state";

type AdminPlaceholderPageProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function AdminPlaceholderPage({
  eyebrow,
  title,
  description,
}: AdminPlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <EmptyState eyebrow={eyebrow} title={title} description={description} />
    </div>
  );
}
