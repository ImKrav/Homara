import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import Card from "@/app/components/ui/Card";
import { products, formatPrice } from "@/app/lib/mock-data";

const checkoutItems = [
  { product: products[0], quantity: 4 },
  { product: products[1], quantity: 1 },
  { product: products[6], quantity: 3 },
];

export default function CheckoutPage() {
  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 500000 ? 0 : 25000;
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-text-primary mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                required
              />
              <Input
                label="Apellido"
                placeholder="Pérez"
                id="last-name"
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="juan@email.com"
                id="email"
                required
                className="sm:col-span-2"
              />
              <Input
                label="Teléfono"
                type="tel"
                placeholder="300 123 4567"
                id="phone"
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
                required
                className="sm:col-span-2"
              />
              <Input
                label="Ciudad"
                placeholder="Bogotá"
                id="city"
                required
              />
              <Input
                label="Departamento"
                placeholder="Cundinamarca"
                id="state"
                required
              />
              <Input
                label="Código Postal"
                placeholder="110111"
                id="zip"
              />
              <Input
                label="Notas adicionales"
                placeholder="Apto 302, Torre B"
                id="notes"
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
                  className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-all duration-200"
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    defaultChecked={method.id === "card"}
                    className="accent-primary"
                  />
                  <span className="text-sm text-text-primary font-medium">
                    {method.label}
                  </span>
                </label>
              ))}
            </div>

            {/* Card mockup fields */}
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
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-bg-surface rounded-xl border border-border p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-text-primary mb-6">
              Resumen del Pedido
            </h2>

            <div className="space-y-4 mb-6">
              {checkoutItems.map((item) => (
                <div
                  key={item.product.id}
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

            <Button size="lg" fullWidth className="mt-6">
              Pagar {formatPrice(total)}
            </Button>

            <p className="text-xs text-text-muted text-center mt-4">
              🔒 Pago seguro — Simulación de pasarela
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
