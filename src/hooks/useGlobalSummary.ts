"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchGlobalSummary } from "@/services/coingecko";

export function useGlobalSummary(vsCurrency = "usd") {
  return useQuery({
    queryKey: ["global-summary", { vsCurrency }],
    queryFn: () => fetchGlobalSummary(vsCurrency),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });
}
