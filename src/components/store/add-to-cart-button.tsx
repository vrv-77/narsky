"use client";

import { Button } from "@/components/ui/button";

import { useCart, type CartProduct } from "@/components/store/cart-provider";

type AddToCartButtonProps = {
  product: CartProduct;
  className?: string;
};

export function AddToCartButton({
  product,
  className,
}: AddToCartButtonProps) {
  const { addItem, getItemQuantity } = useCart();
  const quantity = getItemQuantity(product.id);
  const isOutOfStock = product.stock <= 0;
  const reachedStockLimit = product.stock > 0 && quantity >= product.stock;

  return (
    <Button
      className={className}
      disabled={isOutOfStock || reachedStockLimit}
      onClick={() => addItem(product)}
    >
      {isOutOfStock
        ? "Agotado"
        : quantity > 0
          ? reachedStockLimit
            ? `Agregado (${quantity})`
            : `Agregar otro (${quantity})`
          : "Agregar"}
    </Button>
  );
}
