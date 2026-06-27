import { EmptyState } from "@/components/shared/empty-state";

type OrderPageProps = {
  params: Promise<{ codigo: string }>;
};

export default async function OrderPage({ params }: OrderPageProps) {
  const { codigo } = await params;

  return (
    <div className="app-shell py-10">
      <EmptyState
        eyebrow={`Pedido ${codigo}`}
        title="Resumen de tu pedido"
        description="Aqui podras revisar el estado de tu compra, los productos elegidos y la informacion principal de entrega."
      />
    </div>
  );
}
