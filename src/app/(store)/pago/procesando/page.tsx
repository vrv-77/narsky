import { EmptyState } from "@/components/shared/empty-state";

export default function PaymentProcessingPage() {
  return (
    <div className="app-shell py-10">
      <EmptyState
        eyebrow="Pago"
        title="Pago en procesamiento"
        description="Estamos procesando tu compra para que puedas continuar con tranquilidad."
      />
    </div>
  );
}
