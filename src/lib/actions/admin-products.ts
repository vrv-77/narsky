"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { hasSupabaseServiceEnv } from "@/lib/env";
import { requireAdminSession } from "@/lib/auth/admin";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import {
  adminProductFormSchema,
  type AdminProductFormInput,
} from "@/lib/validation/admin-product";

export type AdminProductFormState = {
  status: "idle" | "error";
  message?: string;
};

const initialState: AdminProductFormState = {
  status: "idle",
};

function normalizeText(value: string | undefined) {
  return value?.trim() || null;
}

async function syncProductImages(
  productId: string,
  input: AdminProductFormInput,
) {
  const supabase = createSupabaseServiceRoleClient();
  const images: Array<{
    product_id: string;
    storage_path: string;
    image_url: string;
    alt_text: string | null;
    sort_order: number;
    is_primary: boolean;
  }> = [];

  await supabase.from("product_images").delete().eq("product_id", productId);

  if (input.primaryImageUrl) {
    images.push({
      product_id: productId,
      storage_path: `admin-managed/${productId}/primary`,
      image_url: input.primaryImageUrl,
      alt_text: normalizeText(input.primaryImageAlt),
      sort_order: 0,
      is_primary: true,
    });
  }

  if (input.secondaryImageUrl) {
    images.push({
      product_id: productId,
      storage_path: `admin-managed/${productId}/secondary`,
      image_url: input.secondaryImageUrl,
      alt_text: normalizeText(input.secondaryImageAlt),
      sort_order: 1,
      is_primary: false,
    });
  }

  if (images.length > 0) {
    const { error } = await supabase.from("product_images").insert(images);

    if (error) {
      throw error;
    }
  }
}

function revalidateCatalogPaths(slug: string, categorySlug?: string | null) {
  revalidatePath("/admin");
  revalidatePath("/admin/productos");
  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath(`/productos/${slug}`);

  if (categorySlug) {
    revalidatePath(`/categorias/${categorySlug}`);
  }
}

function mapDatabaseError(error: { message?: string } | null) {
  const message = error?.message ?? "";

  if (message.includes("products_slug_key")) {
    return "Ya existe un producto con ese slug.";
  }

  if (message.includes("products_sku_key")) {
    return "Ya existe un producto con ese SKU.";
  }

  if (message.includes("foreign key constraint")) {
    return "La categoría seleccionada no es válida.";
  }

  return "No pudimos guardar el producto. Revisa los datos e inténtalo de nuevo.";
}

export async function saveAdminProductAction(
  _previousState: AdminProductFormState = initialState,
  formData: FormData,
): Promise<AdminProductFormState> {
  void _previousState;

  await requireAdminSession();

  if (!hasSupabaseServiceEnv()) {
    return {
      status: "error",
      message:
        "Faltan variables de Supabase para guardar productos reales desde el panel.",
    };
  }

  const parsed = adminProductFormSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    slug: formData.get("slug"),
    sku: formData.get("sku"),
    categoryId: formData.get("categoryId"),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description"),
    price: formData.get("price"),
    compareAtPrice: formData.get("compareAtPrice"),
    stock: formData.get("stock"),
    minimumStock: formData.get("minimumStock"),
    trackStock: formData.get("trackStock"),
    allowBackorder: formData.get("allowBackorder"),
    isFeatured: formData.get("isFeatured"),
    isNew: formData.get("isNew"),
    status: formData.get("status"),
    primaryImageUrl: formData.get("primaryImageUrl"),
    primaryImageAlt: formData.get("primaryImageAlt"),
    secondaryImageUrl: formData.get("secondaryImageUrl"),
    secondaryImageAlt: formData.get("secondaryImageAlt"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message:
        parsed.error.issues[0]?.message ??
        "Revisa los datos del producto antes de guardar.",
    };
  }

  const input = parsed.data;
  const supabase = createSupabaseServiceRoleClient();

  let categorySlug: string | null = null;
  if (input.categoryId) {
    const { data: category } = await supabase
      .from("categories")
      .select("slug")
      .eq("id", input.categoryId)
      .is("deleted_at", null)
      .maybeSingle();

    categorySlug = category?.slug ?? null;
  }

  const payload = {
    category_id: input.categoryId ?? null,
    name: input.name.trim(),
    slug: input.slug.trim(),
    sku: input.sku.trim(),
    short_description: normalizeText(input.shortDescription),
    description: normalizeText(input.description),
    price: input.price,
    compare_at_price: input.compareAtPrice ?? null,
    stock: input.stock,
    minimum_stock: input.minimumStock,
    track_stock: input.trackStock,
    allow_backorder: input.allowBackorder,
    is_featured: input.isFeatured,
    is_new: input.isNew,
    status: input.status,
    primary_image_alt: normalizeText(input.primaryImageAlt),
    secondary_image_alt: normalizeText(input.secondaryImageAlt),
    last_stock_update: new Date().toISOString(),
  };

  if (input.id) {
    const { data, error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", input.id)
      .is("deleted_at", null)
      .select("id, slug")
      .single();

    if (error || !data) {
      return {
        status: "error",
        message: mapDatabaseError(error),
      };
    }

    try {
      await syncProductImages(data.id, input);
    } catch (error) {
      return {
        status: "error",
        message: mapDatabaseError(error as { message?: string }),
      };
    }

    revalidateCatalogPaths(data.slug, categorySlug);
    redirect(`/admin/productos/${data.id}`);
  }

  const { data, error } = await supabase
    .from("products")
    .insert(payload)
    .select("id, slug")
    .single();

  if (error || !data) {
    return {
      status: "error",
      message: mapDatabaseError(error),
    };
  }

  try {
    await syncProductImages(data.id, input);
  } catch (syncError) {
    await supabase.from("products").delete().eq("id", data.id);

    return {
      status: "error",
      message: mapDatabaseError(syncError as { message?: string }),
    };
  }

  revalidateCatalogPaths(data.slug, categorySlug);
  redirect(`/admin/productos/${data.id}`);
}

export async function deleteAdminProductAction(formData: FormData) {
  await requireAdminSession();

  if (!hasSupabaseServiceEnv()) {
    redirect("/admin/productos?error=supabase");
  }

  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    redirect("/admin/productos?error=missing-id");
  }

  const supabase = createSupabaseServiceRoleClient();
  const { data: existingProduct } = await supabase
    .from("products")
    .select("slug, category_id")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  const { error } = await supabase
    .from("products")
    .update({
      status: "archived",
      deleted_at: new Date().toISOString(),
    })
    .eq("id", id)
    .is("deleted_at", null);

  if (!error && existingProduct?.slug) {
    let categorySlug: string | null = null;

    if (existingProduct.category_id) {
      const { data: category } = await supabase
        .from("categories")
        .select("slug")
        .eq("id", existingProduct.category_id)
        .maybeSingle();

      categorySlug = category?.slug ?? null;
    }

    revalidateCatalogPaths(existingProduct.slug, categorySlug);
  }

  redirect("/admin/productos");
}
