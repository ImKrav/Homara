import { products, formatPrice } from "@/app/lib/mock-data";
import Badge from "@/app/components/ui/Badge";
import Button from "@/app/components/ui/Button";
import ProductCard from "@/app/components/ProductCard";
import { notFound } from "next/navigation";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const relatedProducts = products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-muted mb-8">
        <a href="/catalogo" className="hover:text-primary transition-colors">
          Catálogo
        </a>
        <span>/</span>
        <a
          href={`/catalogo?cat=${product.categorySlug}`}
          className="hover:text-primary transition-colors"
        >
          {product.category}
        </a>
        <span>/</span>
        <span className="text-text-secondary truncate">{product.name}</span>
      </nav>

      {/* Product Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="bg-bg-surface rounded-2xl border border-border aspect-square flex items-center justify-center relative overflow-hidden">
          <span className="text-9xl opacity-50">
            {product.categorySlug === "pisos-ceramicas" && "🏗️"}
            {product.categorySlug === "herramientas" && "🔧"}
            {product.categorySlug === "pinturas" && "🎨"}
            {product.categorySlug === "muebles" && "🪑"}
            {product.categorySlug === "iluminacion" && "💡"}
            {product.categorySlug === "materiales-construccion" && "🧱"}
          </span>
          {discount > 0 && (
            <div className="absolute top-4 left-4">
              <Badge variant="error">-{discount}%</Badge>
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Badge>{product.category}</Badge>
            {product.tags.includes("nuevo") && (
              <Badge variant="info">Nuevo</Badge>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? "text-primary"
                      : "text-bg-surface-light"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-text-secondary">
              {product.rating} ({product.reviews} reseñas)
            </span>
          </div>

          {/* Price */}
          <div className="mt-6 p-4 bg-bg-surface-light rounded-xl">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-text-primary">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-text-muted line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <p className="text-sm text-text-muted mt-1">
              por {product.unit} • IVA incluido
            </p>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-text-primary mb-2">
              Descripción
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Stock */}
          <div className="mt-6 flex items-center gap-2">
            {product.inStock ? (
              <>
                <span className="h-2 w-2 rounded-full bg-success" />
                <span className="text-sm text-success">
                  En stock ({product.stockQuantity} disponibles)
                </span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-error" />
                <span className="text-sm text-error">Agotado</span>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button size="lg" fullWidth disabled={!product.inStock}>
              Agregar al Carrito
            </Button>
            <Button
              variant="outline"
              size="lg"
              href="/proyectos/nuevo"
            >
              Usar en Proyecto
            </Button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold text-text-primary mb-8">
            Productos Relacionados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
