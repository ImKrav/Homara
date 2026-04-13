"use client";

import { type Product, formatPrice } from "@/app/lib/mock-data";

interface CartItemCardProps {
  product: Product;
  quantity: number;
  onQuantityChange?: (quantity: number) => void;
  onRemove?: () => void;
}

export default function CartItemCard({
  product,
  quantity,
  onQuantityChange,
  onRemove,
}: CartItemCardProps) {
  return (
    <div className="flex gap-4 bg-bg-surface rounded-xl border border-border p-4">
      {/* Image placeholder */}
      <div className="flex-shrink-0 w-20 h-20 bg-bg-surface-light rounded-lg flex items-center justify-center text-3xl">
        {product.categorySlug === "pisos-ceramicas" && "🏗️"}
        {product.categorySlug === "herramientas" && "🔧"}
        {product.categorySlug === "pinturas" && "🎨"}
        {product.categorySlug === "muebles" && "🪑"}
        {product.categorySlug === "iluminacion" && "💡"}
        {product.categorySlug === "materiales-construccion" && "🧱"}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-text-primary truncate">
          {product.name}
        </h3>
        <p className="text-xs text-text-muted mt-0.5">
          {formatPrice(product.price)} / {product.unit}
        </p>

        <div className="flex items-center justify-between mt-3">
          {/* Quantity controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                onQuantityChange?.(Math.max(1, quantity - 1))
              }
              className="w-7 h-7 flex items-center justify-center rounded-md bg-bg-surface-light text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary transition-colors text-sm"
            >
              −
            </button>
            <span className="text-sm font-medium text-text-primary w-8 text-center">
              {quantity}
            </span>
            <button
              onClick={() => onQuantityChange?.(quantity + 1)}
              className="w-7 h-7 flex items-center justify-center rounded-md bg-bg-surface-light text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary transition-colors text-sm"
            >
              +
            </button>
          </div>

          {/* Subtotal + Remove */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-text-primary">
              {formatPrice(product.price * quantity)}
            </span>
            <button
              onClick={onRemove}
              className="p-1 text-text-muted hover:text-error transition-colors"
              aria-label="Eliminar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
