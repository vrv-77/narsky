import { EmptyState } from "@/components/shared/empty-state";

export default function PaymentPendingPage() {
  return (
    <div className="app-shell py-10">
      <EmptyState
        eyebrow="Pago pendiente"
        title="Tu compra sigue en revision"
        description="Estamos esperando la confirmacion de tu compra. En cuanto este lista, veras el estado actualizado aqui."
      />
    </div>
  );
}
