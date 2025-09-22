import { Fragment } from "react";

interface BubblePanelProps {
  open: boolean;
  onClose: () => void;
}

const bubbleLayers = [
  { size: 160, top: "-10%", left: "15%", colors: "from-emerald-300/80 via-emerald-200/40 to-transparent", delay: "0s" },
  { size: 220, top: "20%", left: "65%", colors: "from-sky-300/80 via-sky-200/40 to-transparent", delay: "0.8s" },
  { size: 140, top: "55%", left: "25%", colors: "from-indigo-300/80 via-indigo-200/40 to-transparent", delay: "1.2s" },
  { size: 260, top: "65%", left: "55%", colors: "from-purple-300/70 via-purple-200/30 to-transparent", delay: "0.4s" },
];

export function BubblePanel({ open, onClose }: BubblePanelProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-8 backdrop-blur-sm">
      <div className="bubble-panel relative w-full max-w-3xl overflow-hidden rounded-[40px] border border-white/40 bg-white/65 p-[2px] shadow-[0_40px_120px_-45px_rgba(16,185,129,0.75)] backdrop-blur-2xl">
        <div className="relative rounded-[38px] bg-gradient-to-br from-white/80 via-emerald-50/60 to-sky-50/50 p-8">
          <div className="absolute inset-0 pointer-events-none">
            {bubbleLayers.map((bubble, index) => (
              <Fragment key={index}>
                <div
                  className={`bubble-panel__bubble bubble-panel__bubble--pulse bg-gradient-to-br ${bubble.colors}`}
                  style={{
                    width: bubble.size,
                    height: bubble.size,
                    top: bubble.top,
                    left: bubble.left,
                    animationDelay: bubble.delay,
                  }}
                />
                <div
                  className={`bubble-panel__bubble bg-gradient-to-br ${bubble.colors}`}
                  style={{
                    width: bubble.size * 0.6,
                    height: bubble.size * 0.6,
                    top: `calc(${bubble.top} + 12%)`,
                    left: `calc(${bubble.left} + 8%)`,
                    animationDelay: `calc(${bubble.delay} + 0.4s)`,
                  }}
                />
              </Fragment>
            ))}
          </div>
          <div className="relative flex flex-col gap-6 text-zinc-700">
            <header className="space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-600 shadow-sm">
                Live Coin Pulse
              </span>
              <h2 className="text-3xl font-semibold text-zinc-900">
                Curate Your Custom Coin List
              </h2>
              <p className="max-w-2xl text-sm text-zinc-600">
                Tap into the market energy—add coins you want to monitor closely and watch the interactive bubbles respond. Each bubble grows with market cap and glows brighter with stronger 24h momentum.
              </p>
            </header>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-inner">
                <h3 className="text-sm font-semibold text-zinc-800">How it works</h3>
                <ul className="mt-3 space-y-2 text-xs text-zinc-600">
                  <li>Pick coins from the market table to populate your curated list.</li>
                  <li>Use this space to note trading hypotheses, set alerts, or snapshot trends.</li>
                  <li>All interactions stay local; export soon to share with teammates.</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-white/60 bg-gradient-to-br from-emerald-100/60 via-white/70 to-sky-100/60 p-4 shadow-inner">
                <h3 className="text-sm font-semibold text-zinc-800">Why this rocks</h3>
                <ul className="mt-3 space-y-2 text-xs text-zinc-600">
                  <li>Bubbles visualize momentum without leaving the dashboard.</li>
                  <li>Frosted glass vibes keep focus on strategy with a premium finish.</li>
                  <li>Zero interference with the primary workflow—dismiss anytime.</li>
                </ul>
              </div>
            </div>
            <footer className="flex flex-col gap-3 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
              <p>Coming soon: sync this list with alerts, social feeds, and DAO watchlists.</p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full bg-white/90 px-5 py-2 text-sm font-semibold text-emerald-600 shadow-lg shadow-emerald-100 transition hover:bg-white"
                >
                  Close
                </button>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

