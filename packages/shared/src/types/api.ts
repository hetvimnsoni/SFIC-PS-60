export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface HealthResponse {
  status: "healthy" | "degraded" | "unhealthy";
  version: string;
  uptime: number;
  timestamp: string;
  environment: string;
  database: {
    status: "connected" | "disconnected" | "fallback_json";
    type: "json" | "postgresql";
  };
  ai: {
    provider: "gemini" | "openai" | "offline_fallback";
    model: string;
    liveAiConfigured: boolean;
  };
}

export interface OverviewReport {
  totalStudents: number;
  totalAssessments: number;
  activeGaps: number;
  resolvedGaps: number;
  remedialPlansUnderIntervention: number;
  remedialPlansCompleted: number;
  masteryDistribution: {
    mastered: number;
    developing: number;
    needsSupport: number;
  };
  priorityBreakdown: {
    high: number;
    medium: number;
    low: number;
  };
  subjectPerformance: {
    subjectCode: string;
    subjectName: string;
    averagePercentage: number;
    gapsCount: number;
  }[];
}
