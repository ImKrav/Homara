import Link from "next/link";
import Badge from "@/app/components/ui/Badge";
import { type Product, formatPrice } from "@/app/lib/mock-data";
import { ApiProduct } from "@/app/lib/api";

interface ProductCardProps {
  product: Product | ApiProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Compatibilidad con ambas interfaces
  const categorySlug = "categorySlug" in product ? product.categorySlug : product.category?.slug || "";
  const categoryName = "category" in product && typeof product.category === "string" 
    ? product.category 
    : ("category" in product && typeof product.category === "object" ? product.category?.name : "");
  const tags = product.tags || [];
  
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <Link href={`/catalogo/${product.id}`} className="group block">
      <div className="bg-bg-surface rounded-xl border border-border overflow-hidden card-hover">
        {/* Image area */}
        <div className="relative aspect-square bg-bg-surface-light overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-40 group-hover:opacity-60 transition-opacity duration-300">
            {categorySlug === "pisos-ceramicas" && "🏗️"}
            {categorySlug === "herramientas" && "🔧"}
            {categorySlug === "pinturas" && "🎨"}
            {categorySlug === "muebles" && "🪑"}
            {categorySlug === "iluminacion" && "💡"}
            {categorySlug === "materiales-construccion" && "🧱"}
            {!categorySlug && "📦"}
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount > 0 && (
              <Badge variant="error" size="sm">
                -{discount}%
              </Badge>
            )}
            {tags.includes("nuevo") && (
              <Badge variant="info" size="sm">
                Nuevo
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="default" size="sm">
                Agotado
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-text-muted mb-1">{categoryName}</p>
          <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-3.5 w-3.5 ${
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
            <span className="text-xs text-text-muted">
              ({product.reviews})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-lg font-bold text-text-primary">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-text-muted line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            por {product.unit}
          </p>
        </div>
      </div>
    </Link>
  );
}
