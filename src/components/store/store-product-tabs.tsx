"use client";

import { useMemo, useState } from "react";

import { ProductCard } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import type { ProductCard as ProductCardType } from "@/types/domain";

type StoreProductTabsProps = {
  products: ProductCardType[];
};

export function StoreProductTabs({ products }: StoreProductTabsProps) {
  const categories = useMemo(() => {
    const values = Array.from(
      new Set(products.map((product) => product.categoryName).filter(Boolean)),
    ) as string[];

    return ["Todos", ...values];
  }, [products]);

  const [activeCategory, setActiveCategory] = useState(categories[0] ?? "Todos");

  const visibleProducts = useMemo(() => {
    if (activeCategory === "Todos") {
      return products.slice(0, 4);
    }

    return products
      .filter((product) => product.categoryName === activeCategory)
      .slice(0, 4);
  }, [activeCategory, products]);

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            type="button"
            variant={activeCategory === category ? "primary" : "secondary"}
            className="px-4 py-2"
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
