"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchHighlightGroups } from "@/services/coingecko";

export function useHighlightGroups(vsCurrency = "usd") {
  return useQuery({
    queryKey: ["highlights", { vsCurrency }],
    queryFn: () => fetchHighlightGroups(vsCurrency),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });
}
