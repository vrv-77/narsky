import { EmptyState } from "@/components/shared/empty-state";
import { ProductCard } from "@/components/store/product-card";
import { Card } from "@/components/ui/card";
import { getCatalogSnapshot } from "@/services/storefront";

export default async function ProductsPage() {
  const catalog = await getCatalogSnapshot();

  return (
    <div className="app-shell space-y-10 py-10">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--secondary)]">
          Coleccion
        </p>
        <h1 className="mt-3 font-serif text-5xl text-[var(--foreground)]">
          Figuras, arte y detalles con estilo
        </h1>
      </div>

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <Card className="h-fit p-5">
          <p className="text-sm font-semibold text-[var(--foreground)]">Categorias</p>
          <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
            {catalog.categories.length > 0 ? (
              catalog.categories.map((category) => (
                <div
                  key={category.id}
                  className="rounded-2xl border border-black/5 bg-white/60 px-4 py-3"
                >
                  {category.name}
                </div>
              ))
            ) : (
              <p>Pronto agregaremos nuevas categorias.</p>
            )}
          </div>
        </Card>

        {catalog.products.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {catalog.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            eyebrow="Coleccion en preparacion"
            title="Aun no hay productos disponibles"
            description="Estamos preparando nuevas piezas para la vitrina de Narsky. Vuelve pronto para descubrir lo nuevo."
          />
        )}
      </div>
    </div>
  );
}
