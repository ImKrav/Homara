// ============================================
// Homara — Products Routes
// ============================================

import { Router } from "express";
import prisma from "../config/db.js";
import { validateBody } from "../middleware/validate.js";

const router = Router();

/**
 * @openapi
 * /api/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Listar productos
 *     description: Recupera un listado paginado de productos. Soporta filtros por categoría, búsqueda por aproximación y diversos métodos de ordenación.
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Slug de la categoría. Si es "todos", lo ignora.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Término a buscar en nombre o descripción.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: 'Opciones: popular, precio-asc, precio-desc, rating'
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: 'Número de página de la paginación (defecto: 1)'
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: 'Límite de productos por página (defecto: 20)'
 *     responses:
 *       200:
 *         description: Listado de productos obtenido.
 */
// GET /api/products — Listar con filtros, búsqueda y paginación
router.get("/", async (req, res, next) => {
  try {
    const {
      category,   // slug de categoría
      search,     // término de búsqueda
      sort = "popular", // popular | precio-asc | precio-desc | rating
      page = 1,
      limit = 20,
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Construir filtros
    const where = {};

    if (category && category !== "todos") {
      where.category = { slug: category };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Construir ordenamiento
    let orderBy;
    switch (sort) {
      case "precio-asc":
        orderBy = { price: "asc" };
        break;
      case "precio-desc":
        orderBy = { price: "desc" };
        break;
      case "rating":
        orderBy = { rating: "desc" };
        break;
      case "popular":
      default:
        orderBy = { reviewCount: "desc" };
        break;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          tags: true,
        },
        orderBy,
        skip,
        take: Number(limit),
      }),
      prisma.product.count({ where }),
    ]);

    // Transformar para el frontend
    const result = products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      originalPrice: p.originalPrice,
      image: p.image,
      category: p.category.name,
      categorySlug: p.category.slug,
      rating: p.rating,
      reviews: p.reviewCount,
      inStock: p.inStock,
      stockQuantity: p.stockQuantity,
      unit: p.unit,
      tags: p.tags.map((t) => t.name),
    }));

    res.json({
      success: true,
      data: result,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Detalle del producto
 *     description: Presenta un detalle interactivo de un producto por su ID junto con 4 productos similares y su historial de reseñas.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles devueltos integradamente.
 *       404:
 *         description: Producto no encontrado.
 */
// GET /api/products/:id — Detalle de producto con relacionados
router.get("/:id", async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
        tags: true,
        reviews: {
          include: { user: { select: { firstName: true, lastName: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!product) {
      return res.status(404).json({ success: false, error: "Producto no encontrado" });
    }

    // Productos relacionados (misma categoría)
    const related = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      include: { category: true, tags: true },
      take: 4,
      orderBy: { reviewCount: "desc" },
    });

    const result = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category.name,
      categorySlug: product.category.slug,
      rating: product.rating,
      reviews: product.reviewCount,
      inStock: product.inStock,
      stockQuantity: product.stockQuantity,
      unit: product.unit,
      tags: product.tags.map((t) => t.name),
      reviewsList: product.reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        user: `${r.user.firstName} ${r.user.lastName}`,
        createdAt: r.createdAt,
      })),
      relatedProducts: related.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice,
        image: p.image,
        category: p.category.name,
        categorySlug: p.category.slug,
        rating: p.rating,
        reviews: p.reviewCount,
        inStock: p.inStock,
        stockQuantity: p.stockQuantity,
        unit: p.unit,
        tags: p.tags.map((t) => t.name),
      })),
    };

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /api/products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Crear producto (admin)
 *     description: Registra un nuevo producto en el catálogo definiendo stock, unidad e hipervínculos como tags.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - image
 *               - categoryId
 *               - unit
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               originalPrice:
 *                 type: number
 *               image:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               unit:
 *                 type: string
 *               stockQuantity:
 *                 type: integer
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Producto creado.
 */
// POST /api/products — Crear producto (admin)
router.post(
  "/",
  validateBody(["name", "description", "price", "image", "categoryId", "unit"]),
  async (req, res, next) => {
    try {
      const {
        name,
        description,
        price,
        originalPrice,
        image,
        categoryId,
        unit,
        stockQuantity = 0,
        tags = [],
      } = req.body;

      const product = await prisma.product.create({
        data: {
          name,
          description,
          price,
          originalPrice,
          image,
          categoryId,
          unit,
          stockQuantity,
          inStock: stockQuantity > 0,
          tags: {
            create: tags.map((tag) => ({ name: tag })),
          },
        },
        include: { category: true, tags: true },
      });

      res.status(201).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/products/{id}:
 *   put:
 *     tags:
 *       - Products
 *     summary: Actualizar producto
 *     description: Actualiza un producto existente modificándolo diferencialmente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               originalPrice:
 *                 type: number
 *               image:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               unit:
 *                 type: string
 *               stockQuantity:
 *                 type: integer
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Producto actualizado iterativamente.
 */
// PUT /api/products/:id — Actualizar producto (admin)
router.put("/:id", async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      image,
      categoryId,
      unit,
      stockQuantity,
      tags,
    } = req.body;

    const data = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = price;
    if (originalPrice !== undefined) data.originalPrice = originalPrice;
    if (image !== undefined) data.image = image;
    if (categoryId !== undefined) data.categoryId = categoryId;
    if (unit !== undefined) data.unit = unit;
    if (stockQuantity !== undefined) {
      data.stockQuantity = stockQuantity;
      data.inStock = stockQuantity > 0;
    }

    // Si se envían tags, reemplazar todos
    if (tags !== undefined) {
      await prisma.productTag.deleteMany({
        where: { productId: req.params.id },
      });
      data.tags = {
        create: tags.map((tag) => ({ name: tag })),
      };
    }

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data,
      include: { category: true, tags: true },
    });

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /api/products/{id}:
 *   delete:
 *     tags:
 *       - Products
 *     summary: Eliminar producto
 *     description: Desregistra un producto del catálogo definitivamente por su UUID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado completamente.
 */
// DELETE /api/products/:id — Eliminar producto (admin)
router.delete("/:id", async (req, res, next) => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id },
    });

    res.json({ success: true, message: "Producto eliminado" });
  } catch (error) {
    next(error);
  }
});

export default router;
