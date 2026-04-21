import Link from "next/link";
import { type Category } from "@/app/lib/utils";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/catalogo?cat=${category.slug}`}
      className="group block"
    >
      <div className="relative bg-bg-surface rounded-xl border border-border p-6 card-hover overflow-hidden text-center">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative">
          <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform duration-300">
            {category.icon}
          </span>
          <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors duration-200">
            {category.name}
          </h3>
          <p className="mt-1 text-xs text-text-muted">
            {category.productCount} productos
          </p>
        </div>
      </div>
    </Link>
  );
}
