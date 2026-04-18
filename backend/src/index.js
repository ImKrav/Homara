// ============================================
// Homara — Express Entry Point
// ============================================

import "dotenv/config";
import express from "express";

import categoriesRouter from "./routes/categories.js";
import productsRouter from "./routes/products.js";
import projectsRouter from "./routes/projects.js";
import cartRouter from "./routes/cart.js";
import ordersRouter from "./routes/orders.js";
import usersRouter from "./routes/users.js";
import adminRouter from "./routes/admin.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Global Middleware ───────────────────────

app.use(express.json());

// CORS — permite acceso desde el frontend (Next.js en :3000)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// ─── Routes ──────────────────────────────────

app.get("/", (req, res) => {
  res.json({
    message: "🏠 Homara API — Backend activo",
    version: "1.0.0",
    endpoints: {
      categories: "/api/categories",
      products: "/api/products",
      projects: "/api/projects",
      cart: "/api/cart",
      orders: "/api/orders",
      users: "/api/users",
      admin: "/api/admin",
    },
  });
});

app.use("/api/categories", categoriesRouter);
app.use("/api/products", productsRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/users", usersRouter);
app.use("/api/admin", adminRouter);

// ─── Error Handler ───────────────────────────

app.use(errorHandler);

// ─── Start Server ────────────────────────────

app.listen(PORT, () => {
  console.log(`🏠 Homara API corriendo en http://localhost:${PORT}`);
});

export default app;
