// ============================================
// Homara — Admin Routes
// ============================================

import { Router } from "express";
import prisma from "../config/db.js";

const router = Router();

// GET /api/admin/metrics — Métricas del dashboard
router.get("/metrics", async (req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Ventas del mes actual
    const currentMonthOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startOfMonth },
        status: { not: "CANCELADO" },
      },
      select: { total: true },
    });
    const currentMonthSales = currentMonthOrders.reduce((sum, o) => sum + o.total, 0);

    // Ventas del mes anterior
    const lastMonthOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        status: { not: "CANCELADO" },
      },
      select: { total: true },
    });
    const lastMonthSales = lastMonthOrders.reduce((sum, o) => sum + o.total, 0);

    // Pedidos activos (pendiente + procesando + enviado)
    const activeOrders = await prisma.order.count({
      where: {
        status: { in: ["PENDIENTE", "PROCESANDO", "ENVIADO"] },
      },
    });

    // Total de productos
    const totalProducts = await prisma.product.count();

    // Clientes nuevos este mes
    const newCustomers = await prisma.user.count({
      where: {
        createdAt: { gte: startOfMonth },
        role: "CUSTOMER",
      },
    });

    // Calcular cambio porcentual de ventas
    const salesChange = lastMonthSales > 0
      ? ((currentMonthSales - lastMonthSales) / lastMonthSales) * 100
      : 0;

    const formatCOP = (value) =>
      new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      }).format(value);

    res.json({
      success: true,
      data: [
        {
          label: "Ventas del Mes",
          value: formatCOP(currentMonthSales),
          change: Math.round(salesChange * 10) / 10,
          icon: "💰",
        },
        {
          label: "Pedidos Activos",
          value: String(activeOrders),
          change: 0,
          icon: "📦",
        },
        {
          label: "Productos",
          value: String(totalProducts),
          change: 0,
          icon: "🏷️",
        },
        {
          label: "Clientes Nuevos",
          value: String(newCustomers),
          change: 0,
          icon: "👥",
        },
      ],
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/inventory — Inventario con alertas
router.get("/inventory", async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { stockQuantity: "asc" },
    });

    const lowStock = products.filter((p) => p.stockQuantity > 0 && p.stockQuantity < 50);
    const outOfStock = products.filter((p) => !p.inStock);
    const totalUnits = products.reduce((sum, p) => sum + p.stockQuantity, 0);

    res.json({
      success: true,
      data: {
        stats: {
          totalProducts: products.length,
          totalUnits,
          lowStockCount: lowStock.length,
          outOfStockCount: outOfStock.length,
        },
        products: products.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category.name,
          stockQuantity: p.stockQuantity,
          unit: p.unit,
          price: p.price,
          stockValue: p.price * p.stockQuantity,
          inStock: p.inStock,
          stockStatus:
            p.stockQuantity === 0
              ? "sin_stock"
              : p.stockQuantity < 50
              ? "stock_bajo"
              : "normal",
        })),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
