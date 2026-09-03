import type { ApiErrorItem, ApiErrorPayload } from "./base-response";

type ErrorResponseLike = {
  message?: string | string[];
  errors?: ApiErrorPayload;
};

function hasMessage(
  value: ApiErrorItem,
): value is ApiErrorItem & { message: string } {
  return typeof value.message === "string" && value.message.trim().length > 0;
}

export function normalizeApiErrors(
  errors: ApiErrorPayload | undefined,
): ApiErrorItem[] {
  if (!errors) return [];

  if (Array.isArray(errors)) {
    return errors;
  }

  if (typeof errors.message === "string") {
    return [errors];
  }

  return Object.entries(errors).flatMap(([field, value]) => {
    if (!value) {
      return [];
    }

    if (typeof value === "string") {
      return [{ field, message: value }];
    }

    if (Array.isArray(value)) {
      return value.map((message) => ({ field, message }));
    }

    return [{ field, ...value }];
  });
}

export function getErrorMessage(
  response: ErrorResponseLike | null | undefined,
): string | null {
  if (!response) return null;

  const messages: string[] = [];

  if (typeof response.message === "string" && response.message.trim()) {
    messages.push(response.message);
  }

  if (Array.isArray(response.message)) {
    messages.push(...response.message.filter((message) => message.trim()));
  }

  const firstError = normalizeApiErrors(response.errors).find(hasMessage);

  if (firstError?.message && !messages.includes(firstError.message)) {
    messages.push(firstError.message);
  }

  return messages.length ? messages.join("\n") : null;
}
