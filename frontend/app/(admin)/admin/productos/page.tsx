import Card from "@/app/components/ui/Card";
import Badge from "@/app/components/ui/Badge";
import Button from "@/app/components/ui/Button";
import { formatPrice } from "@/app/lib/mock-data";

export default async function AdminProductosPage() {
  const res = await fetch("http://localhost:5000/api/products?limit=100", { cache: "no-store" });
  const json = await res.ok ? await res.json() : { data: [] };
  const products = json.data || [];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Productos</h1>
          <p className="mt-2 text-text-secondary">
            Gestiona el catálogo de productos
          </p>
        </div>
        <Button size="md">+ Agregar Producto</Button>
      </div>

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
                  Precio
                </th>
                <th className="text-right py-3 px-4 text-text-muted font-medium">
                  Stock
                </th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">
                  Estado
                </th>
                <th className="text-right py-3 px-4 text-text-muted font-medium">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border/50 hover:bg-bg-surface-light transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-bg-surface-light rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                        {product.categorySlug === "pisos-ceramicas" && "🏗️"}
                        {product.categorySlug === "herramientas" && "🔧"}
                        {product.categorySlug === "pinturas" && "🎨"}
                        {product.categorySlug === "muebles" && "🪑"}
                        {product.categorySlug === "iluminacion" && "💡"}
                        {product.categorySlug === "materiales-construccion" && "🧱"}
                      </div>
                      <span className="font-medium text-text-primary truncate max-w-[200px]">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-text-secondary">
                    {product.category}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-text-primary">
                    {formatPrice(product.price)}
                  </td>
                  <td className="py-3 px-4 text-right text-text-secondary">
                    {product.stockQuantity}
                  </td>
                  <td className="py-3 px-4">
                    {product.inStock ? (
                      <Badge variant="success" size="sm">
                        Activo
                      </Badge>
                    ) : (
                      <Badge variant="error" size="sm">
                        Agotado
                      </Badge>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-text-muted hover:text-primary transition-colors rounded-md hover:bg-bg-surface-light">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="p-1.5 text-text-muted hover:text-error transition-colors rounded-md hover:bg-bg-surface-light">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
