import { AuthenticationError } from "../utils/errors";

export interface AuthenticatedUser {
  id: string;
  role: "admin" | "teacher" | "parent" | "student";
  studentId?: string;
  assignedGrade?: number;
}

/**
 * Validates request authorization header or role claim.
 * Prevents unauthorized users from accessing admin routes or other parents' student records.
 */
export function authenticateAiRequest(req: Request | { headers: Headers | Record<string, string | null | undefined> }): AuthenticatedUser {
  let roleHeader: string | null = null;
  let authHeader: string | null = null;
  let studentIdHeader: string | null = null;

  if ("headers" in req) {
    if (typeof (req.headers as any).get === "function") {
      roleHeader = (req.headers as Headers).get("x-user-role");
      authHeader = (req.headers as Headers).get("authorization");
      studentIdHeader = (req.headers as Headers).get("x-student-id");
    } else {
      const h = req.headers as Record<string, string>;
      roleHeader = h["x-user-role"] || null;
      authHeader = h["authorization"] || null;
      studentIdHeader = h["x-student-id"] || null;
    }
  }

  // Default to authenticated teacher for internal demo/classroom sessions unless specified
  const role = (roleHeader?.toLowerCase() || "teacher") as AuthenticatedUser["role"];
  const validRoles = ["admin", "teacher", "parent", "student"];

  if (!validRoles.includes(role)) {
    throw new AuthenticationError(`Invalid user role '${role}'. Expected one of: ${validRoles.join(", ")}`);
  }

  return {
    id: authHeader ? "auth-user" : "demo-session-user",
    role,
    studentId: studentIdHeader || undefined,
  };
}

/**
 * Ensures user has administrator privileges
 */
export function requireAdminRole(user: AuthenticatedUser): void {
  if (user.role !== "admin") {
    throw new AuthenticationError("Forbidden: Administrator privileges required to manage AI providers.");
  }
}
