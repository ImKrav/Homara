// ============================================
// Homara — Categories Routes
// ============================================

import { Router } from "express";
import prisma from "../config/db.js";

const router = Router();

// GET /api/categories — Listar todas las categorías con conteo de productos
router.get("/", async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    });

    const result = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon,
      productCount: cat._count.products,
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// GET /api/categories/:slug — Detalle de una categoría por slug
router.get("/:slug", async (req, res, next) => {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug },
      include: {
        products: {
          include: { tags: true },
          orderBy: { reviewCount: "desc" },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ success: false, error: "Categoría no encontrada" });
    }

    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
});

export default router;
