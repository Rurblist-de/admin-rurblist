import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { clearAuthCookie } from "~/lib/auth/session";
import { logoutAdmin } from "../services";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutAdmin,
    onSettled: async () => {
      clearAuthCookie();
      queryClient.clear();
      await navigate("/login");
    },
  });
}
