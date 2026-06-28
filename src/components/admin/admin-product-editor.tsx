"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  deleteAdminProductAction,
  saveAdminProductAction,
  type AdminProductFormState,
} from "@/lib/actions/admin-products";
import type {
  AdminCategoryOption,
  AdminProductEditorRecord,
} from "@/services/admin-catalog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatClp } from "@/lib/utils";

type AdminProductEditorProps = {
  mode: "new" | "edit";
  product?: AdminProductEditorRecord | null;
  categories: AdminCategoryOption[];
  canManagePersistedCatalog: boolean;
};

const initialState: AdminProductFormState = {
  status: "idle",
};

function SaveButton({
  isEdit,
  disabled,
}: {
  isEdit: boolean;
  disabled: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={disabled || pending}>
      {pending
        ? isEdit
          ? "Guardando cambios..."
          : "Creando producto..."
        : isEdit
          ? "Guardar cambios"
          : "Crear producto"}
    </Button>
  );
}

function DeleteButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="secondary"
      className="w-full border-rose-400/20 text-rose-100 hover:bg-rose-500/10"
      disabled={disabled || pending}
    >
      {pending ? "Archivando..." : "Archivar producto"}
    </Button>
  );
}

export function AdminProductEditor({
  mode,
  product,
  categories,
  canManagePersistedCatalog,
}: AdminProductEditorProps) {
  const currentProduct = product ?? null;
  const isEdit = mode === "edit" && currentProduct !== null;
  const [state, formAction] = useActionState(saveAdminProductAction, initialState);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--secondary)]">
            {isEdit ? "Ficha administrativa" : "Alta de catálogo"}
          </p>
          <h1 className="mt-3 font-serif text-4xl text-[var(--foreground)]">
            {currentProduct ? currentProduct.name : "Nuevo producto"}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[rgba(208,218,255,0.82)]">
            {isEdit
              ? "Aquí ya puedes editar la ficha completa del producto, su estado, precios e imágenes principales conectadas a Supabase."
              : "Esta vista crea productos reales en Supabase y deja lista la base para sumar carga de imágenes, galerías y validaciones avanzadas."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/admin/productos">
            <Button variant="secondary">Volver a productos</Button>
          </Link>
          {isEdit ? (
            <Link href={`/productos/${currentProduct?.slug ?? ""}`} target="_blank">
              <Button>Ver en tienda</Button>
            </Link>
          ) : null}
        </div>
      </div>

      {!canManagePersistedCatalog ? (
        <Card className="rounded-[1.6rem] border-amber-400/20 bg-[linear-gradient(180deg,rgba(76,52,18,0.58)_0%,rgba(50,33,11,0.72)_100%)] p-4 text-sm text-amber-100">
          Para guardar productos reales desde este panel necesitas configurar
          `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` y
          `SUPABASE_SERVICE_ROLE_KEY`.
        </Card>
      ) : null}

      {categories.length === 0 ? (
        <Card className="rounded-[1.6rem] border-amber-400/20 bg-[linear-gradient(180deg,rgba(76,52,18,0.58)_0%,rgba(50,33,11,0.72)_100%)] p-4 text-sm text-amber-100">
          Aún no hay categorías reales disponibles. Puedes guardar el producto sin
          categoría o crear las categorías en la siguiente etapa del admin.
        </Card>
      ) : null}

      {state.status === "error" ? (
        <Card className="rounded-[1.6rem] border-rose-400/20 bg-[linear-gradient(180deg,rgba(74,21,38,0.6)_0%,rgba(50,12,24,0.74)_100%)] p-4 text-sm text-rose-100">
          {state.message}
        </Card>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_360px]">
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="id" value={currentProduct?.id ?? ""} />

          <Card className="space-y-5 border-white/10 p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Nombre"
                name="name"
                defaultValue={currentProduct?.name ?? ""}
                placeholder="Ej. Figura Oni Blade"
              />
              <Field
                label="Slug"
                name="slug"
                defaultValue={currentProduct?.slug ?? ""}
                placeholder="figura-oni-blade"
              />
              <Field
                label="SKU"
                name="sku"
                defaultValue={currentProduct?.sku ?? ""}
                placeholder="NAR-0001"
              />
              <div className="space-y-2">
                <Label htmlFor="categoryId">Categoría</Label>
                <select
                  id="categoryId"
                  name="categoryId"
                  defaultValue={currentProduct?.categoryId ?? ""}
                  className="w-full rounded-2xl border border-white/10 bg-[rgba(10,16,42,0.96)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--secondary)]"
                >
                  <option value="" className="bg-[#0a102a] text-white">
                    Sin categoría
                  </option>
                  {categories.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                      className="bg-[#0a102a] text-white"
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          <Card className="space-y-5 border-white/10 p-6">
            <h2 className="font-serif text-2xl text-[var(--foreground)]">
              Precio e inventario
            </h2>
            <div className="grid gap-5 md:grid-cols-4">
              <Field
                label="Precio actual"
                name="price"
                defaultValue={currentProduct ? currentProduct.price.toString() : ""}
                placeholder="24990"
              />
              <Field
                label="Precio anterior"
                name="compareAtPrice"
                defaultValue={currentProduct?.compareAtPrice?.toString() ?? ""}
                placeholder="29990"
              />
              <Field
                label="Stock"
                name="stock"
                defaultValue={currentProduct ? currentProduct.stock.toString() : "0"}
                placeholder="8"
              />
              <Field
                label="Stock mínimo"
                name="minimumStock"
                defaultValue={currentProduct ? currentProduct.minimumStock.toString() : "0"}
                placeholder="2"
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <ToggleField
                name="trackStock"
                label="Controlar stock"
                defaultChecked={currentProduct?.trackStock ?? true}
              />
              <ToggleField
                name="allowBackorder"
                label="Permitir preventa / backorder"
                defaultChecked={currentProduct?.allowBackorder ?? false}
              />
              <ToggleField
                name="isFeatured"
                label="Mostrar como destacado"
                defaultChecked={currentProduct?.isFeatured ?? false}
              />
              <ToggleField
                name="isNew"
                label="Marcar como nuevo"
                defaultChecked={currentProduct?.isNew ?? false}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <select
                id="status"
                name="status"
                defaultValue={currentProduct?.status ?? "draft"}
                className="w-full rounded-2xl border border-white/10 bg-[rgba(10,16,42,0.96)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--secondary)]"
              >
                <option value="draft" className="bg-[#0a102a] text-white">
                  Borrador
                </option>
                <option value="active" className="bg-[#0a102a] text-white">
                  Activo
                </option>
                <option value="inactive" className="bg-[#0a102a] text-white">
                  Inactivo
                </option>
                <option value="archived" className="bg-[#0a102a] text-white">
                  Archivado
                </option>
              </select>
            </div>
          </Card>

          <Card className="space-y-5 border-white/10 p-6">
            <h2 className="font-serif text-2xl text-[var(--foreground)]">
              Contenido visible
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shortDescription">Descripción corta</Label>
                <textarea
                  id="shortDescription"
                  name="shortDescription"
                  defaultValue={currentProduct?.shortDescription ?? ""}
                  rows={4}
                  className="w-full rounded-2xl border border-white/10 bg-[rgba(10,16,42,0.96)] px-4 py-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[rgba(162,180,230,0.68)] focus:border-[var(--secondary)]"
                  placeholder="Resumen breve del producto"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción detallada</Label>
                <textarea
                  id="description"
                  name="description"
                  defaultValue={currentProduct?.description ?? ""}
                  rows={7}
                  className="w-full rounded-2xl border border-white/10 bg-[rgba(10,16,42,0.96)] px-4 py-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[rgba(162,180,230,0.68)] focus:border-[var(--secondary)]"
                  placeholder="Descripción larga"
                />
              </div>
            </div>
          </Card>

          <Card className="space-y-5 border-white/10 p-6">
            <h2 className="font-serif text-2xl text-[var(--foreground)]">
              Imágenes principales
            </h2>
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="URL imagen principal"
                name="primaryImageUrl"
                defaultValue={currentProduct?.primaryImage ?? ""}
                placeholder="/product-art/mi-imagen.png"
              />
              <Field
                label="Alt imagen principal"
                name="primaryImageAlt"
                defaultValue={currentProduct?.primaryImageAlt ?? ""}
                placeholder="Vista principal del producto"
              />
              <Field
                label="URL imagen secundaria"
                name="secondaryImageUrl"
                defaultValue={currentProduct?.secondaryImage ?? ""}
                placeholder="/product-art/mi-imagen-2.png"
              />
              <Field
                label="Alt imagen secundaria"
                name="secondaryImageAlt"
                defaultValue={currentProduct?.secondaryImageAlt ?? ""}
                placeholder="Vista secundaria del producto"
              />
            </div>
          </Card>

          <SaveButton
            isEdit={Boolean(isEdit)}
            disabled={!canManagePersistedCatalog}
          />
        </form>

        <div className="space-y-6">
          <Card className="overflow-hidden border-white/10 p-4">
            <div className="relative aspect-square overflow-hidden rounded-[1.2rem] border border-white/10 bg-[rgba(10,16,42,0.92)]">
              {currentProduct?.primaryImage ? (
                <Image
                  src={currentProduct.primaryImage}
                  alt={currentProduct.primaryImageAlt || currentProduct.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center text-sm text-[rgba(162,180,230,0.72)]">
                  Aquí se mostrará la imagen principal una vez guardado el producto.
                </div>
              )}
            </div>
          </Card>

          <Card className="space-y-4 border-white/10 p-6">
            <h2 className="font-serif text-2xl text-[var(--foreground)]">
              Estado rápido
            </h2>

            <div className="flex flex-wrap gap-2">
              {currentProduct?.isNew ? <Badge>Nuevo</Badge> : null}
              {currentProduct?.isFeatured ? (
                <Badge className="bg-fuchsia-100 text-fuchsia-900">Destacado</Badge>
              ) : null}
              {currentProduct?.statusLabel ? (
                <Badge className="bg-[rgba(230,215,255,0.92)] text-slate-900">
                  {currentProduct.statusLabel}
                </Badge>
              ) : null}
            </div>

            {currentProduct ? (
              <div className="space-y-2 text-sm text-[rgba(208,218,255,0.82)]">
                <p>
                  <span className="font-medium text-[var(--foreground)]">Precio:</span>{" "}
                  {formatClp(currentProduct.price)}
                </p>
                <p>
                  <span className="font-medium text-[var(--foreground)]">Stock:</span>{" "}
                  {currentProduct.stock} unidades
                </p>
                <p>
                  <span className="font-medium text-[var(--foreground)]">
                    Categoría:
                  </span>{" "}
                  {currentProduct.categoryName ?? "Sin categoría"}
                </p>
              </div>
            ) : (
              <p className="text-sm leading-7 text-[rgba(208,218,255,0.82)]">
                Al crear el producto aquí verás el resumen rápido con precio,
                categoría, estado e imagen principal.
              </p>
            )}

            {isEdit ? (
              <form action={deleteAdminProductAction}>
                <input type="hidden" name="id" value={currentProduct?.id ?? ""} />
                <DeleteButton disabled={!canManagePersistedCatalog} />
              </form>
            ) : null}
          </Card>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue: string;
  placeholder: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        className="border-white/10 bg-[rgba(10,16,42,0.96)] text-[var(--foreground)] placeholder:text-[rgba(162,180,230,0.68)]"
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    </div>
  );
}

function ToggleField({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[rgba(10,16,42,0.72)] px-4 py-3 text-sm text-[var(--foreground)]">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="size-4 accent-[var(--primary)]"
      />
      <span>{label}</span>
    </label>
  );
}
