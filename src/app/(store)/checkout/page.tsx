import { EmptyState } from "@/components/shared/empty-state";

export default function CheckoutPage() {
  return (
    <div className="app-shell py-10">
      <EmptyState
        eyebrow="Compra"
        title="Pronto podras finalizar tu pedido"
        description="Aqui veras el resumen de tu compra, tus datos de envio y el paso final para llevar tus piezas favoritas."
      />
    </div>
  );
}
