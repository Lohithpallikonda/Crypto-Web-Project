import { memo } from "react";
import { RefreshCcw } from "lucide-react";
import { formatCurrency, formatDelta } from "@/lib/format";
import type { HighlightGroup } from "@/types/domain";

interface HighlightsGridProps {
  groups?: HighlightGroup[];
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
}

export const HighlightsGrid = memo(function HighlightsGrid({
  groups,
  isLoading,
  error,
  onRetry,
}: HighlightsGridProps) {
  if (isLoading) {
    return (
      <section className="space-y-4 rounded-3xl border border-emerald-100/60 bg-white/70 p-5 shadow-lg shadow-emerald-100/40">
        <header className="flex items-center justify-between">
          <div className="h-5 w-36 rounded-full bg-emerald-100/60" />
          <div className="h-4 w-16 rounded-full bg-emerald-100/60" />
        </header>
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <HighlightSkeleton key={index} />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-3xl border border-rose-200 bg-rose-50/80 p-6 shadow-lg shadow-rose-100/40">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-rose-900">Highlights unavailable</h2>
            <p className="text-sm text-rose-700">{error.message}</p>
          </div>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600"
          >
            <RefreshCcw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </section>
    );
  }

  if (!groups?.length) {
    return null;
  }

  return (
    <section className="space-y-5 rounded-3xl border border-emerald-100/60 bg-white/80 p-5 shadow-xl shadow-emerald-100/40 backdrop-blur">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900">Crypto Highlights</h2>
          <p className="text-sm text-zinc-500">
            Quick pulse on what is moving in the market right now.
          </p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-600">
          Live Feed
        </span>
      </header>
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {groups.map((group) => (
          <HighlightCard key={group.title} group={group} />
        ))}
      </div>
    </section>
  );
});

interface HighlightCardProps {
  group: HighlightGroup;
}

function HighlightCard({ group }: HighlightCardProps) {
  return (
    <article className="flex min-h-[300px] flex-col overflow-hidden rounded-3xl border border-zinc-200/80 bg-gradient-to-br from-white/95 via-white to-emerald-50/40 p-5 shadow-md shadow-emerald-100 transition hover:-translate-y-1 hover:shadow-lg">
      <header className="flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-zinc-900">{group.title}</h3>
        {group.moreHref ? (
          <a
            href={group.moreHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-emerald-600 transition hover:text-emerald-700 hover:underline"
          >
            More
          </a>
        ) : null}
      </header>
      <div className="relative mt-4 flex-1 overflow-hidden rounded-2xl bg-zinc-50/70 p-1">
        <ul className="scroll-area max-h-60 space-y-2 overflow-y-auto pr-1">
          {group.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-xl bg-white/90 px-3 py-2 shadow-sm ring-1 ring-white/70"
            >
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  {item.name}
                  <span className="ml-2 text-xs font-medium uppercase text-zinc-400">
                    {item.symbol}
                  </span>
                </p>
                <p className="text-xs text-zinc-500">{formatCurrency(item.price)}</p>
              </div>
              <p
                className={`text-sm font-semibold ${
                  (item.changePct24h ?? 0) >= 0 ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {formatDelta(item.changePct24h)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function HighlightSkeleton() {
  return (
    <article className="flex min-h-[300px] flex-col rounded-3xl border border-emerald-100/60 bg-white/70 p-5 shadow-inner animate-pulse">
      <div className="h-4 w-24 rounded-full bg-emerald-100/60" />
      <div className="mt-4 space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-3 w-32 rounded-full bg-emerald-100/60" />
              <div className="h-3 w-20 rounded-full bg-emerald-100/60" />
            </div>
            <div className="h-4 w-12 rounded-full bg-emerald-100/60" />
          </div>
        ))}
      </div>
    </article>
  );
}
