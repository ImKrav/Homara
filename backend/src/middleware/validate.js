// ============================================
// Homara — Request Validation Middleware
// ============================================

import { AppError } from "./errorHandler.js";

/**
 * Validates that request body contains required fields.
 * @param {string[]} requiredFields - Field names that must be present
 */
export function validateBody(requiredFields) {
  return (req, res, next) => {
    const missing = requiredFields.filter(
      (field) => req.body[field] === undefined || req.body[field] === null
    );

    if (missing.length > 0) {
      throw new AppError(
        `Campos requeridos faltantes: ${missing.join(", ")}`,
        400
      );
    }

    next();
  };
}
