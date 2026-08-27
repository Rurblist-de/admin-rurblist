export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  overview: {
    stats: ["overview", "stats"] as const,
  },
  users: {
    list: (params?: Record<string, unknown>) =>
      ["users", "list", params] as const,
    get: (id: string) => ["users", id] as const,
  },
  agents: {
    list: (params?: Record<string, unknown>) =>
      ["agents", "list", params] as const,
    get: (id: string) => ["agents", id] as const,
  },
  properties: {
    list: (params?: Record<string, unknown>) =>
      ["properties", "list", params] as const,
    get: (id: string) => ["properties", id] as const,
  },
  payments: {
    list: (params?: Record<string, unknown>) =>
      ["payments", "list", params] as const,
    get: (id: string) => ["payments", id] as const,
  },
  verifications: {
    list: (params?: Record<string, unknown>) =>
      ["verifications", "list", params] as const,
    get: (id: string) => ["verifications", id] as const,
  },
  tickets: {
    list: (params?: Record<string, unknown>) =>
      ["tickets", "list", params] as const,
    get: (id: string) => ["tickets", id] as const,
  },
  notifications: {
    list: ["notifications", "list"] as const,
  },
  auditLogs: {
    list: (params?: Record<string, unknown>) =>
      ["audit-logs", "list", params] as const,
  },
  content: {
    list: ["content", "list"] as const,
  },
};
