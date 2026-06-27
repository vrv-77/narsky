import { AdminPlaceholderPage } from "@/components/admin/admin-placeholder-page";

type AdminProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminProductDetailPage({
  params,
}: AdminProductDetailPageProps) {
  const { id } = await params;

  return (
    <AdminPlaceholderPage
      eyebrow={`Producto ${id}`}
      title="Editor de producto pendiente de implementación"
      description="Esta ruta queda preparada para edición segura con validaciones servidor, control de stock, reemplazo de imágenes y auditoría."
    />
  );
}
