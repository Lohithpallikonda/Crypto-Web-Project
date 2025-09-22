import { coingeckoFetch } from "@/lib/coingecko-client";
import type {
  CoingeckoMarketCoin,
  CoingeckoTrendingResponse,
  CoingeckoGlobalStats,
  CoingeckoSearchResponse,
} from "@/types/coingecko";
import type {
  HighlightGroup,
  MarketCoin,
  GlobalSummary,
} from "@/types/domain";

export type MarketSortKey = "market_cap" | "price" | "volume" | "change24h";
export type SortOrder = "asc" | "desc";

const ORDER_MAP: Record<MarketSortKey, Record<SortOrder, string>> = {
  market_cap: {
    asc: "market_cap_asc",
    desc: "market_cap_desc",
  },
  price: {
    asc: "price_asc",
    desc: "price_desc",
  },
  volume: {
    asc: "volume_asc",
    desc: "volume_desc",
  },
  change24h: {
    asc: "price_change_percentage_24h_asc",
    desc: "price_change_percentage_24h_desc",
  },
};

const PRICE_CHANGE_PERIODS = "1h,24h,7d";
const DEFAULT_PER_PAGE = 25;
const DEFAULT_CURRENCY = "usd";
const HIGHLIGHT_COUNT = 5;

export interface FetchMarketCoinsParams {
  page?: number;
  perPage?: number;
  sortKey?: MarketSortKey;
  order?: SortOrder;
  search?: string;
  vsCurrency?: string;
}

export interface FetchMarketCoinsResult {
  coins: MarketCoin[];
  hasNextPage: boolean;
}

export async function fetchMarketCoins({
  page = 1,
  perPage = DEFAULT_PER_PAGE,
  sortKey = "market_cap",
  order = "desc",
  search,
  vsCurrency = DEFAULT_CURRENCY,
}: FetchMarketCoinsParams = {}): Promise<FetchMarketCoinsResult> {
  const isSearch = Boolean(search?.trim());

  if (isSearch) {
    return fetchSearchResults({
      search: search!.trim(),
      perPage,
      sortKey,
      order,
      vsCurrency,
    });
  }

  const data = await coingeckoFetch<CoingeckoMarketCoin[]>("/coins/markets", {
    query: {
      vs_currency: vsCurrency,
      order: ORDER_MAP[sortKey][order],
      per_page: perPage,
      page,
      sparkline: true,
      price_change_percentage: PRICE_CHANGE_PERIODS,
    },
  });

  return {
    coins: data.map(toMarketCoin),
    hasNextPage: data.length === perPage,
  };
}

async function fetchSearchResults({
  search,
  perPage,
  sortKey,
  order,
  vsCurrency,
}: Required<Pick<FetchMarketCoinsParams, "search" | "perPage" | "sortKey" | "order" | "vsCurrency">>): Promise<FetchMarketCoinsResult> {
  const lookup = await coingeckoFetch<CoingeckoSearchResponse>("/search", {
    query: {
      query: search,
    },
  });

  const ids = lookup.coins
    .filter((coin) => coin.id)
    .map((coin) => coin.id)
    .slice(0, perPage);

  if (ids.length === 0) {
    return { coins: [], hasNextPage: false };
  }

  const data = await coingeckoFetch<CoingeckoMarketCoin[]>("/coins/markets", {
    query: {
      vs_currency: vsCurrency,
      ids: ids.join(","),
      per_page: ids.length,
      page: 1,
      sparkline: true,
      price_change_percentage: PRICE_CHANGE_PERIODS,
    },
  });

  const coins = data.map(toMarketCoin);
  const sorted = sortMarketCoins(coins, sortKey, order);

  return {
    coins: sorted,
    hasNextPage: false,
  };
}

export async function fetchHighlightGroups(vsCurrency = DEFAULT_CURRENCY) {
  const [gainers, losers, volume, trending] = await Promise.all([
    fetchTopMovers("gainers", vsCurrency),
    fetchTopMovers("losers", vsCurrency),
    fetchTopVolume(vsCurrency),
    fetchTrending(),
  ]);

  return [gainers, losers, volume, trending];
}

async function fetchTopMovers(
  type: "gainers" | "losers",
  vsCurrency: string
): Promise<HighlightGroup> {
  const orderKey =
    type === "gainers"
      ? ORDER_MAP.change24h.desc
      : ORDER_MAP.change24h.asc;

  const data = await coingeckoFetch<CoingeckoMarketCoin[]>("/coins/markets", {
    query: {
      vs_currency: vsCurrency,
      order: orderKey,
      per_page: HIGHLIGHT_COUNT,
      page: 1,
      sparkline: false,
      price_change_percentage: "24h",
    },
  });

  return {
    title: type === "gainers" ? "Top Gainers" : "Top Losers",
    moreHref: "https://www.coingecko.com/en/coins/trending",
    items: data.map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: coin.current_price,
      changePct24h: coin.price_change_percentage_24h,
    })),
  };
}

async function fetchTopVolume(vsCurrency: string): Promise<HighlightGroup> {
  const data = await coingeckoFetch<CoingeckoMarketCoin[]>("/coins/markets", {
    query: {
      vs_currency: vsCurrency,
      order: ORDER_MAP.volume.desc,
      per_page: HIGHLIGHT_COUNT,
      page: 1,
      sparkline: false,
      price_change_percentage: "24h",
    },
  });

  return {
    title: "Highest Volume",
    moreHref: "https://www.coingecko.com/en",
    items: data.map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: coin.current_price,
      changePct24h: coin.price_change_percentage_24h,
      volume24h: coin.total_volume,
    })),
  };
}

async function fetchTrending(): Promise<HighlightGroup> {
  const data = await coingeckoFetch<CoingeckoTrendingResponse>(
    "/search/trending"
  );

  return {
    title: "Trending Coins",
    moreHref: "https://www.coingecko.com/en/discover",
    items: data.coins.map(({ item }) => ({
      id: item.id,
      name: item.name,
      symbol: item.symbol.toUpperCase(),
      price: item.data?.price ?? 0,
      changePct24h: item.data?.price_change_percentage_24h?.usd,
      rank: item.market_cap_rank,
    })),
  };
}

export async function fetchGlobalSummary(
  vsCurrency = DEFAULT_CURRENCY
): Promise<GlobalSummary> {
  const data = await coingeckoFetch<CoingeckoGlobalStats>("/global");
  const totalMarketCap = data.data.total_market_cap[vsCurrency] ?? 0;
  const totalVolume = data.data.total_volume[vsCurrency] ?? 0;

  return {
    marketCap: totalMarketCap,
    marketCapChangePct24h:
      data.data.market_cap_change_percentage_24h_usd ?? 0,
    volume24h: totalVolume,
  };
}

function toMarketCoin(coin: CoingeckoMarketCoin): MarketCoin {
  return {
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol.toUpperCase(),
    image: coin.image,
    rank: coin.market_cap_rank,
    price: coin.current_price,
    marketCap: coin.market_cap,
    volume24h: coin.total_volume,
    circulation: coin.circulating_supply,
    maxSupply: coin.max_supply,
    priceChange24h: coin.price_change_24h,
    priceChangePct24h: coin.price_change_percentage_24h,
    priceChangePct7d: coin.price_change_percentage_7d_in_currency,
    priceChangePct1h: coin.price_change_percentage_1h_in_currency,
    sparkline7d: coin.sparkline_in_7d?.price ?? [],
  };
}

function sortMarketCoins(
  coins: MarketCoin[],
  key: MarketSortKey,
  order: SortOrder
) {
  return [...coins].sort((a, b) => {
    const multiplier = order === "asc" ? 1 : -1;

    const aValue = getSortValue(a, key);
    const bValue = getSortValue(b, key);

    if (aValue === bValue) return 0;
    if (aValue === undefined || aValue === null) return 1;
    if (bValue === undefined || bValue === null) return -1;

    return aValue > bValue ? multiplier : -multiplier;
  });
}

function getSortValue(coin: MarketCoin, key: MarketSortKey) {
  switch (key) {
    case "market_cap":
      return coin.marketCap;
    case "price":
      return coin.price;
    case "volume":
      return coin.volume24h;
    case "change24h":
      return coin.priceChangePct24h;
    default:
      return 0;
  }
}
