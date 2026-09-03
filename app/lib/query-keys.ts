export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  overview: {
    listings: ["overview", "listings"] as const,
    escrow: ["overview", "escrow"] as const,
    verifications: ["overview", "verifications"] as const,
    escrowTrend: ["overview", "escrow-trend"] as const,
    listingsByState: ["overview", "listings-by-state"] as const,
    attention: ["overview", "attention"] as const,
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
  escrow: {
    list: (params?: Record<string, unknown>) =>
      ["escrow", "list", params] as const,
    get: (id: string) => ["escrow", id] as const,
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
