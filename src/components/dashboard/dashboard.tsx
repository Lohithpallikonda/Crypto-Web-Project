'use client';

import { AnimatePresence, LayoutGroup } from "framer-motion";
import { useEffect, useState } from "react";
import { useMarketCoins } from "@/hooks/useMarketCoins";
import { useHighlightGroups } from "@/hooks/useHighlightGroups";
import { useGlobalSummary } from "@/hooks/useGlobalSummary";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { MarketCoin } from "@/types/domain";
import type { MarketSortKey, SortOrder } from "@/services/coingecko";
import { HighlightsGrid } from "./highlights-grid";
import { SummaryStrip } from "./summary-strip";
import { MarketTable } from "./market-table";
import { BubblePanel } from "./bubble-panel";
import { CoinDetailSheet } from "./coin-detail-sheet";

const DEFAULT_PER_PAGE = 25;

export function Dashboard() {
  const [page, setPage] = useState(1);
  const [perPage] = useState(DEFAULT_PER_PAGE);
  const [sortKey, setSortKey] = useState<MarketSortKey>("market_cap");
  const [order, setOrder] = useState<SortOrder>("desc");
  const [search, setSearch] = useState("");
  const [selectedCoin, setSelectedCoin] = useState<MarketCoin | null>(null);
  const [showBubblePanel, setShowBubblePanel] = useState(false);

  const debouncedSearch = useDebouncedValue(search, 400);

  const marketsQuery = useMarketCoins({
    page,
    perPage,
    sortKey,
    order,
    search: debouncedSearch,
  });

  const highlightsQuery = useHighlightGroups();
  const summaryQuery = useGlobalSummary();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleSortChange = (key: MarketSortKey) => {
    if (sortKey === key) {
      setOrder((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setOrder("desc");
  };

  const handleChangePage = (direction: "next" | "prev") => {
    setPage((current) => {
      if (direction === "prev") {
        return Math.max(1, current - 1);
      }
      if (marketsQuery.data?.hasNextPage) {
        return current + 1;
      }
      return current;
    });
  };

  const coins = marketsQuery.data?.coins ?? [];
  const hasNextPage = marketsQuery.data?.hasNextPage ?? false;
  const isEmpty =
    !marketsQuery.isLoading && !marketsQuery.isFetching && coins.length === 0;

  const loadingHighlights = highlightsQuery.isLoading;
  const loadingSummary = summaryQuery.isLoading;

  const onRowClick = (coin: MarketCoin) => setSelectedCoin(coin);
  const onCloseDetail = () => setSelectedCoin(null);

  const openBubblePanel = () => setShowBubblePanel(true);
  const closeBubblePanel = () => setShowBubblePanel(false);

  const highlights = highlightsQuery.data;
  const summary = summaryQuery.data;

  const highlightError = highlightsQuery.error as Error | null;
  const summaryError = summaryQuery.error as Error | null;

  const searchValue = search;

  return (
    <LayoutGroup>
      <div className="flex flex-col gap-8 pb-12">
        <SummaryStrip
        data={summary}
        isLoading={loadingSummary}
        error={summaryError}
        onRetry={summaryQuery.refetch}
      />

      <HighlightsGrid
        groups={highlights}
        isLoading={loadingHighlights}
        error={highlightError}
        onRetry={highlightsQuery.refetch}
      />

      <MarketTable
        coins={coins}
        isLoading={marketsQuery.isLoading}
        isFetching={marketsQuery.isFetching}
        isError={marketsQuery.isError}
        error={marketsQuery.error as Error | null}
        searchValue={searchValue}
        onSearchChange={setSearch}
        sortKey={sortKey}
        order={order}
        onSortChange={handleSortChange}
        page={page}
        onChangePage={handleChangePage}
        hasNextPage={hasNextPage}
        isEmpty={isEmpty}
        onRetry={marketsQuery.refetch}
        onRowClick={onRowClick}
        onOpenBubblePanel={openBubblePanel}
      />

      <AnimatePresence mode="wait">
        {selectedCoin ? (
          <CoinDetailSheet
            key={selectedCoin.id}
            coin={selectedCoin}
            onClose={onCloseDetail}
          />
        ) : null}
      </AnimatePresence>

      <BubblePanel open={showBubblePanel} onClose={closeBubblePanel} />
      </div>
    </LayoutGroup>
  );
}







