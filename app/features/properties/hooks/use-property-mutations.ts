import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query-keys";
import {
  completePropertyInspection,
  reviewPropertyDocument,
  reviewPropertyListing,
  schedulePropertyInspection,
  type PropertyDocumentAction,
  type PropertyDocumentType,
  type PropertyListingAction,
} from "../services";

export function usePropertyMutations(propertyId: string) {
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: queryKeys.properties.get(propertyId),
      }),
      queryClient.invalidateQueries({ queryKey: ["properties", "list"] }),
    ]);
  };

  const reviewDocument = useMutation({
    mutationFn: ({
      docType,
      action,
    }: {
      docType: PropertyDocumentType;
      action: PropertyDocumentAction;
    }) => reviewPropertyDocument(propertyId, docType, action),
    onSuccess: invalidate,
  });

  const scheduleInspection = useMutation({
    mutationFn: (payload: { scheduledAt: string; note?: string }) =>
      schedulePropertyInspection(propertyId, payload),
    onSuccess: invalidate,
  });

  const completeInspection = useMutation({
    mutationFn: (payload?: { note?: string }) =>
      completePropertyInspection(propertyId, payload),
    onSuccess: invalidate,
  });

  const reviewListing = useMutation({
    mutationFn: (action: PropertyListingAction) =>
      reviewPropertyListing(propertyId, action),
    onSuccess: invalidate,
  });

  return {
    reviewDocument,
    scheduleInspection,
    completeInspection,
    reviewListing,
  };
}
