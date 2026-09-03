import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query-keys";
import {
  completeEscrowInspection,
  reviewEscrowCase,
  reviewEscrowDocument,
  scheduleEscrowInspection,
  type EscrowCaseAction,
  type EscrowDocumentAction,
} from "../services";

export function useEscrowMutations(verificationId: string) {
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: queryKeys.escrow.get(verificationId),
      }),
      queryClient.invalidateQueries({ queryKey: ["escrow", "list"] }),
      queryClient.invalidateQueries({ queryKey: queryKeys.overview.escrow }),
      queryClient.invalidateQueries({ queryKey: queryKeys.overview.attention }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.overview.verifications,
      }),
    ]);
  };

  const reviewDocument = useMutation({
    mutationFn: ({
      documentId,
      action,
      note,
    }: {
      documentId: string;
      action: EscrowDocumentAction;
      note?: string;
    }) => reviewEscrowDocument(verificationId, documentId, action, note),
    onSuccess: invalidate,
  });

  const scheduleInspection = useMutation({
    mutationFn: (payload: { scheduledAt: string; note?: string }) =>
      scheduleEscrowInspection(verificationId, payload),
    onSuccess: invalidate,
  });

  const completeInspection = useMutation({
    mutationFn: (payload?: { note?: string }) =>
      completeEscrowInspection(verificationId, payload),
    onSuccess: invalidate,
  });

  const reviewCase = useMutation({
    mutationFn: ({
      action,
      note,
      rejectionReason,
    }: {
      action: EscrowCaseAction;
      note?: string;
      rejectionReason?: string;
    }) => reviewEscrowCase(verificationId, action, { note, rejectionReason }),
    onSuccess: invalidate,
  });

  return {
    reviewDocument,
    scheduleInspection,
    completeInspection,
    reviewCase,
  };
}
