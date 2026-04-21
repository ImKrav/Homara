import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";
import Badge from "@/app/components/ui/Badge";
import { formatPrice, getStatusLabel } from "@/app/lib/mock-data";

export default async function CuentaPage() {
  const res = await fetch("http://localhost:5000/api/orders", { cache: "no-store" });
  const json = await res.ok ? await res.json() : { data: [] };
  const orders = json.data || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-text-primary mb-8">Mi Cuenta</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile */}
        <div className="lg:col-span-1">
          <Card>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👤</span>
              </div>
              <h2 className="text-lg font-semibold text-text-primary">
                Juan Pérez
              </h2>
              <p className="text-sm text-text-muted mt-1">juan@email.com</p>
              <p className="text-sm text-text-muted">Bogotá, Colombia</p>

              <div className="mt-6 pt-4 border-t border-border grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xl font-bold text-text-primary">4</p>
                  <p className="text-xs text-text-muted">Proyectos</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-text-primary">12</p>
                  <p className="text-xs text-text-muted">Pedidos</p>
                </div>
              </div>

              <Button variant="outline" size="sm" fullWidth className="mt-6">
                Editar Perfil
              </Button>
            </div>
          </Card>
        </div>

        {/* Orders */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-primary">
              Historial de Pedidos
            </h2>
          </div>

          <div className="space-y-4">
            {orders.slice(0, 4).map((order) => {
              const statusVariant =
                order.status === "entregado"
                  ? "success"
                  : order.status === "cancelado"
                  ? "error"
                  : order.status === "enviado"
                  ? "info"
                  : "warning";

              return (
                <Card key={order.id} hover>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-semibold text-text-primary">
                          {order.id}
                        </p>
                        <Badge variant={statusVariant} size="sm">
                          {getStatusLabel(order.status)}
                        </Badge>
                      </div>
                      <p className="text-xs text-text-muted mt-1">
                        {new Date(order.date).toLocaleDateString("es-CO", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}{" "}
                        • {order.items} artículos
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-text-primary">
                        {formatPrice(order.total)}
                      </p>
                      <button className="text-xs text-primary hover:underline mt-1">
                        Ver detalle
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
