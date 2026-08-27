import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query-keys";
import authQuery from "./auth.query";

export class AuthOptions {
  static readonly getMe = () =>
    queryOptions({
      queryKey: queryKeys.auth.me,
      queryFn: authQuery.getMe,
      staleTime: 15 * 60 * 1000,
    });
}
