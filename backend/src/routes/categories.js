// ============================================
// Homara — Categories Routes
// ============================================

import { Router } from "express";
import prisma from "../config/db.js";

const router = Router();

/**
 * @openapi
 * /api/categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Listar todas las categorías
 *     description: Devuelve una lista de todas las categorías junto con la cantidad de productos por cada una.
 *     responses:
 *       200:
 *         description: Lista obtenida exitosamente.
 */
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

/**
 * @openapi
 * /api/categories/{slug}:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Detalle de categoría
 *     description: Retorna toda la información de una categoría específica, junto con sus respectivos productos.
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug alfanumérico que identifica a la categoría.
 *     responses:
 *       200:
 *         description: Categoría encontrada.
 *       404:
 *         description: Categoría no encontrada.
 */
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
