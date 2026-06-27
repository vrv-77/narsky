import { EmptyState } from "@/components/shared/empty-state";
import { ProductCard } from "@/components/store/product-card";
import { Card } from "@/components/ui/card";
import { getCatalogSnapshot } from "@/services/storefront";

export default async function ProductsPage() {
  const catalog = await getCatalogSnapshot();

  return (
    <div className="py-10">
      <div className="app-shell space-y-10">
        <Card className="neon-panel rounded-[1.75rem] p-6 lg:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--secondary)]">
            Colección
          </p>
          <h1 className="mt-3 font-serif text-5xl text-white">
            Figuras, arte y detalles con estilo
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)]">
            Explora la vitrina principal de Narsky con piezas anime, gamer y
            artesanales en un entorno más oscuro y legible.
          </p>
        </Card>

        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          <Card className="neon-panel h-fit rounded-[1.75rem] p-5">
            <p className="text-sm font-semibold text-white">Categorías</p>
            <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
              {catalog.categories.length > 0 ? (
                catalog.categories.map((category) => (
                  <div
                    key={category.id}
                    className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-[var(--foreground)]"
                  >
                    {category.name}
                  </div>
                ))
              ) : (
                <p>Pronto agregaremos nuevas categorías.</p>
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
              eyebrow="Colección en preparación"
              title="Aún no hay productos disponibles"
              description="Estamos preparando nuevas piezas para la vitrina de Narsky. Vuelve pronto para descubrir lo nuevo."
            />
          )}
        </div>
      </div>
    </div>
  );
}
