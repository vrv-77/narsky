import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatClp } from "@/lib/utils";
import type { AdminProductRecord } from "@/services/admin-catalog";

type AdminProductEditorProps = {
  mode: "new" | "edit";
  product?: AdminProductRecord | null;
};

export function AdminProductEditor({
  mode,
  product,
}: AdminProductEditorProps) {
  const isEdit = mode === "edit" && product;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--secondary)]">
            {isEdit ? "Ficha administrativa" : "Alta de catálogo"}
          </p>
          <h1 className="mt-3 font-serif text-4xl text-[var(--foreground)]">
            {isEdit ? product.name : "Nuevo producto"}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#53627f]">
            {isEdit
              ? "Aquí ya puedes revisar la ficha completa del producto, su imagen, estado y estructura de edición antes de conectar el guardado definitivo."
              : "Esta vista deja lista la estructura de creación de producto para conectar guardado, subida de imágenes y validaciones en la siguiente etapa."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/admin/productos">
            <Button variant="secondary">Volver a productos</Button>
          </Link>
          {isEdit ? (
            <Link href={`/productos/${product.slug}`} target="_blank">
              <Button>Ver en tienda</Button>
            </Link>
          ) : null}
        </div>
      </div>

      <Card className="rounded-[1.6rem] border-[#e8d8c9] bg-[#fff9f3] p-4 text-sm text-[#725a45]">
        El guardado definitivo se conecta en el siguiente bloque. Por ahora esta
        ficha sirve para revisar estructura, contenido y flujo administrativo.
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_360px]">
        <div className="space-y-6">
          <Card className="space-y-5 p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Nombre"
                defaultValue={product?.name ?? ""}
                placeholder="Ej. Figura Oni Blade"
              />
              <Field
                label="Slug"
                defaultValue={product?.slug ?? ""}
                placeholder="ej-producto"
              />
              <Field
                label="SKU"
                defaultValue={product ? `SKU-${product.id.slice(-4).toUpperCase()}` : ""}
                placeholder="NAR-0001"
              />
              <Field
                label="Categoría"
                defaultValue={product?.categoryName ?? ""}
                placeholder="Selecciona una categoría"
              />
            </div>
          </Card>

          <Card className="space-y-5 p-6">
            <h2 className="font-serif text-2xl text-[var(--foreground)]">
              Precio e inventario
            </h2>
            <div className="grid gap-5 md:grid-cols-3">
              <Field
                label="Precio actual"
                defaultValue={product ? product.price.toString() : ""}
                placeholder="24990"
              />
              <Field
                label="Precio anterior"
                defaultValue={product?.compareAtPrice?.toString() ?? ""}
                placeholder="29990"
              />
              <Field
                label="Stock"
                defaultValue={product ? product.stock.toString() : ""}
                placeholder="8"
              />
            </div>
          </Card>

          <Card className="space-y-5 p-6">
            <h2 className="font-serif text-2xl text-[var(--foreground)]">
              Contenido visible
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Descripción corta</Label>
                <textarea
                  defaultValue={
                    isEdit
                      ? "Texto de presentación listo para la ficha pública del producto."
                      : ""
                  }
                  rows={4}
                  className="w-full rounded-2xl border bg-white/90 px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--secondary)]"
                  placeholder="Resumen breve del producto"
                />
              </div>
              <div className="space-y-2">
                <Label>Descripción detallada</Label>
                <textarea
                  defaultValue={
                    isEdit
                      ? "Descripción completa del producto, materiales, inspiración y uso en la tienda."
                      : ""
                  }
                  rows={7}
                  className="w-full rounded-2xl border bg-white/90 px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--secondary)]"
                  placeholder="Descripción larga"
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="overflow-hidden p-4">
            <div className="relative aspect-square overflow-hidden rounded-[1.2rem] border border-black/5 bg-[#f6efe8]">
              {product?.primaryImage ? (
                <Image
                  src={product.primaryImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-[#7f8aa5]">
                  Aquí irá la imagen principal
                </div>
              )}
            </div>
          </Card>

          <Card className="space-y-4 p-6">
            <h2 className="font-serif text-2xl text-[var(--foreground)]">
              Estado rápido
            </h2>

            <div className="flex flex-wrap gap-2">
              {product?.isNew ? <Badge>Nuevo</Badge> : null}
              {product?.isFeatured ? (
                <Badge className="bg-fuchsia-100 text-fuchsia-900">Destacado</Badge>
              ) : null}
              {product?.statusLabel ? (
                <Badge className="bg-slate-100 text-slate-900">
                  {product.statusLabel}
                </Badge>
              ) : null}
            </div>

            {isEdit ? (
              <div className="space-y-2 text-sm text-[#53627f]">
                <p>
                  <span className="font-medium text-[var(--foreground)]">Precio:</span>{" "}
                  {formatClp(product.price)}
                </p>
                <p>
                  <span className="font-medium text-[var(--foreground)]">Stock:</span>{" "}
                  {product.stock} unidades
                </p>
                <p>
                  <span className="font-medium text-[var(--foreground)]">
                    Categoría:
                  </span>{" "}
                  {product.categoryName ?? "Sin categoría"}
                </p>
              </div>
            ) : (
              <p className="text-sm leading-7 text-[#53627f]">
                Al conectar el guardado aquí mostraremos validaciones, estado del
                borrador, subida de imágenes y confirmación de publicación.
              </p>
            )}

            <Button disabled className="w-full">
              Guardado en siguiente etapa
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  defaultValue,
  placeholder,
}: {
  label: string;
  defaultValue: string;
  placeholder: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input defaultValue={defaultValue} placeholder={placeholder} />
    </div>
  );
}
