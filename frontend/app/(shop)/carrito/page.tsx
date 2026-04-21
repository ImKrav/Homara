"use client";

import { useState, useEffect } from "react";
import CartItemCard from "@/app/components/CartItem";
import Button from "@/app/components/ui/Button";
import { formatPrice } from "@/app/lib/mock-data";

export default function CarritoPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/cart");
      const json = await res.json();
      if (json.success) {
        setCartItems(json.data.items);
        setSubtotal(json.data.subtotal);
        setShipping(json.data.shipping);
        setTotal(json.data.total);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (index: number, quantity: number) => {
    const item = cartItems[index];
    try {
      await fetch(`http://localhost:5000/api/cart/items/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity })
      });
      fetchCart();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemove = async (index: number) => {
    const item = cartItems[index];
    try {
      await fetch(`http://localhost:5000/api/cart/items/${item.id}`, {
        method: "DELETE"
      });
      fetchCart();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Cargando carrito...</div>;
  }

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
