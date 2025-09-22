import Image from "next/image";
import { motion } from "framer-motion";
import { formatCurrency, formatDelta, formatNumber } from "@/lib/format";
import type { MarketCoin } from "@/types/domain";
import { X } from "lucide-react";

interface CoinDetailSheetProps {
  coin: MarketCoin | null;
  onClose: () => void;
}

export function CoinDetailSheet({ coin, onClose }: CoinDetailSheetProps) {
  if (!coin) return null;

  const changeColor =
    coin.priceChangePct24h >= 0 ? "text-emerald-600" : "text-rose-600";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-3xl rounded-t-3xl bg-white shadow-xl"
        initial={{ y: 72, scale: 0.92, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 72, scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 24, mass: 0.9 }}
        onClick={(event) => event.stopPropagation()}
        layout
        layoutId={`coin-row-${coin.id}`}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 p-6">
          <div className="flex items-center gap-3">
            <motion.div
              layoutId={`coin-avatar-${coin.id}`}
              className="h-12 w-12 overflow-hidden rounded-full border border-zinc-200 bg-white shadow-inner"
            >
              <Image
                src={coin.image}
                alt={coin.name}
                width={48}
                height={48}
                className="h-full w-full object-contain"
              />
            </motion.div>
            <motion.div layoutId={`coin-meta-${coin.id}`} className="space-y-0.5">
              <h3 className="text-lg font-semibold text-zinc-900">{coin.name}</h3>
              <p className="text-sm uppercase text-zinc-500">{coin.symbol}</p>
            </motion.div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-zinc-200 p-2 text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-700"
            aria-label="Close details"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2">
          <div>
            <p className="text-sm text-zinc-500">Current Price</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-900">
              {formatCurrency(coin.price)}
            </p>
            <p className={`mt-2 text-sm font-semibold ${changeColor}`}>
              {formatDelta(coin.priceChangePct24h)} ({coin.priceChange24h >= 0 ? "+" : "-"}
              {formatCurrency(Math.abs(coin.priceChange24h))})
            </p>
          </div>
          <div>
            <p className="text-sm text-zinc-500">Market Rank</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-900">
              #{coin.rank ?? "-"}
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Updated moments ago - Data refreshes every 60s.
            </p>
          </div>
        </div>

        <div className="grid gap-4 border-t border-zinc-200 p-6 sm:grid-cols-3">
          <Stat label="Market Cap" value={formatCurrency(coin.marketCap)} />
          <Stat label="24h Volume" value={formatCurrency(coin.volume24h)} />
          <Stat label="Circulating Supply" value={formatNumber(coin.circulation)} />
          <Stat
            label="Max Supply"
            value={coin.maxSupply ? formatNumber(coin.maxSupply) : "-"}
          />
          <Stat
            label="1h Change"
            value={formatDelta(coin.priceChangePct1h)}
            trendValue={coin.priceChangePct1h}
          />
          <Stat
            label="7d Change"
            value={formatDelta(coin.priceChangePct7d)}
            trendValue={coin.priceChangePct7d}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

interface StatProps {
  label: string;
  value: string;
  trendValue?: number | undefined;
}

function Stat({ label, value, trendValue }: StatProps) {
  const trendColor =
    trendValue === undefined
      ? "text-zinc-900"
      : trendValue >= 0
      ? "text-emerald-600"
      : "text-rose-600";

  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className={`mt-2 text-sm font-semibold ${trendColor}`}>{value}</p>
    </div>
  );
}
