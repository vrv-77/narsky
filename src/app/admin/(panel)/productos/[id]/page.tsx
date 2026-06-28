import { notFound } from "next/navigation";

import { AdminProductEditor } from "@/components/admin/admin-product-editor";
import { getAdminCatalogData, getAdminProductById } from "@/services/admin-catalog";

type AdminProductEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminProductEditPage({
  params,
}: AdminProductEditPageProps) {
  const { id } = await params;
  const [product, catalog] = await Promise.all([
    getAdminProductById(id),
    getAdminCatalogData(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <AdminProductEditor
      mode="edit"
      product={product}
      categories={catalog.categories}
      canManagePersistedCatalog={catalog.canManagePersistedCatalog}
    />
  );
}
