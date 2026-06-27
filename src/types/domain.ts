export type ThemeMode = "light" | "dark" | "system";

export type HomeSections = {
  showBanner: boolean;
  showFeaturedProducts: boolean;
  showFeaturedCategories: boolean;
  showNewProducts: boolean;
  showActiveOffers: boolean;
  showShippingInfo: boolean;
  showPaymentMethods: boolean;
  showInformationBlock: boolean;
};

export type StoreSettingsSnapshot = {
  storeName: string;
  storeEmail: string | null;
  storePhone: string | null;
  currencyCode: string;
  shippingMessage: string | null;
  pickupMessage: string | null;
  checkoutMessage: string | null;
  footerText: string | null;
  homeSections: HomeSections;
};

export type ThemeSettingsSnapshot = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  mutedTextColor: string;
  buttonTextColor: string;
  borderRadius: string;
  contentMaxWidth: string;
  headingFont: string;
  bodyFont: string;
  mode: ThemeMode;
};

export type ProductCard = {
  id: string;
  slug: string;
  name: string;
  categoryName: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  isNew: boolean;
  isFeatured: boolean;
  primaryImage: string | null;
  secondaryImage: string | null;
};

export type CartPreviewItem = {
  productId: string;
  slug: string;
  name: string;
  image: string | null;
  unitPrice: number;
  quantity: number;
};

export type CartPreviewSnapshot = {
  items: CartPreviewItem[];
  subtotal: number;
  shipping: number;
  total: number;
};

export type CategoryCard = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
};

export type StorefrontSnapshot = {
  configured: boolean;
  storeSettings: StoreSettingsSnapshot;
  themeSettings: ThemeSettingsSnapshot;
  featuredProducts: ProductCard[];
  newestProducts: ProductCard[];
  featuredCategories: CategoryCard[];
  offerProducts: ProductCard[];
};

export type AdminSession = {
  userId: string;
  role: "admin" | "editor";
  expiresAt: string;
};
