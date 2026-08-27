import { useQuery } from "@tanstack/react-query";
import { AuthOptions } from "./auth.options";

export function useMe() {
  const query = useQuery(AuthOptions.getMe());
  return {
    me: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
