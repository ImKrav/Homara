// ============================================
// Homara — Users Routes
// ============================================

import { Router } from "express";
import prisma from "../config/db.js";

const router = Router();

const DEMO_USER_ID = "demo-user-001";

// GET /api/users/:id — Perfil del usuario
router.get("/:id", async (req, res, next) => {
  try {
    const userId = req.params.id === "me" ? DEMO_USER_ID : req.params.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            projects: true,
            orders: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: "Usuario no encontrado" });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode,
        role: user.role,
        projectCount: user._count.projects,
        orderCount: user._count.orders,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/users/:id — Actualizar perfil
router.put("/:id", async (req, res, next) => {
  try {
    const userId = req.params.id === "me" ? DEMO_USER_ID : req.params.id;
    const { firstName, lastName, phone, address, city, state, zipCode } = req.body;

    const data = {};
    if (firstName !== undefined) data.firstName = firstName;
    if (lastName !== undefined) data.lastName = lastName;
    if (phone !== undefined) data.phone = phone;
    if (address !== undefined) data.address = address;
    if (city !== undefined) data.city = city;
    if (state !== undefined) data.state = state;
    if (zipCode !== undefined) data.zipCode = zipCode;

    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

export default router;
