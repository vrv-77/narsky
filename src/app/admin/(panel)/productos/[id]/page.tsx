import { notFound } from "next/navigation";

import { AdminProductEditor } from "@/components/admin/admin-product-editor";
import { getAdminProductById } from "@/services/admin-catalog";

type AdminProductEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminProductEditPage({
  params,
}: AdminProductEditPageProps) {
  const { id } = await params;
  const product = await getAdminProductById(id);

  if (!product) {
    notFound();
  }

  return <AdminProductEditor mode="edit" product={product} />;
}
