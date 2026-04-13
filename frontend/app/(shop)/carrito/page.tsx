"use client";

import { useState } from "react";
import CartItemCard from "@/app/components/CartItem";
import Button from "@/app/components/ui/Button";
import { products, formatPrice } from "@/app/lib/mock-data";

const initialCart = [
  { product: products[0], quantity: 4 },
  { product: products[1], quantity: 1 },
  { product: products[6], quantity: 3 },
];

export default function CarritoPage() {
  const [cartItems, setCartItems] = useState(initialCart);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 500000 ? 0 : 25000;
  const total = subtotal + shipping;

  const handleQuantityChange = (index: number, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity } : item))
    );
  };

  const handleRemove = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-text-primary mb-8">
        Carrito de Compras
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-6xl block mb-4">🛒</span>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Tu carrito está vacío
          </h3>
          <p className="text-text-secondary mb-6">
            Explora nuestro catálogo y encuentra lo que necesitas
          </p>
          <Button href="/catalogo">Ir al Catálogo</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <CartItemCard
                key={item.product.id}
                product={item.product}
                quantity={item.quantity}
                onQuantityChange={(q) => handleQuantityChange(index, q)}
                onRemove={() => handleRemove(index)}
              />
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-bg-surface rounded-xl border border-border p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-text-primary mb-6">
                Resumen del Pedido
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">
                    Subtotal ({cartItems.length} productos)
                  </span>
                  <span className="text-text-primary font-medium">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Envío</span>
                  <span className="text-text-primary font-medium">
                    {shipping === 0 ? (
                      <span className="text-success">Gratis</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-text-muted">
                    Envío gratis en compras mayores a {formatPrice(500000)}
                  </p>
                )}
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="text-text-primary font-semibold">
                    Total
                  </span>
                  <span className="text-xl font-bold gradient-text">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <Button href="/checkout" size="lg" fullWidth className="mt-6">
                Ir a Pagar
              </Button>

              <Button
                href="/catalogo"
                variant="ghost"
                size="sm"
                fullWidth
                className="mt-3"
              >
                Seguir comprando
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
