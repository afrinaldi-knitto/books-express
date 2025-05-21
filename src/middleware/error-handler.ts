import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const prismaErrorMap: Record<string, { status: number; error: string }> = {
  // Unique constraint failed
  P2002: {
    status: 409,
    error: "Resource already exists (unique constraint violated)",
  },
  // Record not found
  P2025: { status: 404, error: "Resource not found" },
  // Foreign key constraint failed
  P2003: { status: 409, error: "Foreign key constraint failed" },
  // Missing required value
  P2011: { status: 400, error: "Missing required value" },
  // Value too long for column
  P2000: { status: 400, error: "Value too long for column" },
  // Invalid value
  P2004: { status: 400, error: "Invalid value for column" },
  // Null constraint violation
  P2010: { status: 400, error: "Null constraint violation" },
  // Record already exists
  P2009: { status: 409, error: "Record already exists" },
  // Query interpretation error (misal, type mismatch)
  P2015: { status: 400, error: "Query interpretation error" },
  // Query validation error
  P2016: { status: 400, error: "Query validation error" },
};

export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const mapped = prismaErrorMap[error.code];
    if (mapped) {
      res.status(mapped.status).json({ error: mapped.error });
      return;
    }
    res.status(400).json({ error: "Database error" });
    return;
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({ error: "Invalid request to database" });
    return;
  }

  if (error.name === "ZodError" && Array.isArray(error.errors)) {
    const messages = error.errors.map((item: any) => item.message);
    const message = messages.join(", ");
    res.status(400).json({
      error: "Validation error",
      details: message,
    });
    return;
  }

  if (
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientRustPanicError
  ) {
    res.status(500).json({ error: "Database initialization error" });
    return;
  }

  res.status(error.status || 500).json({
    error: "Internal server error",
  });
  return;
}
