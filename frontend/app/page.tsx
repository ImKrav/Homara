import { Suspense } from "react";
import Hero from "@/app/components/Hero";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import CategoryCard from "@/app/components/CategoryCard";
import ProductCard from "@/app/components/ProductCard";
import FeatureCard from "@/app/components/FeatureCard";
import Button from "@/app/components/ui/Button";
import { categoriesApi, productsApi } from "@/app/lib/api";

async function HomePage() {
  // Cargar datos en el servidor
  let categories = [];
  let popularProducts = [];
  let error = null;

  try {
    const [categoriesRes, productsRes] = await Promise.all([
      categoriesApi.getAll(),
      productsApi.getAll({ limit: 8 }),
    ]);

    if (categoriesRes.success) {
      categories = categoriesRes.data;
    }

    if (productsRes.success) {
      popularProducts = productsRes.data.filter(p => p.tags.includes("popular")).slice(0, 8);
    }
  } catch (err) {
    console.error("Error cargando datos:", err);
    error = "No se pudieron cargar los datos";
  }

  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <Hero />

        {/* Categories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary">
              Explora por Categoría
            </h2>
            <p className="mt-3 text-text-secondary">
              Todo lo que necesitas para tu proyecto en un solo lugar
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="bg-bg-surface/50 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-text-primary">
                ¿Cómo funciona?
              </h2>
              <p className="mt-3 text-text-secondary">
                Tres pasos para eliminar errores de cálculo en tus compras
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon="📐"
                step="Paso 1"
                title="Crea tu Proyecto"
                description="Define las dimensiones de tu espacio: largo, ancho y tipo de superficie (piso, pared o techo)."
              />
              <FeatureCard
                icon="🧮"
                step="Paso 2"
                title="Cálculo Automático"
                description="Nuestro motor calcula exactamente cuántas baldosas, pegante, boquilla y materiales necesitas."
              />
              <FeatureCard
                icon="🛒"
                step="Paso 3"
                title="Compra sin Errores"
                description="Agrega todo al carrito con un clic. Sin sobrantes, sin faltantes, sin estrés."
              />
            </div>
          </div>
        </section>

        {/* Popular Products */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-text-primary">
                Productos Populares
              </h2>
              <p className="mt-2 text-text-secondary">
                Los favoritos de nuestros clientes
              </p>
            </div>
            <Button href="/catalogo" variant="outline" size="sm">
              Ver todo →
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-bg-surface to-primary/10" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              ¿Listo para tu próximo proyecto?
            </h2>
            <p className="text-lg text-text-secondary max-w-xl mx-auto mb-8">
              Crea tu proyecto ahora y descubre cuánto material necesitas 
              con exactitud milimétrica.
            </p>
            <Button href="/proyectos/nuevo" size="lg">
              Comenzar Proyecto Gratis
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default HomePage;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getHealth() {
  const res = await fetch(`${API_URL}/health`, {
    // Si es cross-origin y el backend soporta CORS, esto debería funcionar
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // cache: "no-store", // si necesitas desactivar caché en Next 13+
  });

  if (!res.ok) {
    throw new Error("Error consultando backend");
  }

  return res.json();
}
export default async function HomePage() {
  const health = await getHealth();

  return (
    <main>
      <h1>Conexión frontend-backend</h1>
      <pre>{JSON.stringify(health, null, 2)}</pre>
    </main>
  );
}