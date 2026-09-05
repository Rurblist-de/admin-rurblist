import type { AuthMe } from "~/services/api/types";

export type LoginPayload = {
  email: string;
  password: string;
};

/** Client-safe admin login payload — JWTs stay in httpOnly API cookies only. */
export type AdminLoginData = AuthMe & {
  authenticated?: boolean;
};
