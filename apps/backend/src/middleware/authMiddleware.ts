import type { Request, Response, NextFunction } from "express";
import type { UserRole } from "../../../../packages/shared/src/types";

export interface AuthenticatedRequest extends Request {
  userRole?: UserRole;
  userEmail?: string;
}

export function requireAuth(roles: UserRole[] = ["teacher", "admin"]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    // For demo environment, we check authorization header or default to teacher
    let role: UserRole = "teacher";
    if (authHeader?.toLowerCase().includes("admin") || req.headers["x-user-role"] === "admin") {
      role = "admin";
    }

    req.userRole = role;

    if (!roles.includes(role)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden: User role '${role}' does not have sufficient permission for this action.`,
      });
    }

    next();
  };
}
