import Link from "next/link";
import { Palette, Sparkles, Swords, Truck } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { ProductCard } from "@/components/store/product-card";
import { Card } from "@/components/ui/card";
import { getStorefrontSnapshot } from "@/services/storefront";

export default async function StoreHomePage() {
  const snapshot = await getStorefrontSnapshot();
  const {
    storeSettings,
    featuredProducts,
    newestProducts,
    featuredCategories,
    offerProducts,
  } = snapshot;

  return (
    <div className="space-y-14 py-10">
      <section className="app-shell">
        <Card className="overflow-hidden px-8 py-10 lg:px-12 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--secondary)]">
                Coleccion anime y gamer
              </p>
              <h1 className="mt-5 max-w-3xl font-serif text-5xl leading-tight text-[var(--foreground)] lg:text-6xl">
                {storeSettings.storeName}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted)]">
                Descubre figuras, piezas decorativas y articulos artesanales con
                esencia otaku, gamer y coleccionable. En Narsky buscamos reunir
                detalles que se sientan especiales en tu repisa, setup o regalo.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/productos"
                  className="inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-[var(--primary-contrast)] shadow-sm"
                >
                  Ver coleccion
                </Link>
                <Link
                  href="/contacto"
                  className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/80 px-5 py-3 text-sm font-semibold text-[var(--foreground)]"
                >
                  Hablemos de tu pedido
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              <Card className="p-5">
                <Sparkles className="size-5 text-[var(--secondary)]" />
                <p className="mt-4 text-lg font-semibold text-[var(--foreground)]">
                  Detalles con identidad
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  Piezas pensadas para fans del anime, el gaming y la cultura pop,
                  con un look calido, expresivo y coleccionable.
                </p>
              </Card>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-5">
                  <Truck className="size-5 text-[var(--secondary)]" />
                  <p className="mt-4 text-sm font-semibold text-[var(--foreground)]">
                    Envio y retiro
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    {storeSettings.shippingMessage ||
                      "Pronto compartiremos opciones de entrega y retiro para que compres con tranquilidad."}
                  </p>
                </Card>
                <Card className="p-5">
                  <Palette className="size-5 text-[var(--secondary)]" />
                  <p className="mt-4 text-sm font-semibold text-[var(--foreground)]">
                    Hecho para fans
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    Figuras, adornos y piezas inspiradas en universos anime, gamer
                    y fantasia para dar personalidad a tu espacio.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="app-shell">
        <div className="grid gap-5 md:grid-cols-3">
          <Card className="p-6">
            <Swords className="size-5 text-[var(--secondary)]" />
            <p className="mt-4 text-lg font-semibold text-[var(--foreground)]">
              Figuras con caracter
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              Seleccion pensada para fans de heroes, villanos y personajes que
              merecen un lugar especial en tu coleccion.
            </p>
          </Card>
          <Card className="p-6">
            <Palette className="size-5 text-[var(--secondary)]" />
            <p className="mt-4 text-lg font-semibold text-[var(--foreground)]">
              Toque artesanal
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              Narsky mezcla creatividad, color y textura para que cada pieza
              transmita personalidad propia.
            </p>
          </Card>
          <Card className="p-6">
            <Sparkles className="size-5 text-[var(--secondary)]" />
            <p className="mt-4 text-lg font-semibold text-[var(--foreground)]">
              Para regalar o coleccionar
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              Desde detalles pequenos hasta figuras protagonistas, la idea es que
              encuentres algo que conecte contigo.
            </p>
          </Card>
        </div>
      </section>

      {featuredProducts.length > 0 ? (
        <section className="app-shell space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--secondary)]">
                Destacados
              </p>
              <h2 className="mt-3 font-serif text-4xl text-[var(--foreground)]">
                Piezas favoritas
              </h2>
            </div>
            <Link href="/productos" className="text-sm font-medium text-[var(--secondary)]">
              Ver todos
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : null}

      {featuredCategories.length > 0 ? (
        <section className="app-shell space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--secondary)]">
              Categorias
            </p>
            <h2 className="mt-3 font-serif text-4xl text-[var(--foreground)]">
              Explora por estilo
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featuredCategories.map((category) => (
              <Card key={category.id} className="p-5">
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  {category.name}
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  {category.description || "Una seleccion especial para distintos gustos y colecciones."}
                </p>
                <Link
                  href={`/categorias/${category.slug}`}
                  className="mt-4 inline-flex text-sm font-medium text-[var(--secondary)]"
                >
                  Ver categoria
                </Link>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      {newestProducts.length > 0 ? (
        <section className="app-shell space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--secondary)]">
              Novedades
            </p>
            <h2 className="mt-3 font-serif text-4xl text-[var(--foreground)]">
              Recien llegados
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {newestProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : null}

      {offerProducts.length > 0 ? (
        <section className="app-shell space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--secondary)]">
              Ofertas
            </p>
            <h2 className="mt-3 font-serif text-4xl text-[var(--foreground)]">
              Oportunidades para tu coleccion
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {offerProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : null}

      {!snapshot.configured ? (
        <section className="app-shell">
          <EmptyState
            eyebrow="Muy pronto"
            title="Narsky esta preparando su vitrina"
            description="Estamos afinando la seleccion para mostrarte figuras, detalles decorativos y creaciones con estilo anime y gamer."
          />
        </section>
      ) : featuredProducts.length === 0 &&
        newestProducts.length === 0 &&
        featuredCategories.length === 0 ? (
        <section className="app-shell">
          <EmptyState
            eyebrow="Coleccion en preparacion"
            title="Aun no hay productos disponibles"
            description="Muy pronto veras aqui figuras, accesorios y articulos artesanales listos para descubrir."
          />
        </section>
      ) : null}
    </div>
  );
}
