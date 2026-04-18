// ============================================
// Homara — Projects Routes
// ============================================

import { Router } from "express";
import prisma from "../config/db.js";
import { validateBody } from "../middleware/validate.js";
import { calculateMaterials } from "../utils/materialCalculator.js";

const router = Router();

// ID de usuario demo (sin auth por ahora)
const DEMO_USER_ID = "demo-user-001";

// GET /api/projects — Listar proyectos del usuario
router.get("/", async (req, res, next) => {
  try {
    const userId = req.query.userId || DEMO_USER_ID;

    const projects = await prisma.project.findMany({
      where: { userId },
      include: {
        _count: { select: { materials: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const result = projects.map((p) => ({
      id: p.id,
      name: p.name,
      type: p.type.toLowerCase(),
      status: p.status.toLowerCase(),
      area: p.area,
      createdAt: p.createdAt.toISOString().split("T")[0],
      materialCount: p._count.materials,
      estimatedCost: p.estimatedCost,
      thumbnail: p.thumbnail,
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/:id — Detalle con materiales calculados
router.get("/:id", async (req, res, next) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        materials: {
          include: { product: true },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ success: false, error: "Proyecto no encontrado" });
    }

    const result = {
      id: project.id,
      name: project.name,
      type: project.type.toLowerCase(),
      status: project.status.toLowerCase(),
      length: project.length,
      width: project.width,
      height: project.height,
      area: project.area,
      materialType: project.materialType,
      tileFormat: project.tileFormat,
      thumbnail: project.thumbnail,
      estimatedCost: project.estimatedCost,
      createdAt: project.createdAt.toISOString().split("T")[0],
      materialCount: project.materials.length,
      materials: project.materials.map((m) => ({
        id: m.id,
        name: m.name,
        quantity: m.quantity,
        note: m.note,
        icon: m.icon,
        price: m.price,
        productId: m.productId,
      })),
    };

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// POST /api/projects — Crear proyecto + cálculo automático de materiales
router.post(
  "/",
  validateBody(["name", "type", "area"]),
  async (req, res, next) => {
    try {
      const {
        name,
        type,
        length,
        width,
        height,
        area,
        materialType = "ceramica",
        tileFormat = "60x60",
        thumbnail = "🏠",
        userId = DEMO_USER_ID,
      } = req.body;

      // Calcular materiales automáticamente
      const materials = calculateMaterials({
        type,
        area,
        materialType,
        tileFormat,
      });

      const estimatedCost = materials.reduce((sum, m) => sum + m.price, 0);

      const project = await prisma.project.create({
        data: {
          name,
          type: type.toUpperCase(),
          length,
          width,
          height,
          area,
          materialType,
          tileFormat,
          thumbnail,
          estimatedCost,
          userId,
          materials: {
            create: materials,
          },
        },
        include: { materials: true },
      });

      res.status(201).json({ success: true, data: project });
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/projects/:id — Actualizar proyecto
router.put("/:id", async (req, res, next) => {
  try {
    const { name, type, length, width, height, area, materialType, tileFormat, status, thumbnail } =
      req.body;

    const data = {};
    if (name !== undefined) data.name = name;
    if (type !== undefined) data.type = type.toUpperCase();
    if (length !== undefined) data.length = length;
    if (width !== undefined) data.width = width;
    if (height !== undefined) data.height = height;
    if (area !== undefined) data.area = area;
    if (materialType !== undefined) data.materialType = materialType;
    if (tileFormat !== undefined) data.tileFormat = tileFormat;
    if (status !== undefined) data.status = status.toUpperCase();
    if (thumbnail !== undefined) data.thumbnail = thumbnail;

    // Si cambiaron dimensiones o materiales, recalcular
    if (area !== undefined || materialType !== undefined || tileFormat !== undefined) {
      const existing = await prisma.project.findUnique({ where: { id: req.params.id } });
      const calcArea = area || existing.area;
      const calcType = materialType || existing.materialType || "ceramica";
      const calcFormat = tileFormat || existing.tileFormat || "60x60";
      const calcProjectType = type || existing.type;

      const materials = calculateMaterials({
        type: calcProjectType.toLowerCase(),
        area: calcArea,
        materialType: calcType,
        tileFormat: calcFormat,
      });

      // Eliminar materiales anteriores y crear nuevos
      await prisma.projectMaterial.deleteMany({ where: { projectId: req.params.id } });

      data.estimatedCost = materials.reduce((sum, m) => sum + m.price, 0);
      data.materials = { create: materials };
    }

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data,
      include: { materials: true },
    });

    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/projects/:id — Eliminar proyecto
router.delete("/:id", async (req, res, next) => {
  try {
    await prisma.project.delete({
      where: { id: req.params.id },
    });

    res.json({ success: true, message: "Proyecto eliminado" });
  } catch (error) {
    next(error);
  }
});

export default router;
