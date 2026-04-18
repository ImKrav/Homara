// ============================================
// Homara — Global Error Handler Middleware
// ============================================

export function errorHandler(err, req, res, next) {
  console.error("❌ Error:", err.message);
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Error interno del servidor";

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

// Helper para crear errores con status code
export class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}
