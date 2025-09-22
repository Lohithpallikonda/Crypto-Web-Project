# Crypto Market Pulse

A production-like cryptocurrency dashboard inspired by CoinGecko. It surfaces live market data, highlights movers, and provides drill-down coin insights with resilient loading, error, and empty states.

## Features
- Real-time markets table with pagination, debounced search, column sorting, and 7-day sparklines.
- Highlight tiles for top gainers, losers, highest volume, and trending coins.
- Global market summary with 24h change indicators.
- Click any row to open a lightweight detail sheet with additional metrics.
- Built-in loading skeletons, retry affordances, and empty-state messaging.

## Tech Stack
- **Next.js 15 (App Router) + React 19**
- **TypeScript** with strict typing of domain models and adapters
- **Tailwind CSS v4** for utility-first styling
- **@tanstack/react-query** for declarative data fetching and caching
- **clsx** for ergonomic conditional class names
- **lucide-react** for accessible iconography

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and fill in values as needed:
   ```bash
   cp .env.example .env.local
   ```
   - `NEXT_PUBLIC_COINGECKO_API_BASE_URL` (optional): override the CoinGecko API host if you need a different environment.
   - `COINGECKO_API_BASE_URL` (optional): server-only override for the upstream host.
   - `COINGECKO_API_KEY` (recommended): your CoinGecko API key. The proxy route injects it server-side so it never reaches the browser.
3. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to explore the dashboard.

| Script | Description |
| ------ | ----------- |
| `npm run dev` | Start the development server with hot reload |
| `npm run lint` | Run ESLint with the project configuration |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |

## Architecture Overview
```
src/
 +- app/               # Next.js app router entry points, API proxy, and global styles
 +- components/        # UI components broken down by feature (dashboard, highlights, table)
 +- hooks/             # Reusable React Query hooks and helpers (debounce, data hooks)
 +- lib/               # Environment helpers, formatting utilities, and CoinGecko client
 +- providers/         # Application-level providers (React Query)
 +- services/          # Domain-level services + adapters for CoinGecko APIs
 +- types/             # API response types and domain models
```

### Design Patterns & Decisions
- **Service + Adapter Layer:** `services/coingecko.ts` converts raw API responses into stable domain models (`types/domain.ts`). UI components consume these models without depending on the external API shape.
- **React Query Caching:** Queries are keyed by parameters (page, sorting, search) enabling optimistic re-use, background refreshes, and retry handling. Debounced search waits 400 ms before issuing a request.
- **Server Proxy for CORS:** A catch-all route handler under `app/api/coingecko/[...slug]` forwards browser requests to CoinGecko, injects the API key server-side, and avoids CORS issues while keeping credentials off the client bundle.
- **Separation of Concerns:** Hooks encapsulate fetch + cache logic, while UI components remain purely presentational and easy to test.
- **Defensive UI States:** Loading skeletons, retry CTAs, empty messages, and modal dismissal all guard against degraded network conditions.
- **Utility Modules:** Formatting helpers centralize currency/percentage rendering. A tiny sparkline renderer avoids pulling an external chart dependency.

### Sorting, Pagination, and Search
- Sorting delegates to CoinGecko ordering when possible (`price`, `market_cap`, `volume`, `price_change_percentage_24h`).
- Pagination uses the API's `page`/`per_page` parameters and disables the "Next" button when fewer results are returned.
- Search leverages `/search` to map query text to coin IDs, then hydrates those IDs via `/coins/markets` and sorts client-side to respect the selected column order.

## Assumptions & Limitations
- Sparkline data comes from the 7-day price series; if the API omits it the UI shows a placeholder.
- The free CoinGecko tier is rate limited; high-frequency usage without a key may lead to throttling. React Query retry is capped at 1 attempt to avoid hammering the API.
- Only USD (`vs_currency=usd`) is supported out-of-the-box. Extending to additional currencies would require a selector feeding the hooks.

## Future Enhancements
1. Add server-side caching (e.g., Next Route Handlers or Edge cache) to further shield rate limits.
2. Introduce automated tests (React Testing Library + MSW) for hooks and components.
3. Persist table preferences (sort, per-page) in the URL for shareable views.
4. Expand highlights with additional categories (e.g., 7d movers, DeFi, Gaming filters).
5. Implement WebSocket or SSE feed to push live price deltas without polling.

## Deployment
Deploy to platforms like Vercel or Netlify. If deploying to Vercel:
```bash
npm run build
npm run start
```
Ensure environment variables are configured in the hosting provider and that external image domains (`assets.coingecko.com`, `coin-images.coingecko.com`) are whitelisted.

---
Built with care to emphasise clean abstractions, resilient UX states, and production-ready ergonomics.
