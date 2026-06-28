import { AdminOverview } from "@/components/admin/admin-overview";
import { getAdminCatalogData } from "@/services/admin-catalog";

export default async function AdminDashboardPage() {
  const catalog = await getAdminCatalogData();

  return (
    <AdminOverview
      configured={catalog.configured}
      metrics={{
        totalProducts: catalog.metrics.totalProducts,
        featuredProducts: catalog.metrics.featuredProducts,
        lowStockProducts: catalog.metrics.lowStockProducts,
        outOfStockProducts: catalog.metrics.outOfStockProducts,
        categories: catalog.metrics.categories,
      }}
      recentProducts={catalog.products.slice(0, 3)}
    />
  );
}
