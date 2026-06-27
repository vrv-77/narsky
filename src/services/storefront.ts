import "server-only";

import { hasSupabaseBrowserEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  CartPreviewSnapshot,
  CategoryCard,
  HomeSections,
  ProductCard,
  StoreSettingsSnapshot,
  StorefrontSnapshot,
  ThemeSettingsSnapshot,
} from "@/types/domain";

type DemoProduct = ProductCard & {
  categorySlug: string;
  shortDescription: string;
  description: string;
  sku: string;
  allowBackorder: boolean;
};

const defaultHomeSections: HomeSections = {
  showBanner: true,
  showFeaturedProducts: true,
  showFeaturedCategories: true,
  showNewProducts: true,
  showActiveOffers: true,
  showShippingInfo: true,
  showPaymentMethods: true,
  showInformationBlock: true,
};

const defaultStoreSettings: StoreSettingsSnapshot = {
  storeName: "Narsky",
  storeEmail: null,
  storePhone: null,
  currencyCode: "CLP",
  shippingMessage: null,
  pickupMessage: null,
  checkoutMessage: null,
  footerText: null,
  homeSections: defaultHomeSections,
};

const defaultThemeSettings: ThemeSettingsSnapshot = {
  primaryColor: "#ff4fd8",
  secondaryColor: "#34d7ff",
  accentColor: "#8b5cf6",
  backgroundColor: "#060816",
  surfaceColor: "#0d1330",
  textColor: "#f8f7ff",
  mutedTextColor: "#a8b4d9",
  buttonTextColor: "#ffffff",
  borderRadius: "1.25rem",
  contentMaxWidth: "1200px",
  headingFont: "var(--font-source-serif), serif",
  bodyFont: "var(--font-manrope), sans-serif",
  mode: "dark",
};

const demoCategories: CategoryCard[] = [
  {
    id: "demo-cat-figuras-anime",
    slug: "figuras-anime",
    name: "Figuras Anime",
    description:
      "Personajes con pose, color y presencia para destacar en tu repisa.",
  },
  {
    id: "demo-cat-deco-gamer",
    slug: "deco-gamer",
    name: "Deco Gamer",
    description:
      "Detalles para escritorio y setup con vibra pixel, neon y fantasia.",
  },
  {
    id: "demo-cat-artesanal-fantasia",
    slug: "artesanal-fantasia",
    name: "Artesanal Fantasia",
    description:
      "Piezas decorativas con acabado manual y espiritu coleccionable.",
  },
];

function createDemoImage(
  title: string,
  backgroundFrom: string,
  backgroundTo: string,
  accent: string,
) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${backgroundFrom}" />
          <stop offset="100%" stop-color="${backgroundTo}" />
        </linearGradient>
      </defs>
      <rect width="800" height="1000" rx="48" fill="url(#bg)" />
      <circle cx="620" cy="180" r="110" fill="${accent}" opacity="0.28" />
      <circle cx="180" cy="820" r="140" fill="${accent}" opacity="0.18" />
      <rect x="120" y="170" width="560" height="560" rx="44" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.4)" />
      <text x="400" y="360" text-anchor="middle" fill="#fffaf5" font-family="Arial, sans-serif" font-size="54" font-weight="700">
        NARSKY
      </text>
      <text x="400" y="470" text-anchor="middle" fill="#fffaf5" font-family="Arial, sans-serif" font-size="36">
        ${title}
      </text>
      <text x="400" y="850" text-anchor="middle" fill="rgba(255,250,245,0.88)" font-family="Arial, sans-serif" font-size="28">
        Coleccion de ejemplo
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const demoProducts: DemoProduct[] = [
  {
    id: "demo-product-oni-blade",
    slug: "figura-oni-blade",
    name: "Figura Oni Blade",
    categoryName: "Figuras Anime",
    categorySlug: "figuras-anime",
    price: 24990,
    compareAtPrice: 29990,
    stock: 6,
    isNew: true,
    isFeatured: true,
    primaryImage: createDemoImage(
      "Oni Blade",
      "#7c3aed",
      "#1f1b4b",
      "#fb7185",
    ),
    secondaryImage: createDemoImage(
      "Oni Blade Alt",
      "#312e81",
      "#111827",
      "#f59e0b",
    ),
    shortDescription:
      "Figura de muestra inspirada en heroes oscuros y energia de batalla.",
    description:
      "Una pieza demo con presencia dramatica, paleta intensa y energia anime para imaginar la vitrina de Narsky.",
    sku: "NAR-DEMO-001",
    allowBackorder: false,
  },
  {
    id: "demo-product-pixel-shrine",
    slug: "diorama-pixel-shrine",
    name: "Diorama Pixel Shrine",
    categoryName: "Deco Gamer",
    categorySlug: "deco-gamer",
    price: 18990,
    compareAtPrice: null,
    stock: 4,
    isNew: true,
    isFeatured: true,
    primaryImage: createDemoImage(
      "Pixel Shrine",
      "#0f766e",
      "#082f49",
      "#facc15",
    ),
    secondaryImage: createDemoImage(
      "Pixel Shrine Alt",
      "#164e63",
      "#1e293b",
      "#38bdf8",
    ),
    shortDescription:
      "Mini escenario decorativo para escritorios con aire retro gamer.",
    description:
      "Este ejemplo mezcla atmosfera arcade, color y textura para visualizar una linea de decoracion inspirada en videojuegos.",
    sku: "NAR-DEMO-002",
    allowBackorder: false,
  },
  {
    id: "demo-product-kitsune-stand",
    slug: "holder-kitsune-neon",
    name: "Holder Kitsune Neon",
    categoryName: "Deco Gamer",
    categorySlug: "deco-gamer",
    price: 15990,
    compareAtPrice: 19990,
    stock: 8,
    isNew: false,
    isFeatured: true,
    primaryImage: createDemoImage(
      "Kitsune Neon",
      "#ea580c",
      "#7c2d12",
      "#22d3ee",
    ),
    secondaryImage: createDemoImage(
      "Kitsune Neon Alt",
      "#9a3412",
      "#1f2937",
      "#c084fc",
    ),
    shortDescription:
      "Soporte decorativo de ejemplo para headset, control o accesorios.",
    description:
      "Una referencia de producto pensada para setups con identidad, mezclando fantasia japonesa y color neon.",
    sku: "NAR-DEMO-003",
    allowBackorder: false,
  },
  {
    id: "demo-product-slime-totem",
    slug: "totem-slime-arcano",
    name: "Totem Slime Arcano",
    categoryName: "Artesanal Fantasia",
    categorySlug: "artesanal-fantasia",
    price: 13990,
    compareAtPrice: null,
    stock: 5,
    isNew: false,
    isFeatured: false,
    primaryImage: createDemoImage(
      "Slime Arcano",
      "#2563eb",
      "#172554",
      "#34d399",
    ),
    secondaryImage: createDemoImage(
      "Slime Arcano Alt",
      "#1d4ed8",
      "#1e3a8a",
      "#f472b6",
    ),
    shortDescription:
      "Pieza decorativa de muestra para fans de fantasia y criaturas magicas.",
    description:
      "Un articulo demo con look tierno, fantastico y coleccionable para ambientar escritorios y rincones especiales.",
    sku: "NAR-DEMO-004",
    allowBackorder: false,
  },
];

function getDemoStorefrontSnapshot(): StorefrontSnapshot {
  const featuredProducts = demoProducts.filter((product) => product.isFeatured);
  const newestProducts = demoProducts.filter((product) => product.isNew);
  const offerProducts = demoProducts.filter(
    (product) =>
      product.compareAtPrice !== null && product.compareAtPrice > product.price,
  );

  return {
    configured: false,
    storeSettings: defaultStoreSettings,
    themeSettings: defaultThemeSettings,
    featuredProducts,
    newestProducts,
    featuredCategories: demoCategories,
    offerProducts,
  };
}

function mapProduct(record: Record<string, unknown>): ProductCard {
  const images = Array.isArray(record.product_images)
    ? (record.product_images as Array<Record<string, unknown>>)
    : [];
  const primaryImage =
    images.find((image) => image.is_primary)?.image_url?.toString() ??
    images[0]?.image_url?.toString() ??
    null;
  const secondaryImage =
    images.find((image) => !image.is_primary)?.image_url?.toString() ?? null;

  return {
    id: record.id?.toString() ?? "",
    slug: record.slug?.toString() ?? "",
    name: record.name?.toString() ?? "Producto",
    categoryName:
      (record.categories as Record<string, unknown> | null)?.name?.toString() ??
      null,
    price: Number(record.price ?? 0),
    compareAtPrice: record.compare_at_price
      ? Number(record.compare_at_price)
      : null,
    stock: Number(record.stock ?? 0),
    isNew: Boolean(record.is_new),
    isFeatured: Boolean(record.is_featured),
    primaryImage,
    secondaryImage,
  };
}

function mapCategory(record: Record<string, unknown>): CategoryCard {
  return {
    id: record.id?.toString() ?? "",
    slug: record.slug?.toString() ?? "",
    name: record.name?.toString() ?? "Categoria",
    description: record.description?.toString() ?? null,
  };
}

export async function getStorefrontSnapshot(): Promise<StorefrontSnapshot> {
  if (!hasSupabaseBrowserEnv()) {
    return getDemoStorefrontSnapshot();
  }

  const supabase = await createSupabaseServerClient();
  const [
    storeSettingsResult,
    themeSettingsResult,
    featuredProductsResult,
    newestProductsResult,
    categoriesResult,
  ] = await Promise.all([
    supabase
      .from("store_settings")
      .select(
        "store_name, store_email, store_phone, currency_code, shipping_message, pickup_message, checkout_message, footer_text, home_sections",
      )
      .eq("is_active", true)
      .limit(1)
      .maybeSingle(),
    supabase
      .from("theme_settings")
      .select(
        "primary_color, secondary_color, accent_color, background_color, surface_color, text_color, muted_text_color, button_text_color, border_radius, content_max_width, heading_font, body_font, theme_mode",
      )
      .eq("is_active", true)
      .limit(1)
      .maybeSingle(),
    supabase
      .from("products")
      .select(
        "id, slug, name, price, compare_at_price, stock, is_new, is_featured, categories(name), product_images(image_url, is_primary)",
      )
      .eq("status", "active")
      .eq("is_featured", true)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("products")
      .select(
        "id, slug, name, price, compare_at_price, stock, is_new, is_featured, categories(name), product_images(image_url, is_primary)",
      )
      .eq("status", "active")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("categories")
      .select("id, slug, name, description")
      .eq("status", "active")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true })
      .limit(8),
  ]);

  const storeSettingsRecord =
    storeSettingsResult.data as Record<string, unknown> | null;
  const themeSettingsRecord =
    themeSettingsResult.data as Record<string, unknown> | null;

  const storeSettings: StoreSettingsSnapshot = {
    ...defaultStoreSettings,
    storeName:
      storeSettingsRecord?.store_name?.toString() ||
      defaultStoreSettings.storeName,
    storeEmail: storeSettingsRecord?.store_email?.toString() ?? null,
    storePhone: storeSettingsRecord?.store_phone?.toString() ?? null,
    currencyCode:
      storeSettingsRecord?.currency_code?.toString() ||
      defaultStoreSettings.currencyCode,
    shippingMessage: storeSettingsRecord?.shipping_message?.toString() ?? null,
    pickupMessage: storeSettingsRecord?.pickup_message?.toString() ?? null,
    checkoutMessage: storeSettingsRecord?.checkout_message?.toString() ?? null,
    footerText: storeSettingsRecord?.footer_text?.toString() ?? null,
    homeSections:
      (storeSettingsRecord?.home_sections as HomeSections | undefined) ??
      defaultHomeSections,
  };

  const themeSettings: ThemeSettingsSnapshot = {
    ...defaultThemeSettings,
    primaryColor:
      themeSettingsRecord?.primary_color?.toString() ||
      defaultThemeSettings.primaryColor,
    secondaryColor:
      themeSettingsRecord?.secondary_color?.toString() ||
      defaultThemeSettings.secondaryColor,
    accentColor:
      themeSettingsRecord?.accent_color?.toString() ||
      defaultThemeSettings.accentColor,
    backgroundColor:
      themeSettingsRecord?.background_color?.toString() ||
      defaultThemeSettings.backgroundColor,
    surfaceColor:
      themeSettingsRecord?.surface_color?.toString() ||
      defaultThemeSettings.surfaceColor,
    textColor:
      themeSettingsRecord?.text_color?.toString() ||
      defaultThemeSettings.textColor,
    mutedTextColor:
      themeSettingsRecord?.muted_text_color?.toString() ||
      defaultThemeSettings.mutedTextColor,
    buttonTextColor:
      themeSettingsRecord?.button_text_color?.toString() ||
      defaultThemeSettings.buttonTextColor,
    borderRadius:
      themeSettingsRecord?.border_radius?.toString() ||
      defaultThemeSettings.borderRadius,
    contentMaxWidth:
      themeSettingsRecord?.content_max_width?.toString() ||
      defaultThemeSettings.contentMaxWidth,
    headingFont:
      themeSettingsRecord?.heading_font?.toString() ||
      defaultThemeSettings.headingFont,
    bodyFont:
      themeSettingsRecord?.body_font?.toString() || defaultThemeSettings.bodyFont,
    mode:
      (themeSettingsRecord?.theme_mode?.toString() as ThemeSettingsSnapshot["mode"]) ||
      defaultThemeSettings.mode,
  };

  const featuredProducts = (featuredProductsResult.data ?? []).map((product) =>
    mapProduct(product as Record<string, unknown>),
  );
  const newestProducts = (newestProductsResult.data ?? []).map((product) =>
    mapProduct(product as Record<string, unknown>),
  );
  const featuredCategories = (categoriesResult.data ?? []).map((category) =>
    mapCategory(category as Record<string, unknown>),
  );

  return {
    configured: true,
    storeSettings,
    themeSettings,
    featuredProducts,
    newestProducts,
    featuredCategories,
    offerProducts: newestProducts.filter(
      (product) =>
        product.compareAtPrice !== null && product.compareAtPrice > product.price,
    ),
  };
}

export async function getCatalogSnapshot() {
  const storefront = await getStorefrontSnapshot();

  if (!storefront.configured) {
    return {
      ...storefront,
      products: demoProducts as ProductCard[],
      categories: demoCategories,
    };
  }

  const supabase = await createSupabaseServerClient();
  const [productsResult, categoriesResult] = await Promise.all([
    supabase
      .from("products")
      .select(
        "id, slug, name, price, compare_at_price, stock, is_new, is_featured, categories(name), product_images(image_url, is_primary)",
      )
      .eq("status", "active")
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("categories")
      .select("id, slug, name, description")
      .eq("status", "active")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true }),
  ]);

  return {
    ...storefront,
    products: (productsResult.data ?? []).map((product) =>
      mapProduct(product as Record<string, unknown>),
    ),
    categories: (categoriesResult.data ?? []).map((category) =>
      mapCategory(category as Record<string, unknown>),
    ),
  };
}

export async function getProductBySlug(slug: string) {
  if (!hasSupabaseBrowserEnv()) {
    const demoProduct = demoProducts.find((product) => product.slug === slug);

    if (!demoProduct) {
      return null;
    }

    return {
      id: demoProduct.id,
      slug: demoProduct.slug,
      name: demoProduct.name,
      short_description: demoProduct.shortDescription,
      description: demoProduct.description,
      sku: demoProduct.sku,
      price: demoProduct.price,
      compare_at_price: demoProduct.compareAtPrice,
      stock: demoProduct.stock,
      allow_backorder: demoProduct.allowBackorder,
      status: "active",
      categories: {
        name: demoProduct.categoryName,
        slug: demoProduct.categorySlug,
      },
      product_images: [
        {
          image_url: demoProduct.primaryImage,
          alt_text: demoProduct.name,
          is_primary: true,
        },
        {
          image_url: demoProduct.secondaryImage,
          alt_text: `${demoProduct.name} detalle`,
          is_primary: false,
        },
      ],
    } as Record<string, unknown>;
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("products")
    .select(
      "id, slug, name, short_description, description, sku, price, compare_at_price, stock, allow_backorder, status, categories(name, slug), product_images(image_url, alt_text, is_primary)",
    )
    .eq("slug", slug)
    .eq("status", "active")
    .is("deleted_at", null)
    .maybeSingle();

  return data as Record<string, unknown> | null;
}

export async function getCategoryBySlug(slug: string) {
  if (!hasSupabaseBrowserEnv()) {
    const category = demoCategories.find((item) => item.slug === slug) ?? null;

    return {
      category,
      products: demoProducts
        .filter((product) => product.categorySlug === slug)
        .map((product) => product as ProductCard),
    };
  }

  const supabase = await createSupabaseServerClient();
  const categoryResult = await supabase
    .from("categories")
    .select("id, slug, name, description")
    .eq("slug", slug)
    .eq("status", "active")
    .is("deleted_at", null)
    .maybeSingle();

  if (!categoryResult.data) {
    return {
      category: null,
      products: [] as ProductCard[],
    };
  }

  const productsResult = await supabase
    .from("products")
    .select(
      "id, slug, name, price, compare_at_price, stock, is_new, is_featured, categories(name), product_images(image_url, is_primary)",
    )
    .eq("status", "active")
    .eq("category_id", categoryResult.data.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  return {
    category: categoryResult.data as Record<string, unknown> | null,
    products: (productsResult.data ?? []).map((product) =>
      mapProduct(product as Record<string, unknown>),
    ),
  };
}

export async function getCartPreviewSnapshot(): Promise<CartPreviewSnapshot | null> {
  if (hasSupabaseBrowserEnv()) {
    return null;
  }

  const items = [
    {
      productId: demoProducts[0].id,
      slug: demoProducts[0].slug,
      name: demoProducts[0].name,
      image: demoProducts[0].primaryImage,
      unitPrice: demoProducts[0].price,
      quantity: 1,
    },
    {
      productId: demoProducts[2].id,
      slug: demoProducts[2].slug,
      name: demoProducts[2].name,
      image: demoProducts[2].primaryImage,
      unitPrice: demoProducts[2].price,
      quantity: 2,
    },
  ];

  const subtotal = items.reduce(
    (accumulator, item) => accumulator + item.unitPrice * item.quantity,
    0,
  );
  const shipping = subtotal >= 50000 ? 0 : 3990;

  return {
    items,
    subtotal,
    shipping,
    total: subtotal + shipping,
  };
}
