"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import type { CartPreviewItem, ProductCard } from "@/types/domain";

const STORAGE_KEY = "narsky-cart";
const cartListeners = new Set<() => void>();
const EMPTY_CART: CartPreviewItem[] = [];

let cachedRawCart = "";
let cachedCartSnapshot: CartPreviewItem[] = EMPTY_CART;

export type CartProduct = Pick<
  ProductCard,
  "id" | "slug" | "name" | "price" | "primaryImage" | "stock"
>;

type CartContextValue = {
  items: CartPreviewItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  addItem: (product: CartProduct) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
};

const CartContext = createContext<CartContextValue | null>(null);

function getShipping(subtotal: number) {
  if (subtotal === 0) {
    return 0;
  }

  return subtotal >= 50000 ? 0 : 3990;
}

function normalizeCartItem(item: unknown): CartPreviewItem | null {
  if (!item || typeof item !== "object") {
    return null;
  }

  const record = item as Record<string, unknown>;
  const quantity = Number(record.quantity ?? 0);
  const unitPrice = Number(record.unitPrice ?? 0);
  const productId = record.productId?.toString() ?? "";
  const slug = record.slug?.toString() ?? "";
  const name = record.name?.toString() ?? "";

  if (!productId || !slug || !name || quantity <= 0 || unitPrice < 0) {
    return null;
  }

  return {
    productId,
    slug,
    name,
    image: record.image?.toString() ?? null,
    unitPrice,
    quantity,
  };
}

function readStoredCart() {
  if (typeof window === "undefined") {
    return EMPTY_CART;
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY) ?? "";

    if (rawValue === cachedRawCart) {
      return cachedCartSnapshot;
    }

    if (!rawValue) {
      cachedRawCart = "";
      cachedCartSnapshot = EMPTY_CART;
      return cachedCartSnapshot;
    }

    const parsed = JSON.parse(rawValue);

    if (!Array.isArray(parsed)) {
      cachedRawCart = "";
      cachedCartSnapshot = EMPTY_CART;
      return cachedCartSnapshot;
    }

    cachedRawCart = rawValue;
    cachedCartSnapshot = parsed
      .map((item) => normalizeCartItem(item))
      .filter((item): item is CartPreviewItem => item !== null);
    return cachedCartSnapshot;
  } catch {
    cachedRawCart = "";
    cachedCartSnapshot = EMPTY_CART;
    return cachedCartSnapshot;
  }
}

function emitCartChange() {
  cartListeners.forEach((listener) => listener());
}

function writeStoredCart(items: CartPreviewItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  emitCartChange();
}

function updateStoredCart(
  updater: (items: CartPreviewItem[]) => CartPreviewItem[],
) {
  writeStoredCart(updater(readStoredCart()));
}

function subscribeToCart(listener: () => void) {
  cartListeners.add(listener);

  if (typeof window === "undefined") {
    return () => {
      cartListeners.delete(listener);
    };
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      listener();
    }
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    cartListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function getCartSnapshot() {
  return readStoredCart();
}

function getCartServerSnapshot() {
  return EMPTY_CART;
}

export function StoreCartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getCartServerSnapshot,
  );

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce(
      (accumulator, item) => accumulator + item.unitPrice * item.quantity,
      0,
    );
    const shipping = getShipping(subtotal);
    const itemCount = items.reduce(
      (accumulator, item) => accumulator + item.quantity,
      0,
    );

    return {
      items,
      itemCount,
      subtotal,
      shipping,
      total: subtotal + shipping,
      addItem: (product) => {
        updateStoredCart((currentItems) => {
          const existingItem = currentItems.find(
            (item) => item.productId === product.id,
          );

          if (existingItem) {
            return currentItems.map((item) =>
              item.productId === product.id
                ? {
                    ...item,
                    quantity: Math.min(item.quantity + 1, product.stock),
                  }
                : item,
            );
          }

          return [
            ...currentItems,
            {
              productId: product.id,
              slug: product.slug,
              name: product.name,
              image: product.primaryImage,
              unitPrice: product.price,
              quantity: 1,
            },
          ];
        });
      },
      removeItem: (productId) => {
        updateStoredCart((currentItems) =>
          currentItems.filter((item) => item.productId !== productId),
        );
      },
      updateQuantity: (productId, quantity) => {
        updateStoredCart((currentItems) =>
          currentItems.flatMap((item) => {
            if (item.productId !== productId) {
              return [item];
            }

            if (quantity <= 0) {
              return [];
            }

            return [{ ...item, quantity }];
          }),
        );
      },
      clearCart: () => {
        writeStoredCart([]);
      },
      getItemQuantity: (productId) =>
        items.find((item) => item.productId === productId)?.quantity ?? 0,
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within StoreCartProvider");
  }

  return context;
}
