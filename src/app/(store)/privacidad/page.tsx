import { EmptyState } from "@/components/shared/empty-state";

export default function PrivacyPage() {
  return (
    <div className="app-shell py-10">
      <EmptyState
        eyebrow="Privacidad"
        title="Politica de privacidad"
        description="Aqui compartiremos de forma clara como cuidamos y utilizamos la informacion de nuestros clientes."
      />
    </div>
  );
}
