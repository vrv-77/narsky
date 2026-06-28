import "server-only";

import { getCatalogSnapshot } from "@/services/storefront";
import type { ProductCard } from "@/types/domain";

export type AdminProductRecord = ProductCard & {
  statusLabel: "Activo" | "Sin stock" | "Stock bajo";
};

function mapAdminProduct(product: ProductCard): AdminProductRecord {
  const statusLabel =
    product.stock <= 0
      ? "Sin stock"
      : product.stock <= 5
        ? "Stock bajo"
        : "Activo";

  return {
    ...product,
    statusLabel,
  };
}

export async function getAdminCatalogData() {
  const snapshot = await getCatalogSnapshot();
  const products = snapshot.products.map(mapAdminProduct);
  const categories = snapshot.categories;

  const metrics = {
    totalProducts: products.length,
    featuredProducts: products.filter((product) => product.isFeatured).length,
    lowStockProducts: products.filter(
      (product) => product.stock > 0 && product.stock <= 5,
    ).length,
    outOfStockProducts: products.filter((product) => product.stock <= 0).length,
    newProducts: products.filter((product) => product.isNew).length,
    categories: categories.length,
  };

  return {
    configured: snapshot.configured,
    products,
    categories,
    metrics,
  };
}

export async function getAdminProductById(id: string) {
  const catalog = await getAdminCatalogData();
  return catalog.products.find((product) => product.id === id) ?? null;
}
