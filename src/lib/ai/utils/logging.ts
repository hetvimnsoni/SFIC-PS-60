import { sanitizeErrorMessage } from "./errors";

export interface AiLogEntry {
  level: "info" | "warn" | "error";
  message: string;
  provider?: string;
  task?: string;
  latencyMs?: number;
  statusCode?: number;
  timestamp?: string;
  details?: Record<string, any>;
}

export class AiLogger {
  private sanitizeData(data: any): any {
    if (typeof data === "string") {
      return sanitizeErrorMessage(data);
    }
    if (Array.isArray(data)) {
      return data.map((item) => this.sanitizeData(item));
    }
    if (data && typeof data === "object") {
      const sanitized: Record<string, any> = {};
      for (const [k, v] of Object.entries(data)) {
        if (
          k.toLowerCase().includes("key") ||
          k.toLowerCase().includes("secret") ||
          k.toLowerCase().includes("token") ||
          k.toLowerCase().includes("auth")
        ) {
          sanitized[k] = "••••••••";
        } else {
          sanitized[k] = this.sanitizeData(v);
        }
      }
      return sanitized;
    }
    return data;
  }

  info(message: string, context?: Record<string, any>): void {
    const entry: AiLogEntry = {
      level: "info",
      message: sanitizeErrorMessage(message),
      timestamp: new Date().toISOString(),
      details: context ? this.sanitizeData(context) : undefined,
    };
    console.log(`[AI-INFO] ${entry.timestamp} - ${entry.message}`, entry.details || "");
  }

  warn(message: string, context?: Record<string, any>): void {
    const entry: AiLogEntry = {
      level: "warn",
      message: sanitizeErrorMessage(message),
      timestamp: new Date().toISOString(),
      details: context ? this.sanitizeData(context) : undefined,
    };
    console.warn(`[AI-WARN] ${entry.timestamp} - ${entry.message}`, entry.details || "");
  }

  error(message: string, error?: any, context?: Record<string, any>): void {
    const rawError = error?.message || String(error || "");
    const entry: AiLogEntry = {
      level: "error",
      message: sanitizeErrorMessage(message),
      timestamp: new Date().toISOString(),
      details: {
        error: sanitizeErrorMessage(rawError),
        ...(context ? this.sanitizeData(context) : {}),
      },
    };
    console.error(`[AI-ERROR] ${entry.timestamp} - ${entry.message}`, entry.details);
  }
}

export const aiLogger = new AiLogger();
