import { memo } from "react";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { formatCurrency, formatDelta } from "@/lib/format";
import type { GlobalSummary } from "@/types/domain";

interface SummaryStripProps {
  data?: GlobalSummary;
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
}

export const SummaryStrip = memo(function SummaryStrip({
  data,
  isLoading,
  error,
  onRetry,
}: SummaryStripProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <SummarySkeleton />
        <SummarySkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50/80 p-6 text-rose-900 shadow-lg shadow-rose-100/40">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-semibold">Unable to load market overview.</p>
            <p className="text-sm text-rose-700">{error.message}</p>
          </div>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const isMarketUp = (data.marketCapChangePct24h ?? 0) >= 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <MetricCard
        label="Market Cap"
        value={formatCurrency(data.marketCap)}
        delta={formatDelta(data.marketCapChangePct24h)}
        icon={isMarketUp ? TrendingUp : TrendingDown}
        trendPositive={isMarketUp}
      />
      <MetricCard
        label="24h Volume"
        value={formatCurrency(data.volume24h)}
        delta="Updated moments ago"
        icon={Activity}
        trendPositive={true}
      />
    </div>
  );
});

interface MetricCardProps {
  label: string;
  value: string;
  delta: string;
  icon: React.ComponentType<{ className?: string }>;
  trendPositive: boolean;
}

function MetricCard({ label, value, delta, icon: Icon, trendPositive }: MetricCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-100/70 bg-white/80 p-6 shadow-xl shadow-emerald-100/50">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-sky-50 opacity-80" />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-zinc-900">{value}</p>
          <p
            className={`mt-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
              trendPositive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
            }`}
          >
            {delta}
          </p>
        </div>
        <div
          className={`rounded-2xl p-3 shadow-inner ${
            trendPositive ? "bg-emerald-100/60 text-emerald-600" : "bg-rose-100/60 text-rose-600"
          }`}
        >
          <Icon className="h-7 w-7" />
        </div>
      </div>
    </div>
  );
}

function SummarySkeleton() {
  return (
    <div className="animate-pulse rounded-3xl border border-emerald-100/70 bg-white/70 p-6 shadow-inner">
      <div className="h-4 w-28 rounded-full bg-emerald-100/60" />
      <div className="mt-5 h-9 w-36 rounded-full bg-emerald-100/60" />
      <div className="mt-4 h-4 w-24 rounded-full bg-emerald-100/60" />
    </div>
  );
}
