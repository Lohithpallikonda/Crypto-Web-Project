'use client';

import { ChangeEvent, memo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowDownWideNarrow,
  ArrowUpDown,
  ArrowUpWideNarrow,
  Loader2,
  RefreshCcw,
  Search,
} from "lucide-react";
import clsx from "clsx";
import { formatCurrency, formatDelta } from "@/lib/format";
import type { MarketCoin } from "@/types/domain";
import type { MarketSortKey, SortOrder } from "@/services/coingecko";

interface MarketTableProps {
  coins: MarketCoin[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  searchValue: string;
  onSearchChange: (value: string) => void;
  sortKey: MarketSortKey;
  order: SortOrder;
  onSortChange: (key: MarketSortKey) => void;
  page: number;
  onChangePage: (direction: "next" | "prev") => void;
  hasNextPage: boolean;
  isEmpty: boolean;
  onRetry: () => void;
  onRowClick: (coin: MarketCoin) => void;
  onOpenBubblePanel: () => void;
}

export const MarketTable = memo(function MarketTable({
  coins,
  isLoading,
  isFetching,
  isError,
  error,
  searchValue,
  onSearchChange,
  sortKey,
  order,
  onSortChange,
  page,
  onChangePage,
  hasNextPage,
  isEmpty,
  onRetry,
  onRowClick,
  onOpenBubblePanel,
}: MarketTableProps) {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const handleCoinSelect = (coin: MarketCoin) => {
    setActiveRowId(coin.id);
    onRowClick(coin);
    setTimeout(() => {
      setActiveRowId((current) => (current === coin.id ? null : current));
    }, 500);
  };

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-4 rounded-3xl border border-emerald-100/60 bg-white/80 p-5 shadow-xl shadow-emerald-100/40 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900">
            Cryptocurrency Prices by Market Cap
          </h2>
          <p className="text-sm text-zinc-500">
            Live market data with filtering, sorting, and quick drill-down.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
            <input
              type="search"
              value={searchValue}
              onChange={handleSearch}
              placeholder="Search by name or symbol"
              className="w-full rounded-full border border-transparent bg-emerald-50/80 py-2 pl-9 pr-4 text-sm text-zinc-700 shadow-inner transition focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
          {isFetching ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 shadow-inner">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
            </div>
          ) : null}
          <button
            type="button"
            onClick={onOpenBubblePanel}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-sky-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:scale-[1.02] hover:shadow-xl"
          >
            List Coin View
          </button>
        </div>
      </header>

      <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/90 shadow-xl shadow-zinc-200/60">
        <div className="w-full overflow-x-auto">
          <div className="scroll-area max-h-[540px] overflow-y-auto">
            <table className="min-w-full divide-y divide-zinc-200">
              <thead className="sticky top-0 z-20 bg-white/95 backdrop-blur">
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  <th className="px-5 py-3">#</th>
                  <th className="px-5 py-3">Coin</th>
                  <SortableHeader
                    label="Price"
                    sortKey="price"
                    activeKey={sortKey}
                    order={order}
                    onChange={onSortChange}
                  />
                  <SortableHeader
                    label="24h Change"
                    sortKey="change24h"
                    activeKey={sortKey}
                    order={order}
                    onChange={onSortChange}
                  />
                  <SortableHeader
                    label="24h Volume"
                    sortKey="volume"
                    activeKey={sortKey}
                    order={order}
                    onChange={onSortChange}
                  />
                  <SortableHeader
                    label="Market Cap"
                    sortKey="market_cap"
                    activeKey={sortKey}
                    order={order}
                    onChange={onSortChange}
                  />
                  <th className="px-5 py-3 text-right">Last 7d</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-sm text-zinc-700">
                {isLoading ? (
                  <SkeletonRows />
                ) : isError ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-3xl bg-rose-50/80 p-6 shadow-inner">
                        <p className="text-base font-semibold text-rose-900">
                          We could not load the market data.
                        </p>
                        <p className="text-sm text-rose-700">{error?.message}</p>
                        <button
                          type="button"
                          onClick={onRetry}
                          className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600"
                        >
                          <RefreshCcw className="h-4 w-4" />
                          Retry
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : isEmpty ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="mx-auto max-w-md rounded-3xl border border-emerald-100 bg-emerald-50/60 p-6">
                        <p className="text-base font-semibold text-emerald-800">
                          No results found
                        </p>
                        <p className="mt-2 text-sm text-emerald-700">
                          Try adjusting your filters or search query.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  coins.map((coin) => {
                    const priceChangeSign = coin.priceChange24h >= 0 ? "+" : "-";
                    const changeColor =
                      coin.priceChangePct24h >= 0
                        ? "text-emerald-600"
                        : "text-rose-600";
                    const absoluteChange = `${priceChangeSign}${formatCurrency(
                      Math.abs(coin.priceChange24h)
                    )}`;

                    return (
                      <motion.tr
                        layoutId={`coin-row-${coin.id}`}
                        key={coin.id}
                        className={clsx(
                          "table-row-press relative cursor-pointer bg-white/60 transition hover:bg-emerald-50/80",
                          activeRowId === coin.id && "table-row-press--active"
                        )}
                        onClick={() => handleCoinSelect(coin)}
                        whileTap={{ scale: 0.995 }}
                      >
                        <td className="px-5 py-4 font-semibold text-zinc-400">
                          {coin.rank ?? "-"}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Image
                              src={coin.image}
                              alt={coin.name}
                              width={36}
                              height={36}
                              className="h-9 w-9 rounded-full border border-zinc-200 bg-white object-contain shadow-sm"
                            />
                            <div>
                              <p className="font-semibold text-zinc-900">{coin.name}</p>
                              <p className="text-xs uppercase text-zinc-400">{coin.symbol}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-semibold text-zinc-900">
                          {formatCurrency(coin.price)}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-col">
                            <span className={clsx("text-sm font-semibold", changeColor)}>
                              {absoluteChange}
                            </span>
                            <span className={clsx("text-xs", changeColor)}>
                              {formatDelta(coin.priceChangePct24h)}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-semibold text-zinc-900">
                          {formatCurrency(coin.volume24h)}
                        </td>
                        <td className="px-5 py-4 font-semibold text-zinc-900">
                          {formatCurrency(coin.marketCap)}
                        </td>
                        <td className="px-5 py-4">
                          <Sparkline data={coin.sparkline7d ?? []} />
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        <footer className="flex flex-col gap-3 border-t border-zinc-200 bg-zinc-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-zinc-500">
            Page {page}
            {hasNextPage ? " - Live updates every minute" : ""}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onChangePage("prev")}
              disabled={page === 1}
              className="rounded-full border border-zinc-200/80 px-5 py-2 text-sm font-semibold text-zinc-600 transition hover:border-emerald-300 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => onChangePage("next")}
              disabled={!hasNextPage}
              className="rounded-full border border-zinc-200/80 px-5 py-2 text-sm font-semibold text-zinc-600 transition hover:border-emerald-300 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </footer>
      </div>
    </section>
  );
});

interface SortableHeaderProps {
  label: string;
  sortKey: MarketSortKey;
  activeKey: MarketSortKey;
  order: SortOrder;
  onChange: (key: MarketSortKey) => void;
}

function SortableHeader({ label, sortKey, activeKey, order, onChange }: SortableHeaderProps) {
  const isActive = sortKey === activeKey;
  const Icon = !isActive
    ? ArrowUpDown
    : order === "asc"
    ? ArrowUpWideNarrow
    : ArrowDownWideNarrow;

  return (
    <th className="px-5 py-3">
      <button
        type="button"
        onClick={() => onChange(sortKey)}
        className={clsx(
          "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition",
          isActive
            ? "bg-emerald-100 text-emerald-700 shadow-sm"
            : "text-zinc-500 hover:bg-zinc-100 hover:text-emerald-600"
        )}
      >
        {label}
        <Icon className="h-3.5 w-3.5" />
      </button>
    </th>
  );
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, index) => (
        <tr key={index} className="animate-pulse">
          <td className="px-5 py-4">
            <div className="h-4 w-4 rounded-full bg-emerald-100/70" />
          </td>
          <td className="px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-emerald-100/70" />
              <div className="space-y-2">
                <div className="h-4 w-24 rounded-full bg-emerald-100/70" />
                <div className="h-3 w-16 rounded-full bg-emerald-100/70" />
              </div>
            </div>
          </td>
          <td className="px-5 py-4">
            <div className="h-4 w-20 rounded-full bg-emerald-100/70" />
          </td>
          <td className="px-5 py-4">
            <div className="space-y-2">
              <div className="h-4 w-16 rounded-full bg-emerald-100/70" />
              <div className="h-3 w-12 rounded-full bg-emerald-100/70" />
            </div>
          </td>
          <td className="px-5 py-4">
            <div className="h-4 w-24 rounded-full bg-emerald-100/70" />
          </td>
          <td className="px-5 py-4">
            <div className="h-4 w-24 rounded-full bg-emerald-100/70" />
          </td>
          <td className="px-5 py-4">
            <div className="h-10 w-full rounded-full bg-emerald-100/70" />
          </td>
        </tr>
      ))}
    </>
  );
}

function Sparkline({ data }: { data: number[] }) {
  if (!data.length) {
    return <div className="h-10 w-24 rounded-full bg-emerald-50/80" />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1 || 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  });

  const path = `M ${points.map((point) => point.replace(",", " ")).join(" L ")}`;
  const isPositive = data[data.length - 1] >= data[0];

  return (
    <svg viewBox="0 0 100 100" className="h-10 w-24">
      <defs>
        <linearGradient id="sparklineStroke" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={isPositive ? "#10b981" : "#f87171"} />
          <stop offset="100%" stopColor={isPositive ? "#38bdf8" : "#fb7185"} />
        </linearGradient>
      </defs>
      <path
        d={path}
        fill="none"
        stroke="url(#sparklineStroke)"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}



















