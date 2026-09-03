import type { AuthMe } from "~/services/api/types";

export type LoginPayload = {
  email: string;
  password: string;
};

export type AdminLoginData = AuthMe & {
  accessToken: string;
  refreshToken?: string;
};
