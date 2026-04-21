import Card from "@/app/components/ui/Card";
import Badge from "@/app/components/ui/Badge";
import { formatPrice, getStatusLabel } from "@/app/lib/mock-data";

export default async function AdminDashboard() {
  const [ordersRes, metricsRes] = await Promise.all([
    fetch("http://localhost:5000/api/orders?admin=true", { cache: "no-store" }),
    fetch("http://localhost:5000/api/admin/metrics", { cache: "no-store" })
  ]);
  
  const ordersJson = await ordersRes.ok ? await ordersRes.json() : { data: [] };
  const metricsJson = await metricsRes.ok ? await metricsRes.json() : { data: [] };
  
  const orders = ordersJson.data || [];
  const adminMetrics = metricsJson.data || [];
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
        <p className="mt-2 text-text-secondary">
          Resumen general de tu tienda
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {adminMetrics.map((metric: any) => (
          <Card key={metric.label}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-text-muted">{metric.label}</p>
                <p className="text-2xl font-bold text-text-primary mt-1">
                  {metric.value}
                </p>
              </div>
              <span className="text-2xl">{metric.icon}</span>
            </div>
            <div className="mt-3">
              <span
                className={`text-xs font-medium ${
                  metric.change >= 0 ? "text-success" : "text-error"
                }`}
              >
                {metric.change >= 0 ? "↑" : "↓"}{" "}
                {Math.abs(metric.change)}%
              </span>
              <span className="text-xs text-text-muted ml-1">
                vs mes anterior
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <Card>
          <h3 className="text-sm font-semibold text-text-primary mb-4">
            Ventas por Mes
          </h3>
          <div className="h-48 flex items-end gap-2 px-4">
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map(
              (val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-primary/20 rounded-t-md hover:bg-primary/40 transition-colors"
                    style={{ height: `${val}%` }}
                  />
                  <span className="text-[10px] text-text-muted">
                    {
                      ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]
                    }
                  </span>
                </div>
              )
            )}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-text-primary mb-4">
            Categorías más vendidas
          </h3>
          <div className="space-y-4">
            {[
              { name: "Pisos y Cerámicas", pct: 35 },
              { name: "Herramientas", pct: 28 },
              { name: "Materiales de Construcción", pct: 18 },
              { name: "Pinturas", pct: 12 },
              { name: "Otros", pct: 7 },
            ].map((cat) => (
              <div key={cat.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-secondary">{cat.name}</span>
                  <span className="text-text-primary font-medium">
                    {cat.pct}%
                  </span>
                </div>
                <div className="h-2 bg-bg-surface-light rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${cat.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-text-primary">
            Pedidos Recientes
          </h3>
          <a
            href="/admin/pedidos"
            className="text-xs text-primary hover:underline"
          >
            Ver todos →
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-text-muted font-medium">
                  Pedido
                </th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">
                  Cliente
                </th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">
                  Fecha
                </th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">
                  Estado
                </th>
                <th className="text-right py-3 px-4 text-text-muted font-medium">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => {
                const statusVariant =
                  order.status === "entregado"
                    ? "success"
                    : order.status === "cancelado"
                    ? "error"
                    : order.status === "enviado"
                    ? "info"
                    : "warning";

                return (
                  <tr
                    key={order.id}
                    className="border-b border-border/50 hover:bg-bg-surface-light transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-text-primary">
                      {order.id}
                    </td>
                    <td className="py-3 px-4 text-text-secondary">
                      {order.customer}
                    </td>
                    <td className="py-3 px-4 text-text-muted">
                      {new Date(order.date).toLocaleDateString("es-CO")}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={statusVariant} size="sm">
                        {getStatusLabel(order.status)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-text-primary">
                      {formatPrice(order.total)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
