import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query-keys";
import { reviewAgentKyc } from "../services";

export function useReviewAgent(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (action: "approve" | "reject") => reviewAgentKyc(userId, action),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.users.get(userId) }),
        queryClient.invalidateQueries({ queryKey: ["users", "list"] }),
      ]);
    },
  });
}
