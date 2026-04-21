"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/app/components/ProductCard";
import SearchBar from "@/app/components/SearchBar";
import { Product, Category } from "@/app/lib/utils";

export default function CatalogoPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [sortBy, setSortBy] = useState<string>("popular");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          fetch(`http://localhost:5000/api/products?category=${selectedCategory}&sort=${sortBy}&limit=50`),
          fetch("http://localhost:5000/api/categories")
        ]);
        const prodData = await prodRes.json();
        const catData = await catRes.json();
        if (prodData.success) setProducts(prodData.data);
        if (catData.success) setCategories(catData.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedCategory, sortBy]);

  const sortedProducts = products;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Catálogo</h1>
        <p className="mt-2 text-text-secondary">
          Encuentra todo lo que necesitas para tu proyecto
        </p>
      </div>

      {/* Search */}
      <SearchBar className="mb-8 max-w-2xl" />

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        {/* Category filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory("todos")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedCategory === "todos"
                ? "bg-primary text-bg-base"
                : "bg-bg-surface-light text-text-secondary hover:text-text-primary"
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedCategory === cat.slug
                  ? "bg-primary text-bg-base"
                  : "bg-bg-surface-light text-text-secondary hover:text-text-primary"
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-bg-surface-light border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
          id="sort-by"
        >
          <option value="popular">Más populares</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
          <option value="rating">Mejor calificados</option>
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm text-text-muted mb-6">
        {sortedProducts.length} productos encontrados
      </p>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Empty state */}
      {sortedProducts.length === 0 && (
        <div className="text-center py-20">
          <span className="text-5xl block mb-4">🔍</span>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            No se encontraron productos
          </h3>
          <p className="text-text-secondary">
            Intenta con otra categoría o término de búsqueda
          </p>
        </div>
      )}
    </div>
  );
}
