export interface MarketCoin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  rank: number;
  price: number;
  marketCap: number;
  volume24h: number;
  circulation: number;
  maxSupply: number | null;
  priceChange24h: number;
  priceChangePct24h: number;
  priceChangePct7d?: number;
  priceChangePct1h?: number;
  sparkline7d?: number[];
}

export interface HighlightEntry {
  id: string;
  name: string;
  symbol: string;
  price: number;
  changePct24h?: number;
  rank?: number;
  volume24h?: number;
  icon?: string;
}

export interface HighlightGroup {
  title: string;
  items: HighlightEntry[];
  moreHref?: string;
}

export interface GlobalSummary {
  marketCap: number;
  marketCapChangePct24h: number;
  volume24h: number;
}
