import { keepPreviousData } from "@tanstack/react-query";

export const queryTiming = {
  static: {
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 45,
    refetchOnWindowFocus: false,
  },
  list: {
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 20,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    placeholderData: keepPreviousData,
  },
  detail: {
    staleTime: 1000 * 60 * 8,
    gcTime: 1000 * 60 * 25,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  },
};
