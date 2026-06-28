import { AdminProductsPage } from "@/components/admin/admin-products-page";
import { getAdminCatalogData } from "@/services/admin-catalog";

type AdminProductsPageProps = {
  searchParams?: Promise<{
    q?: string;
    categoria?: string;
    vista?: string;
  }>;
};

export default async function AdminProductsPageRoute({
  searchParams,
}: AdminProductsPageProps) {
  const filters = (await searchParams) ?? {};
  const catalog = await getAdminCatalogData();

  return (
    <AdminProductsPage
      configured={catalog.configured}
      products={catalog.products}
      categories={catalog.categories}
      metrics={catalog.metrics}
      query={filters.q ?? ""}
      category={filters.categoria ?? ""}
      view={filters.vista ?? "all"}
    />
  );
}
