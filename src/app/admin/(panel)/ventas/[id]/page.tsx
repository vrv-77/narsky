import { AdminPlaceholderPage } from "@/components/admin/admin-placeholder-page";

type AdminSaleDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminSaleDetailPage({
  params,
}: AdminSaleDetailPageProps) {
  const { id } = await params;

  return (
    <AdminPlaceholderPage
      eyebrow={`Venta ${id}`}
      title="Detalle de venta pendiente de UI"
      description="Esta pantalla usará datos históricos de la orden, Flow, correos, historial de estados y stock para reconstruir la venta sin depender del catálogo actual."
    />
  );
}
