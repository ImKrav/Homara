import Card from "@/app/components/ui/Card";
import Badge from "@/app/components/ui/Badge";
import { formatPrice } from "@/app/lib/utils";

export default async function AdminInventarioPage() {
  const res = await fetch("http://localhost:5000/api/admin/inventory", { cache: "no-store" });
  const json = await res.ok ? await res.json() : { data: { products: [], stats: {} } };
  
  const products = json.data?.products || [];
  const stats = json.data?.stats || { totalProducts: 0, totalUnits: 0, lowStockCount: 0, outOfStockCount: 0 };
  
  const sortedByStock = [...products].sort(
    (a, b) => a.stockQuantity - b.stockQuantity
  );

  const lowStock = products.filter(
    (p: any) => p.stockQuantity > 0 && p.stockQuantity < 50
  );
  const outOfStock = products.filter((p: any) => !p.inStock);
  const totalUnits = stats.totalUnits || 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Inventario</h1>
        <p className="mt-2 text-text-secondary">
          Control de stock y alertas de inventario
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Productos",
            value: products.length,
            icon: "📦",
            variant: "default" as const,
          },
          {
            label: "Unidades en Stock",
            value: totalUnits.toLocaleString(),
            icon: "📊",
            variant: "default" as const,
          },
          {
            label: "Stock Bajo",
            value: lowStock.length,
            icon: "⚠️",
            variant: "warning" as const,
          },
          {
            label: "Sin Stock",
            value: outOfStock.length,
            icon: "🚫",
            variant: "error" as const,
          },
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

      {/* Alerts */}
      {(lowStock.length > 0 || outOfStock.length > 0) && (
        <div className="mb-8 p-4 bg-warning/5 border border-warning/20 rounded-xl">
          <h3 className="text-sm font-semibold text-warning mb-2">
            ⚠️ Alertas de Inventario
          </h3>
          <p className="text-sm text-text-secondary">
            {lowStock.length} producto(s) con stock bajo y{" "}
            {outOfStock.length} producto(s) agotados requieren atención.
          </p>
        </div>
      )}

      {/* Inventory Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-text-muted font-medium">
                  Producto
                </th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">
                  Categoría
                </th>
                <th className="text-right py-3 px-4 text-text-muted font-medium">
                  Stock
                </th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">
                  Unidad
                </th>
                <th className="text-right py-3 px-4 text-text-muted font-medium">
                  Valor en Stock
                </th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedByStock.map((product: any) => {
                const stockStatus =
                  product.stockQuantity === 0
                    ? "error"
                    : product.stockQuantity < 50
                    ? "warning"
                    : "success";
                const stockLabel =
                  product.stockQuantity === 0
                    ? "Sin stock"
                    : product.stockQuantity < 50
                    ? "Stock bajo"
                    : "Normal";

                return (
                  <tr
                    key={product.id}
                    className="border-b border-border/50 hover:bg-bg-surface-light transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-text-primary">
                      {product.name}
                    </td>
                    <td className="py-3 px-4 text-text-secondary">
                      {product.category}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-text-primary">
                      {product.stockQuantity.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-text-muted">
                      {product.unit}
                    </td>
                    <td className="py-3 px-4 text-right text-text-primary">
                      {formatPrice(product.price * product.stockQuantity)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={stockStatus as "success" | "warning" | "error"}
                        size="sm"
                      >
                        {stockLabel}
                      </Badge>
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
