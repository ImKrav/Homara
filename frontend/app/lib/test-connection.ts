// ============================================
// Homara — API Connection Test
// ============================================

import { healthApi, categoriesApi, productsApi } from "@/app/lib/api";

export async function testConnection() {
  const results = {
    backend: false,
    categories: false,
    products: false,
    errors: [] as string[],
  };

  // Test 1: Health check
  try {
    const isHealthy = await healthApi.check();
    results.backend = isHealthy;
    if (!isHealthy) {
      results.errors.push("❌ Backend no está respondiendo");
    } else {
      console.log("✅ Backend conectado correctamente");
    }
  } catch (err) {
    results.errors.push(
      `❌ Error en health check: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  // Test 2: Get categories
  try {
    const response = await categoriesApi.getAll();
    if (response.success && response.data.length > 0) {
      results.categories = true;
      console.log(`✅ ${response.data.length} categorías cargadas`);
    } else {
      results.errors.push("❌ No se pudieron cargar las categorías");
    }
  } catch (err) {
    results.errors.push(
      `❌ Error cargando categorías: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  // Test 3: Get products
  try {
    const response = await productsApi.getAll({ limit: 5 });
    if (response.success && response.data.length > 0) {
      results.products = true;
      console.log(`✅ ${response.data.length} productos cargados`);
    } else {
      results.errors.push("❌ No se pudieron cargar los productos");
    }
  } catch (err) {
    results.errors.push(
      `❌ Error cargando productos: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  return results;
}
