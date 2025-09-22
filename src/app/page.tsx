import { Dashboard } from "@/components/dashboard/dashboard";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-100 via-white to-emerald-50">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-[-120px] h-[420px] w-[420px] rounded-full bg-gradient-to-br from-emerald-300/70 via-emerald-200/40 to-transparent blur-3xl" />
        <div className="absolute right-[-160px] top-24 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-sky-300/60 via-sky-200/30 to-transparent blur-3xl" />
        <div className="absolute bottom-[-180px] left-1/2 h-[540px] w-[540px] -translate-x-1/2 rounded-full bg-gradient-to-br from-white/60 via-emerald-100/40 to-transparent blur-3xl" />
        <div className="absolute left-1/3 top-[160px] h-[300px] w-[520px] -translate-x-1/2 rounded-[120px] bg-white/35 shadow-[0_25px_80px_-35px_rgba(16,185,129,0.45)] backdrop-blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="rounded-3xl bg-white/60 p-5 shadow-lg shadow-emerald-100/50 backdrop-blur">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Crypto Market Pulse
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600">
              Monitor live cryptocurrency prices, identify movers, and dive into
              coin-level insights powered by the CoinGecko API.
            </p>
          </div>
          <div className="hidden rounded-full bg-white/70 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-600 shadow-lg shadow-emerald-100/50 backdrop-blur sm:block">
            Data refreshed every 60s
          </div>
        </header>
        <Dashboard />
      </div>
    </main>
  );
}
