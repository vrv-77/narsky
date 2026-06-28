import { AdminProductEditor } from "@/components/admin/admin-product-editor";
import { getAdminCatalogData } from "@/services/admin-catalog";

export default async function AdminProductsNewPage() {
  const catalog = await getAdminCatalogData();

  return (
    <AdminProductEditor
      mode="new"
      categories={catalog.categories}
      canManagePersistedCatalog={catalog.canManagePersistedCatalog}
    />
  );
}
