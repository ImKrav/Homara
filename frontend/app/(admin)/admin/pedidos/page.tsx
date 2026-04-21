import Card from "@/app/components/ui/Card";
import Badge from "@/app/components/ui/Badge";
import { formatPrice, getStatusLabel } from "@/app/lib/utils";

export default async function AdminPedidosPage() {
  const res = await fetch("http://localhost:5000/api/orders?admin=true", { cache: "no-store" });
  const json = await res.ok ? await res.json() : { data: [] };
  const orders = json.data || [];

  const orderStats = {
    total: orders.length,
    pendientes: orders.filter((o: any) => o.status === "pendiente" || o.status === "procesando").length,
    enviados: orders.filter((o: any) => o.status === "enviado").length,
    entregados: orders.filter((o: any) => o.status === "entregado").length,
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Pedidos</h1>
        <p className="mt-2 text-text-secondary">
          Gestiona y da seguimiento a los pedidos
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total", value: orderStats.total, icon: "📋" },
          { label: "Pendientes", value: orderStats.pendientes, icon: "⏳" },
          { label: "Enviados", value: orderStats.enviados, icon: "🚚" },
          { label: "Entregados", value: orderStats.entregados, icon: "✅" },
        ].map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-text-muted">{stat.label}</p>
                <p className="text-2xl font-bold text-text-primary mt-1">
                  {stat.value}
                </p>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Orders Table */}
      <Card padding="none">
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
                <th className="text-center py-3 px-4 text-text-muted font-medium">
                  Artículos
                </th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">
                  Estado
                </th>
                <th className="text-right py-3 px-4 text-text-muted font-medium">
                  Total
                </th>
                <th className="text-right py-3 px-4 text-text-muted font-medium">
                  Acciones
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
                      {new Date(order.date).toLocaleDateString("es-CO", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td className="py-3 px-4 text-center text-text-secondary">
                      {order.items}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={statusVariant} size="sm">
                        {getStatusLabel(order.status)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-text-primary">
                      {formatPrice(order.total)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-xs text-primary hover:underline">
                        Ver detalle
                      </button>
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
