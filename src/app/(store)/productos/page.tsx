import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { ProductCard } from "@/components/store/product-card";
import { Card } from "@/components/ui/card";
import { getCatalogSnapshot } from "@/services/storefront";
import type { ProductCard as ProductCardType } from "@/types/domain";

type ProductsPageProps = {
  searchParams?: Promise<{
    categoria?: string | string[];
    q?: string | string[];
  }>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function matchesThematicCategory(
  selectedCategory: string,
  product: ProductCardType,
) {
  const categoryName = product.categoryName?.toLowerCase() ?? "";
  const productName = product.name.toLowerCase();

  switch (selectedCategory) {
    case "ropa":
      return (
        categoryName.includes("ropa") ||
        productName.includes("hoodie") ||
        productName.includes("poler") ||
        productName.includes("ropa")
      );
    case "figuras":
      return (
        categoryName.includes("figuras") ||
        productName.includes("figura") ||
        productName.includes("oni") ||
        productName.includes("sakura")
      );
    case "accesorios":
      return (
        productName.includes("holder") ||
        productName.includes("headset") ||
        productName.includes("control") ||
        productName.includes("accesorio")
      );
    case "decoracion":
      return (
        categoryName.includes("deco") ||
        productName.includes("diorama") ||
        productName.includes("póster") ||
        productName.includes("poster") ||
        productName.includes("lámpara") ||
        productName.includes("lampara") ||
        productName.includes("totem")
      );
    case "regalos":
      return (
        productName.includes("caja") ||
        productName.includes("box") ||
        productName.includes("regalo") ||
        productName.includes("peluche")
      );
    default:
      return false;
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const catalog = await getCatalogSnapshot();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  const selectedCategory = firstValue(resolvedSearchParams?.categoria)?.trim() ?? "";
  const searchQuery = firstValue(resolvedSearchParams?.q)?.trim().toLowerCase() ?? "";

  const matchingCategory = catalog.categories.find(
    (category) => category.slug === selectedCategory,
  );

  const filteredProducts = catalog.products.filter((product) => {
    if (product.stock <= 0) {
      return false;
    }

    const matchesCategory = selectedCategory
      ? matchingCategory
        ? product.categoryName?.toLowerCase() === matchingCategory.name.toLowerCase()
        : matchesThematicCategory(selectedCategory, product)
      : true;

    const matchesName = searchQuery
      ? product.name.toLowerCase().includes(searchQuery)
      : true;

    return matchesCategory && matchesName;
  });

  const hasFilters = selectedCategory.length > 0 || searchQuery.length > 0;

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

          {hasFilters ? (
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              {matchingCategory ? (
                <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-white">
                  Categoría: {matchingCategory.name}
                </span>
              ) : null}
              {searchQuery ? (
                <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-white">
                  Nombre: {searchQuery}
                </span>
              ) : null}
            </div>
          ) : null}
        </Card>

        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          <Card className="neon-panel h-fit rounded-[1.75rem] p-5">
            <p className="text-sm font-semibold text-white">Categorías</p>
            <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
              <Link
                href="/productos"
                className="block rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-[var(--foreground)]"
              >
                Todas
              </Link>
              {catalog.categories.length > 0 ? (
                catalog.categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/productos?categoria=${category.slug}`}
                    className={`block rounded-2xl border px-4 py-3 text-[var(--foreground)] ${
                      selectedCategory === category.slug
                        ? "border-[var(--secondary)] bg-[rgba(52,215,255,0.12)]"
                        : "border-white/10 bg-white/6"
                    }`}
                  >
                    {category.name}
                  </Link>
                ))
              ) : (
                <p>Pronto agregaremos nuevas categorías.</p>
              )}
            </div>
          </Card>

          {filteredProducts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState
              eyebrow={hasFilters ? "Sin coincidencias" : "Colección en preparación"}
              title={
                hasFilters
                  ? "No encontramos productos en stock con esa búsqueda"
                  : "Aún no hay productos disponibles"
              }
              description={
                hasFilters
                  ? "Prueba otra categoría o escribe otro nombre de producto."
                  : "Estamos preparando nuevas piezas para la vitrina de Narsky. Vuelve pronto para descubrir lo nuevo."
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
