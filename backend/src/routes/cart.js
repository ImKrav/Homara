// ============================================
// Homara — Cart Routes
// ============================================

import { Router } from "express";
import prisma from "../config/db.js";
import { validateBody } from "../middleware/validate.js";

const router = Router();

const DEMO_USER_ID = "demo-user-001";

/**
 * @openapi
 * /api/cart:
 *   get:
 *     tags:
 *       - Cart
 *     summary: Obtener el carrito
 *     description: Devuelve el carrito activo del usuario actual, calculando subtotal, envío y total. 
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: false
 *         description: ID del usuario (opcional).
 *     responses:
 *       200:
 *         description: Carrito retornado.
 */
// GET /api/cart — Obtener carrito del usuario
router.get("/", async (req, res, next) => {
  try {
    const userId = req.query.userId || DEMO_USER_ID;

    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { category: true, tags: true },
            },
          },
        },
      },
    });

    // Crear carrito si no existe
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: { include: { product: { include: { category: true, tags: true } } } } },
      });
    }

    const items = cart.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        name: item.product.name,
        description: item.product.description,
        price: item.product.price,
        originalPrice: item.product.originalPrice,
        image: item.product.image,
        category: item.product.category.name,
        categorySlug: item.product.category.slug,
        rating: item.product.rating,
        reviews: item.product.reviewCount,
        inStock: item.product.inStock,
        stockQuantity: item.product.stockQuantity,
        unit: item.product.unit,
        tags: item.product.tags.map((t) => t.name),
      },
    }));

    const subtotal = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const shipping = subtotal > 500000 ? 0 : 25000;
    const total = subtotal + shipping;

    res.json({
      success: true,
      data: {
        id: cart.id,
        items,
        subtotal,
        shipping,
        total,
        itemCount: items.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /api/cart/items:
 *   post:
 *     tags:
 *       - Cart
 *     summary: Agregar item al carrito
 *     description: Añade un producto al carrito del usuario o incrementa su cantidad si ya se encuentra agregado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Item agregado al carrito.
 */
// POST /api/cart/items — Agregar item al carrito
router.post(
  "/items",
  validateBody(["productId"]),
  async (req, res, next) => {
    try {
      const { productId, quantity = 1, userId = DEMO_USER_ID } = req.body;

      // Asegurar que el carrito existe
      let cart = await prisma.cart.findUnique({ where: { userId } });
      if (!cart) {
        cart = await prisma.cart.create({ data: { userId } });
      }

      // Ver si el producto ya está en el carrito
      const existingItem = await prisma.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId,
          },
        },
      });

      let item;
      if (existingItem) {
        item = await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity },
          include: { product: true },
        });
      } else {
        item = await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity,
          },
          include: { product: true },
        });
      }

      res.status(201).json({ success: true, data: item });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * /api/cart/items/{itemId}:
 *   put:
 *     tags:
 *       - Cart
 *     summary: Actualizar cantidad de un item
 *     description: Sobreescribe la cantidad de un producto específico en el carrito.
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cantidad actualizada exitosamente.
 *       400:
 *         description: La cantidad debe ser al menos 1.
 */
// PUT /api/cart/items/:itemId — Actualizar cantidad
router.put("/items/:itemId", async (req, res, next) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        error: "La cantidad debe ser al menos 1",
      });
    }

    const item = await prisma.cartItem.update({
      where: { id: req.params.itemId },
      data: { quantity },
      include: { product: true },
    });

    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /api/cart/items/{itemId}:
 *   delete:
 *     tags:
 *       - Cart
 *     summary: Eliminar item
 *     description: Remueve por completo un producto del carrito.
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removido exitosamente.
 */
// DELETE /api/cart/items/:itemId — Eliminar item del carrito
router.delete("/items/:itemId", async (req, res, next) => {
  try {
    await prisma.cartItem.delete({
      where: { id: req.params.itemId },
    });

    res.json({ success: true, message: "Item eliminado del carrito" });
  } catch (error) {
    next(error);
  }
});

export default router;
