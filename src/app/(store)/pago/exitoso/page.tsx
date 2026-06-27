import { EmptyState } from "@/components/shared/empty-state";

export default function PaymentSuccessPage() {
  return (
    <div className="app-shell py-10">
      <EmptyState
        eyebrow="Pago exitoso"
        title="Tu compra fue recibida"
        description="Gracias por elegir Narsky. Muy pronto veras aqui el resumen de tu pedido y los siguientes pasos."
      />
    </div>
  );
}
