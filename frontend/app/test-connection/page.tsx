"use client";

import { useState, useEffect } from "react";
import { healthApi, categoriesApi, productsApi } from "@/app/lib/api";

export default function TestConnectionPage() {
  const [status, setStatus] = useState({
    backend: "checking",
    categories: "checking",
    products: "checking",
  });
  const [data, setData] = useState({
    categories: 0,
    products: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const runTests = async () => {
      setError(null);
      const newStatus = { ...status };

      // Test 1: Backend health
      try {
        const isHealthy = await healthApi.check();
        newStatus.backend = isHealthy ? "success" : "failed";
      } catch (err) {
        newStatus.backend = "failed";
        setError(`Error de conexión: ${err instanceof Error ? err.message : "Error desconocido"}`);
      }

      // Test 2: Categories
      try {
        const res = await categoriesApi.getAll();
        if (res.success) {
          newStatus.categories = "success";
          setData((prev) => ({ ...prev, categories: res.data.length }));
        } else {
          newStatus.categories = "failed";
        }
      } catch (err) {
        newStatus.categories = "failed";
      }

      // Test 3: Products
      try {
        const res = await productsApi.getAll();
        if (res.success) {
          newStatus.products = "success";
          setData((prev) => ({ ...prev, products: res.data.length }));
        } else {
          newStatus.products = "failed";
        }
      } catch (err) {
        newStatus.products = "failed";
      }

      setStatus(newStatus);
    };

    runTests();
  }, []);

  const getStatusIcon = (s: string) => {
    if (s === "checking") return "⏳";
    if (s === "success") return "✅";
    return "❌";
  };

  const getStatusColor = (s: string) => {
    if (s === "checking") return "text-yellow-600";
    if (s === "success") return "text-green-600";
    return "text-red-600";
  };

  const allSuccess = Object.values(status).every((s) => s === "success");

  return (
    <div className="min-h-screen bg-bg-base">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            🔍 Prueba de Conexión
          </h1>
          <p className="text-lg text-text-secondary">
            Verificar comunicación Frontend ↔️ Backend
          </p>
        </div>

        {/* Overall Status */}
        <div
          className={`rounded-lg p-6 mb-8 ${
            allSuccess
              ? "bg-green-50 border-2 border-green-300"
              : "bg-yellow-50 border-2 border-yellow-300"
          }`}
        >
          <p className="text-lg font-semibold">
            {allSuccess ? "✅ Sistema Conectado" : "⏳ Probando..."}
          </p>
          {allSuccess && (
            <p className="text-sm text-green-700 mt-1">
              La comunicación entre frontend y backend está funcionando correctamente.
            </p>
          )}
        </div>

        {/* Test Results */}
        <div className="grid gap-4 mb-8">
          {/* Backend Test */}
          <div className="bg-bg-surface border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  Backend (Health Check)
                </h3>
                <p className="text-sm text-text-secondary mt-1">
                  Verificar si el servidor está corriendo
                </p>
              </div>
              <span className={`text-3xl ${getStatusColor(status.backend)}`}>
                {getStatusIcon(status.backend)}
              </span>
            </div>
          </div>

          {/* Categories Test */}
          <div className="bg-bg-surface border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  Categorías (GET /api/categories)
                </h3>
                <p className="text-sm text-text-secondary mt-1">
                  {status.categories === "success"
                    ? `✅ ${data.categories} categorías cargadas`
                    : "Cargando categorías..."}
                </p>
              </div>
              <span className={`text-3xl ${getStatusColor(status.categories)}`}>
                {getStatusIcon(status.categories)}
              </span>
            </div>
          </div>

          {/* Products Test */}
          <div className="bg-bg-surface border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  Productos (GET /api/products)
                </h3>
                <p className="text-sm text-text-secondary mt-1">
                  {status.products === "success"
                    ? `✅ ${data.products} productos cargados`
                    : "Cargando productos..."}
                </p>
              </div>
              <span className={`text-3xl ${getStatusColor(status.products)}`}>
                {getStatusIcon(status.products)}
              </span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-8">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-300 rounded-lg p-6">
          <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Información</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • Frontend corriendo en: <code className="bg-white px-2 py-1 rounded">localhost:3000</code>
            </li>
            <li>
              • Backend esperado en: <code className="bg-white px-2 py-1 rounded">localhost:5000</code>
            </li>
            <li>
              • Asegúrate de que el backend esté corriendo antes de hacer pruebas
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            🔄 Reintentar Prueba
          </button>
          <a
            href="/catalogo"
            className="px-6 py-2 bg-bg-surface-light border border-border text-text-primary rounded-lg hover:bg-bg-surface transition-colors"
          >
            📦 Ir al Catálogo
          </a>
        </div>
      </div>
    </div>
  );
}
