export type ApiErrorItem = {
  field?: string;
  message?: string;
  [key: string]: unknown;
};

export type ApiErrorPayload =
  | ApiErrorItem[]
  | Record<string, ApiErrorItem | string | string[] | undefined>;

export type NextCursorModel = {
  value?: string | Date;
  id?: string;
};

export type ApiResponse<T> = {
  data?: T;
  message: string;
  statusCode: number;
  error?: string;
  errors?: ApiErrorItem[];
  status?: string;
  requestId?: string;
  success?: boolean;
  count?: number;
  code?: string;
  hasNextPage?: boolean;
  nextCursor?: NextCursorModel;
};

export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
