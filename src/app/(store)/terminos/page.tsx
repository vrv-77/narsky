import { EmptyState } from "@/components/shared/empty-state";

export default function TermsPage() {
  return (
    <div className="app-shell py-10">
      <EmptyState
        eyebrow="Terminos"
        title="Terminos y condiciones"
        description="Aqui compartiremos las condiciones de compra, cambios, entregas y uso general de la tienda Narsky."
      />
    </div>
  );
}
