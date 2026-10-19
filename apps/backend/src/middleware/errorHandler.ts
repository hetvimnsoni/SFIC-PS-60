import type { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error("Unhandled Error in API handler:", err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal server error occurred";

  res.status(statusCode).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
  });
}
