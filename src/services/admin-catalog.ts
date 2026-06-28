import "server-only";

import { hasSupabaseServiceEnv } from "@/lib/env";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import { getCatalogSnapshot, getProductBySlug } from "@/services/storefront";
import type { ProductCard } from "@/types/domain";

export type AdminCatalogStatus = "draft" | "active" | "inactive" | "archived";

export type AdminCategoryOption = {
  id: string;
  name: string;
  slug: string;
};

export type AdminProductRecord = ProductCard & {
  status: AdminCatalogStatus;
  statusLabel: "Activo" | "Sin stock" | "Stock bajo";
};

export type AdminProductEditorRecord = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  categoryId: string | null;
  categoryName: string | null;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  minimumStock: number;
  trackStock: boolean;
  allowBackorder: boolean;
  isFeatured: boolean;
  isNew: boolean;
  status: AdminCatalogStatus;
  primaryImage: string | null;
  primaryImageAlt: string;
  secondaryImage: string | null;
  secondaryImageAlt: string;
  statusLabel: "Activo" | "Sin stock" | "Stock bajo";
};

function getStatusLabel(stock: number): "Activo" | "Sin stock" | "Stock bajo" {
  if (stock <= 0) {
    return "Sin stock";
  }

  if (stock <= 5) {
    return "Stock bajo";
  }

  return "Activo";
}

function mapAdminProduct(product: ProductCard): AdminProductRecord {
  return {
    ...product,
    status: "active",
    statusLabel: getStatusLabel(product.stock),
  };
}

function mapAdminProductFromRow(record: Record<string, unknown>): AdminProductRecord {
  const categoryRecord =
    record.categories && typeof record.categories === "object"
      ? (record.categories as Record<string, unknown>)
      : null;

  const images = Array.isArray(record.product_images)
    ? (record.product_images as Array<Record<string, unknown>>)
    : [];

  const sortedImages = [...images].sort((left, right) => {
    const leftPrimary = Boolean(left.is_primary);
    const rightPrimary = Boolean(right.is_primary);

    if (leftPrimary === rightPrimary) {
      return 0;
    }

    return leftPrimary ? -1 : 1;
  });

  const primaryImage = sortedImages[0]?.image_url;
  const secondaryImage =
    sortedImages.find((image) => !Boolean(image.is_primary))?.image_url ??
    sortedImages[1]?.image_url;

  const stock = Number(record.stock ?? 0);

  return {
    id: String(record.id),
    slug: String(record.slug),
    name: String(record.name),
    categoryName:
      categoryRecord && typeof categoryRecord.name === "string"
        ? categoryRecord.name
        : null,
    price: Number(record.price ?? 0),
    compareAtPrice:
      record.compare_at_price === null || record.compare_at_price === undefined
        ? null
        : Number(record.compare_at_price),
    stock,
    isNew: Boolean(record.is_new),
    isFeatured: Boolean(record.is_featured),
    primaryImage:
      typeof primaryImage === "string" && primaryImage.length > 0
        ? primaryImage
        : null,
    secondaryImage:
      typeof secondaryImage === "string" && secondaryImage.length > 0
        ? secondaryImage
        : null,
    status:
      (record.status as AdminCatalogStatus | undefined) ?? "draft",
    statusLabel: getStatusLabel(stock),
  };
}

function mapAdminEditorFromRow(
  record: Record<string, unknown>,
): AdminProductEditorRecord {
  const categoryRecord =
    record.categories && typeof record.categories === "object"
      ? (record.categories as Record<string, unknown>)
      : null;

  const images = Array.isArray(record.product_images)
    ? (record.product_images as Array<Record<string, unknown>>)
    : [];

  const primaryImageRecord =
    images.find((image) => Boolean(image.is_primary)) ?? images[0] ?? null;
  const secondaryImageRecord =
    images.find((image) => !Boolean(image.is_primary)) ?? images[1] ?? null;

  const stock = Number(record.stock ?? 0);

  return {
    id: String(record.id),
    name: String(record.name ?? ""),
    slug: String(record.slug ?? ""),
    sku: String(record.sku ?? ""),
    categoryId:
      record.category_id && typeof record.category_id === "string"
        ? record.category_id
        : null,
    categoryName:
      categoryRecord && typeof categoryRecord.name === "string"
        ? categoryRecord.name
        : null,
    shortDescription:
      typeof record.short_description === "string" ? record.short_description : "",
    description: typeof record.description === "string" ? record.description : "",
    price: Number(record.price ?? 0),
    compareAtPrice:
      record.compare_at_price === null || record.compare_at_price === undefined
        ? null
        : Number(record.compare_at_price),
    stock,
    minimumStock: Number(record.minimum_stock ?? 0),
    trackStock: Boolean(record.track_stock),
    allowBackorder: Boolean(record.allow_backorder),
    isFeatured: Boolean(record.is_featured),
    isNew: Boolean(record.is_new),
    status: (record.status as AdminCatalogStatus | undefined) ?? "draft",
    primaryImage:
      primaryImageRecord && typeof primaryImageRecord.image_url === "string"
        ? primaryImageRecord.image_url
        : null,
    primaryImageAlt:
      primaryImageRecord && typeof primaryImageRecord.alt_text === "string"
        ? primaryImageRecord.alt_text
        : "",
    secondaryImage:
      secondaryImageRecord && typeof secondaryImageRecord.image_url === "string"
        ? secondaryImageRecord.image_url
        : null,
    secondaryImageAlt:
      secondaryImageRecord && typeof secondaryImageRecord.alt_text === "string"
        ? secondaryImageRecord.alt_text
        : "",
    statusLabel: getStatusLabel(stock),
  };
}

function mapDemoEditorProduct(product: ProductCard): AdminProductEditorRecord {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: `SKU-${product.id.slice(-4).toUpperCase()}`,
    categoryId: null,
    categoryName: product.categoryName,
    shortDescription: "",
    description: "",
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    stock: product.stock,
    minimumStock: 0,
    trackStock: true,
    allowBackorder: false,
    isFeatured: product.isFeatured,
    isNew: product.isNew,
    status: "active",
    primaryImage: product.primaryImage,
    primaryImageAlt: product.name,
    secondaryImage: product.secondaryImage,
    secondaryImageAlt: `${product.name} detalle`,
    statusLabel: getStatusLabel(product.stock),
  };
}

export async function getAdminCatalogData() {
  if (!hasSupabaseServiceEnv()) {
    const snapshot = await getCatalogSnapshot();
    const products = snapshot.products.map(mapAdminProduct);
    const categories = snapshot.categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
    }));

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
      configured: false,
      canManagePersistedCatalog: false,
      products,
      categories,
      metrics,
    };
  }

  const supabase = createSupabaseServiceRoleClient();
  const [productsResult, categoriesResult] = await Promise.all([
    supabase
      .from("products")
      .select(
        "id, slug, name, price, compare_at_price, stock, is_new, is_featured, status, categories(name), product_images(image_url, is_primary)",
      )
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("categories")
      .select("id, slug, name")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true }),
  ]);

  const products = (productsResult.data ?? []).map((product) =>
    mapAdminProductFromRow(product as Record<string, unknown>),
  );
  const categories = (categoriesResult.data ?? []).map((category) => ({
    id: String(category.id),
    slug: String(category.slug),
    name: String(category.name),
  }));

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
    configured: true,
    canManagePersistedCatalog: true,
    products,
    categories,
    metrics,
  };
}

export async function getAdminProductById(id: string) {
  if (!hasSupabaseServiceEnv()) {
    const catalog = await getCatalogSnapshot();
    const product = catalog.products.find((item) => item.id === id) ?? null;

    return product ? mapDemoEditorProduct(product) : null;
  }

  const supabase = createSupabaseServiceRoleClient();
  const { data } = await supabase
    .from("products")
    .select(
      "id, category_id, name, slug, sku, short_description, description, price, compare_at_price, stock, minimum_stock, track_stock, allow_backorder, is_featured, is_new, status, primary_image_alt, secondary_image_alt, categories(id, name, slug), product_images(image_url, alt_text, is_primary, sort_order)",
    )
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  return data ? mapAdminEditorFromRow(data as Record<string, unknown>) : null;
}

export async function getAdminProductBySlug(slug: string) {
  if (!hasSupabaseServiceEnv()) {
    const data = await getProductBySlug(slug);
    return data ? mapAdminEditorFromRow(data) : null;
  }

  const supabase = createSupabaseServiceRoleClient();
  const { data } = await supabase
    .from("products")
    .select(
      "id, category_id, name, slug, sku, short_description, description, price, compare_at_price, stock, minimum_stock, track_stock, allow_backorder, is_featured, is_new, status, primary_image_alt, secondary_image_alt, categories(id, name, slug), product_images(image_url, alt_text, is_primary, sort_order)",
    )
    .eq("slug", slug)
    .is("deleted_at", null)
    .maybeSingle();

  return data ? mapAdminEditorFromRow(data as Record<string, unknown>) : null;
}
