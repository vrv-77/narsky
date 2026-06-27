import { notFound } from "next/navigation";

import { EmptyState } from "@/components/shared/empty-state";
import { ProductCard } from "@/components/store/product-card";
import { getCategoryBySlug } from "@/services/storefront";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const result = await getCategoryBySlug(slug);

  if (!result?.category) {
    notFound();
  }

  return (
    <div className="app-shell space-y-10 py-10">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--secondary)]">
          Categoria
        </p>
        <h1 className="mt-3 font-serif text-5xl text-[var(--foreground)]">
          {result.category.name?.toString()}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)]">
          {result.category.description?.toString() ||
            "Una seccion especial pensada para distintos estilos de coleccion."}
        </p>
      </div>

      {result.products.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {result.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          eyebrow="Sin productos"
          title="Esta categoria aun no tiene productos disponibles"
          description="Estamos preparando nuevas piezas para esta seccion. Vuelve pronto para ver novedades."
        />
      )}
    </div>
  );
}
