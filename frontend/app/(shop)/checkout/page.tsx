"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import Card from "@/app/components/ui/Card";
import { formatPrice } from "@/app/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>({ items: [], subtotal: 0, shipping: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");

  useEffect(() => {
    async function fetchCart() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/cart`);
        const json = await res.json();
        if (json.success) {
          setCart(json.data);
        }
      } catch (err) {
        console.error("Error fetching cart", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCart();
  }, []);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phone || !address || !city || !state) {
      alert("Por favor completa todos los campos requeridos.");
      return;
    }

    try {
      setProcessing(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod,
          shippingAddress: address,
          shippingCity: city,
          shippingState: state,
          shippingZip: zip,
          shippingNotes: notes
        })
      });

      const data = await res.json();
      if (data.success) {
        window.dispatchEvent(new Event("cartUpdated"));
        alert("¡Pedido realizado con éxito!");
        router.push("/proyectos"); // O a alguna página de éxito / pedidos
      } else {
        alert(data.error || "Hubo un error al procesar el pedido.");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión");
    } finally {
      setProcessing(false);
    }
  };

  const checkoutItems = cart.items || [];
  const subtotal = cart.subtotal || 0;
  const shipping = cart.shipping || 0;
  const total = cart.total || 0;

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">Cargando...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-text-primary mb-8">Checkout</h1>

      <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Contact */}
          <Card>
            <h2 className="text-lg font-semibold text-text-primary mb-6">
              Información de Contacto
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nombre"
                placeholder="Juan"
                id="first-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <Input
                label="Apellido"
                placeholder="Pérez"
                id="last-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="juan@email.com"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="sm:col-span-2"
              />
              <Input
                label="Teléfono"
                type="tel"
                placeholder="300 123 4567"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </Card>

          {/* Shipping */}
          <Card>
            <h2 className="text-lg font-semibold text-text-primary mb-6">
              Dirección de Envío
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Dirección"
                placeholder="Calle 123 # 45-67"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="sm:col-span-2"
              />
              <Input
                label="Ciudad"
                placeholder="Bogotá"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
              <Input
                label="Departamento"
                placeholder="Cundinamarca"
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
              <Input
                label="Código Postal"
                placeholder="110111"
                id="zip"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
              />
              <Input
                label="Notas adicionales"
                placeholder="Apto 302, Torre B"
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </Card>

          {/* Payment */}
          <Card>
            <h2 className="text-lg font-semibold text-text-primary mb-6">
              Método de Pago
            </h2>
            <div className="space-y-3">
              {[
                { id: "card", label: "💳 Tarjeta de Crédito/Débito" },
                { id: "pse", label: "🏦 PSE - Débito bancario" },
                { id: "cash", label: "💵 Pago contra entrega" },
              ].map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    paymentMethod === method.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-primary"
                  />
                  <span className="text-sm text-text-primary font-medium">
                    {method.label}
                  </span>
                </label>
              ))}
            </div>

            {/* Card mockup fields - solo visuales como maqueta en UI de pago pero funcionales para submit */}
            {paymentMethod === "card" && (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Número de tarjeta"
                  placeholder="1234 5678 9012 3456"
                  id="card-number"
                  className="sm:col-span-2"
                />
                <Input
                  label="Fecha de vencimiento"
                  placeholder="MM/AA"
                  id="card-expiry"
                />
                <Input
                  label="CVV"
                  placeholder="123"
                  id="card-cvv"
                />
              </div>
            )}
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-bg-surface rounded-xl border border-border p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-text-primary mb-6">
              Resumen del Pedido
            </h2>

            <div className="space-y-4 mb-6">
              {checkoutItems.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-bg-surface-light rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                    {item.product.categorySlug === "pisos-ceramicas" && "🏗️"}
                    {item.product.categorySlug === "herramientas" && "🔧"}
                    {item.product.categorySlug === "materiales-construccion" && "🧱"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-text-muted">
                      x{item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-text-primary">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm border-t border-border pt-4">
              <div className="flex justify-between">
                <span className="text-text-secondary">Subtotal</span>
                <span className="text-text-primary">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Envío</span>
                <span className="text-text-primary">
                  {shipping === 0 ? (
                    <span className="text-success">Gratis</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="text-text-primary font-semibold">Total</span>
                <span className="text-xl font-bold gradient-text">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <Button type="submit" disabled={processing} size="lg" fullWidth className="mt-6">
              {processing ? "Procesando..." : `Pagar ${formatPrice(total)}`}
            </Button>

            <p className="text-xs text-text-muted text-center mt-4">
              🔒 Pago seguro — Simulación de pasarela
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
