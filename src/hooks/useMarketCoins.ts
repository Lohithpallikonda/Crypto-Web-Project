"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchMarketCoins,
  type MarketSortKey,
  type SortOrder,
} from "@/services/coingecko";

export interface UseMarketCoinsOptions {
  page: number;
  perPage: number;
  sortKey: MarketSortKey;
  order: SortOrder;
  search?: string;
  vsCurrency?: string;
}

export function useMarketCoins(options: UseMarketCoinsOptions) {
  const { page, perPage, sortKey, order, search, vsCurrency } = options;

  return useQuery({
    queryKey: [
      "markets",
      {
        page,
        perPage,
        sortKey,
        order,
        search,
        vsCurrency,
      },
    ],
    queryFn: () =>
      fetchMarketCoins({
        page,
        perPage,
        sortKey,
        order,
        search,
        vsCurrency,
      }),
    placeholderData: (previousData) => previousData,
    retry: 1,
    refetchInterval: 60 * 1000,
  });
}
