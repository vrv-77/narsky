import { EmptyState } from "@/components/shared/empty-state";

export default function PaymentRejectedPage() {
  return (
    <div className="app-shell py-10">
      <EmptyState
        eyebrow="Pago rechazado"
        title="El pago no pudo completarse"
        description="No te preocupes, podras volver a intentarlo o revisar otro metodo de compra cuando este disponible."
      />
    </div>
  );
}
