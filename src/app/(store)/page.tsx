import Image from "next/image";
import Link from "next/link";
import {
  Gift,
  Headphones,
  Palette,
  ShieldCheck,
  Shirt,
  Sparkles,
  Swords,
  Truck,
} from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { ProductCard } from "@/components/store/product-card";
import { Card } from "@/components/ui/card";
import { formatClp } from "@/lib/utils";
import { getStorefrontSnapshot } from "@/services/storefront";

export default async function StoreHomePage() {
  const snapshot = await getStorefrontSnapshot();
  const { featuredProducts, newestProducts, featuredCategories, offerProducts } =
    snapshot;

  const allShowcaseProducts = Array.from(
    new Map(
      [...featuredProducts, ...newestProducts, ...offerProducts].map((product) => [
        product.id,
        product,
      ]),
    ).values(),
  );

  const spotlightProducts = allShowcaseProducts.slice(0, 4);
  const trendProducts = allShowcaseProducts.slice(0, 4);

  const maxDiscount = offerProducts.reduce((highestDiscount, product) => {
    if (!product.compareAtPrice || product.compareAtPrice <= product.price) {
      return highestDiscount;
    }

    const discount = Math.round(
      ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100,
    );

    return Math.max(highestDiscount, discount);
  }, 0);

  const quickCategories = [
    {
      name: "Ropa",
      description: "Viste tu pasión anime",
      href: "/productos",
      image: allShowcaseProducts[0]?.primaryImage ?? null,
      icon: Shirt,
    },
    {
      name: "Figuras",
      description: "Coleccionables con presencia",
      href: "/productos",
      image:
        allShowcaseProducts[1]?.primaryImage ??
        allShowcaseProducts[0]?.primaryImage ??
        null,
      icon: Swords,
    },
    {
      name: "Accesorios",
      description: "Detalles para tu setup",
      href: "/productos",
      image:
        allShowcaseProducts[2]?.primaryImage ??
        allShowcaseProducts[0]?.primaryImage ??
        null,
      icon: Headphones,
    },
    {
      name: "Decoración",
      description: "Espacios con vibra neón",
      href: "/productos",
      image:
        allShowcaseProducts[3]?.primaryImage ??
        allShowcaseProducts[1]?.primaryImage ??
        null,
      icon: Palette,
    },
    {
      name: "Regalos",
      description: "Ideas para sorprender fans",
      href: "/productos",
      image:
        allShowcaseProducts[0]?.secondaryImage ??
        allShowcaseProducts[2]?.primaryImage ??
        null,
      icon: Gift,
    },
  ];

  return (
    <div className="space-y-10 py-8 lg:space-y-12 lg:py-10">
      <section className="app-shell">
        <Card className="neon-panel neon-outline overflow-hidden rounded-[2rem] border border-white/10 p-5 lg:p-6">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10">
            <div className="relative aspect-[1536/864] min-h-[540px] lg:min-h-[620px]">
              <Image
                src="/hero-anime-narsky-home.png"
                alt="Chica anime con bolsas Narsky en una ciudad neón"
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,10,29,0.86)_0%,rgba(8,10,29,0.7)_24%,rgba(8,10,29,0.18)_50%,rgba(8,10,29,0.12)_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,79,216,0.14),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(57,215,255,0.12),transparent_22%)]" />

              <div className="relative z-10 flex min-h-[540px] items-start p-6 lg:min-h-[620px] lg:p-8">
                <div className="flex max-w-[28rem] flex-col justify-start pt-5 lg:pt-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--secondary)]">
                    Tienda anime y gamer
                  </p>
                  <h1 className="mt-4 text-5xl font-black uppercase leading-[0.88] tracking-tight text-white lg:text-[5rem]">
                    Descubre
                    <span className="block bg-[linear-gradient(90deg,#ff65df_0%,#c472ff_42%,#38d8ff_100%)] bg-clip-text text-transparent">
                      tu estilo
                    </span>
                    <span className="block bg-[linear-gradient(90deg,#ff65df_0%,#c472ff_42%,#38d8ff_100%)] bg-clip-text text-transparent">
                      anime
                    </span>
                  </h1>
                  <p className="mt-5 max-w-xl text-base leading-8 text-[rgba(240,243,255,0.84)]">
                    Figuras, accesorios, decoración y regalos con vibra neón para
                    fans del anime, el gaming y la cultura kawaii.
                  </p>

                  <div className="mt-7 flex flex-wrap gap-4">
                    <Link
                      href="/productos"
                      className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(90deg,var(--primary),#ff84e7)] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_26px_rgba(255,79,216,0.35)]"
                    >
                      Comprar colección
                    </Link>
                    <Link
                      href="/productos"
                      className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/8 px-6 py-3 text-sm font-semibold text-[var(--foreground)]"
                    >
                      Ver ofertas
                    </Link>
                  </div>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <div className="neon-chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-[0.16em]">
                      <ShieldCheck className="size-4 text-[var(--secondary)]" />
                      Compra segura
                    </div>
                    <div className="neon-chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-[0.16em]">
                      <Truck className="size-4 text-[var(--secondary)]" />
                      Envíos flexibles
                    </div>
                    <div className="neon-chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-[0.16em]">
                      <Sparkles className="size-4 text-[var(--secondary)]" />
                      Estilo fan-made
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="-mt-12 relative z-20 px-2 lg:px-4">
            <div className="grid gap-4 lg:grid-cols-5">
              {quickCategories.map((category) => {
                const Icon = category.icon;

                return (
                  <Link key={category.name} href={category.href}>
                    <Card className="neon-panel h-full rounded-[1.5rem] border border-white/10 bg-[rgba(12,17,44,0.92)] p-4 hover:-translate-y-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="inline-flex rounded-full bg-[rgba(255,79,216,0.12)] p-2 text-[var(--secondary)]">
                            <Icon className="size-4" />
                          </div>
                          <p className="mt-3 text-xl font-semibold text-white">
                            {category.name}
                          </p>
                          <p className="mt-2 max-w-[14rem] text-sm leading-6 text-[var(--muted)]">
                            {category.description}
                          </p>
                        </div>
                        {category.image ? (
                          <Image
                            src={category.image}
                            alt={category.name}
                            width={84}
                            height={84}
                            className="rounded-2xl border border-white/10 object-cover shadow-[0_0_20px_rgba(255,79,216,0.18)]"
                          />
                        ) : null}
                      </div>
                      <span className="mt-4 inline-flex text-sm font-medium text-[var(--secondary)]">
                        Explorar →
                      </span>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </Card>
      </section>

      <section className="app-shell">
        <Card className="neon-panel rounded-[2rem] border border-white/10 p-6 lg:p-8">
          <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
            <div className="space-y-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--secondary)]">
                    Productos destacados
                  </p>
                  <h2 className="mt-2 font-serif text-4xl text-white">
                    Selección principal
                  </h2>
                </div>
                <Link
                  href="/productos"
                  className="text-sm font-medium text-[var(--secondary)]"
                >
                  Ver todo
                </Link>
              </div>

              <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
                {spotlightProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <Card className="neon-panel rounded-[1.5rem] p-4 text-center">
                  <p className="text-2xl font-black text-white">50K+</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">Fans felices</p>
                </Card>
                <Card className="neon-panel rounded-[1.5rem] p-4 text-center">
                  <p className="text-2xl font-black text-white">200K+</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Vistas en vitrina
                  </p>
                </Card>
                <Card className="neon-panel rounded-[1.5rem] p-4 text-center">
                  <p className="text-2xl font-black text-white">100%</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">Pago protegido</p>
                </Card>
                <Card className="neon-panel rounded-[1.5rem] p-4 text-center">
                  <p className="text-2xl font-black text-white">Rápido</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Despacho y retiro
                  </p>
                </Card>
              </div>
            </div>

            <Card className="neon-panel rounded-[1.75rem] p-5">
              <div className="rounded-[1.5rem] border border-[rgba(52,215,255,0.16)] bg-[rgba(255,255,255,0.04)] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--secondary)]">
                  Solo por tiempo limitado
                </p>
                <h3 className="mt-3 text-3xl font-black uppercase leading-none text-white">
                  Mega
                  <span className="block bg-[linear-gradient(90deg,#ff68df_0%,#38d8ff_100%)] bg-clip-text text-transparent">
                    oferta
                  </span>
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                  Hasta {maxDiscount > 0 ? `${maxDiscount}%` : "15%"} de descuento
                  en productos destacados.
                </p>
                <Link
                  href="/productos"
                  className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(90deg,#36d8ff_0%,#5db6ff_100%)] px-5 py-3 text-sm font-semibold text-[#09111f] shadow-[0_0_24px_rgba(52,215,255,0.35)]"
                >
                  Comprar oferta
                </Link>
              </div>

              <div className="mt-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--secondary)]">
                    Tendencia ahora
                  </p>
                  <h2 className="mt-2 font-serif text-3xl text-white">
                    Lo que más miran
                  </h2>
                </div>
                <Link
                  href="/productos"
                  className="text-sm font-medium text-[var(--secondary)]"
                >
                  Ver todo
                </Link>
              </div>

              <div className="mt-5 space-y-4">
                {trendProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 rounded-[1.25rem] border border-white/10 bg-white/5 p-3"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--primary),var(--secondary))] text-xs font-black text-white">
                      {index + 1}
                    </div>
                    {product.primaryImage ? (
                      <Image
                        src={product.primaryImage}
                        alt={product.name}
                        width={86}
                        height={62}
                        className="rounded-xl border border-white/10 object-cover"
                      />
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">
                        {product.name}
                      </p>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {formatClp(product.price)}
                      </p>
                    </div>
                    <Link
                      href="/carrito"
                      className="rounded-full bg-[rgba(255,79,216,0.18)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white"
                    >
                      Ir
                    </Link>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Card>
      </section>

      {featuredCategories.length > 0 ? (
        <section className="app-shell space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--secondary)]">
              Categorías
            </p>
            <h2 className="mt-3 font-serif text-4xl text-white">
              Explora más estilos
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featuredCategories.map((category) => (
              <Card key={category.id} className="neon-panel rounded-[1.5rem] p-5">
                <p className="text-sm font-semibold text-white">{category.name}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  {category.description ||
                    "Una selección especial para distintos gustos y colecciones."}
                </p>
                <Link
                  href={`/categorias/${category.slug}`}
                  className="mt-4 inline-flex text-sm font-medium text-[var(--secondary)]"
                >
                  Ver categoría
                </Link>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      {!snapshot.configured ? (
        <section className="app-shell">
          <EmptyState
            eyebrow="Muy pronto"
            title="Narsky está preparando su vitrina"
            description="Estamos afinando la selección para mostrarte figuras, accesorios y decoración con estilo anime y gamer."
          />
        </section>
      ) : featuredProducts.length === 0 &&
        newestProducts.length === 0 &&
        featuredCategories.length === 0 ? (
        <section className="app-shell">
          <EmptyState
            eyebrow="Colección en preparación"
            title="Aún no hay productos disponibles"
            description="Muy pronto verás aquí figuras, accesorios y artículos artesanales listos para descubrir."
          />
        </section>
      ) : null}
    </div>
  );
}
