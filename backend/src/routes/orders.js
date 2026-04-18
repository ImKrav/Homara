// ============================================
// Homara — Orders Routes
// ============================================

import { Router } from "express";
import prisma from "../config/db.js";
import { validateBody } from "../middleware/validate.js";

const router = Router();

const DEMO_USER_ID = "demo-user-001";

// Generar número de orden
async function generateOrderNumber() {
  const year = new Date().getFullYear();
  const count = await prisma.order.count({
    where: {
      createdAt: {
        gte: new Date(`${year}-01-01`),
      },
    },
  });
  return `ORD-${year}-${String(count + 1).padStart(3, "0")}`;
}

// GET /api/orders — Listar pedidos del usuario
router.get("/", async (req, res, next) => {
  try {
    const userId = req.query.userId || DEMO_USER_ID;
    const isAdmin = req.query.admin === "true";

    const where = isAdmin ? {} : { userId };

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: { select: { firstName: true, lastName: true } },
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const result = orders.map((o) => ({
      id: o.orderNumber,
      date: o.createdAt.toISOString().split("T")[0],
      status: o.status.toLowerCase(),
      items: o._count.items,
      total: o.total,
      customer: `${o.user.firstName} ${o.user.lastName}`,
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/:id — Detalle del pedido
router.get("/:id", async (req, res, next) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: req.params.id },
          { orderNumber: req.params.id },
        ],
      },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        items: {
          include: {
            product: {
              include: { category: true },
            },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ success: false, error: "Pedido no encontrado" });
    }

    const result = {
      id: order.orderNumber,
      status: order.status.toLowerCase(),
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      total: order.total,
      paymentMethod: order.paymentMethod,
      shippingAddress: order.shippingAddress,
      shippingCity: order.shippingCity,
      shippingState: order.shippingState,
      shippingZip: order.shippingZip,
      shippingNotes: order.shippingNotes,
      createdAt: order.createdAt,
      customer: {
        name: `${order.user.firstName} ${order.user.lastName}`,
        email: order.user.email,
      },
      items: order.items.map((item) => ({
        id: item.id,
        productName: item.product.name,
        productImage: item.product.image,
        category: item.product.category.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
      })),
    };

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// POST /api/orders — Crear pedido desde carrito (checkout)
router.post(
  "/",
  validateBody(["paymentMethod"]),
  async (req, res, next) => {
    try {
      const {
        paymentMethod,
        shippingAddress,
        shippingCity,
        shippingState,
        shippingZip,
        shippingNotes,
        userId = DEMO_USER_ID,
      } = req.body;

      // Obtener carrito del usuario
      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: { include: { product: true } },
        },
      });

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({
          success: false,
          error: "El carrito está vacío",
        });
      }

      const subtotal = cart.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      const shippingCost = subtotal > 500000 ? 0 : 25000;
      const total = subtotal + shippingCost;

      const orderNumber = await generateOrderNumber();

      // Crear orden con items dentro de una transacción
      const order = await prisma.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
          data: {
            orderNumber,
            userId,
            subtotal,
            shippingCost,
            total,
            paymentMethod,
            shippingAddress,
            shippingCity,
            shippingState,
            shippingZip,
            shippingNotes,
            items: {
              create: cart.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.product.price,
                total: item.product.price * item.quantity,
              })),
            },
          },
          include: { items: true },
        });

        // Actualizar stock de cada producto
        for (const item of cart.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stockQuantity: { decrement: item.quantity },
              inStock: item.product.stockQuantity - item.quantity > 0,
            },
          });
        }

        // Vaciar carrito
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

        return newOrder;
      });

      res.status(201).json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/orders/:id/status — Actualizar estado del pedido (admin)
router.put("/:id/status", async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = ["PENDIENTE", "PROCESANDO", "ENVIADO", "ENTREGADO", "CANCELADO"];
    const upperStatus = status?.toUpperCase();

    if (!validStatuses.includes(upperStatus)) {
      return res.status(400).json({
        success: false,
        error: `Estado inválido. Valores válidos: ${validStatuses.join(", ")}`,
      });
    }

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: upperStatus },
    });

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

export default router;
