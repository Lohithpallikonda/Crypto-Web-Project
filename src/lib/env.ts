const DEFAULT_COINGECKO_URL = "https://api.coingecko.com/api/v3";

const publicBaseUrl = process.env.NEXT_PUBLIC_COINGECKO_API_BASE_URL;
const serverBaseUrl = process.env.COINGECKO_API_BASE_URL;
const apiKey = process.env.COINGECKO_API_KEY ?? process.env.NEXT_PUBLIC_COINGECKO_API_KEY;

export const env = {
  coingeckoApiBaseUrl: serverBaseUrl ?? publicBaseUrl ?? DEFAULT_COINGECKO_URL,
  coingeckoApiKey: apiKey,
};

export const getCoingeckoHeaders = (includeApiKey = true) =>
  includeApiKey && env.coingeckoApiKey
    ? {
        "x-cg-pro-api-key": env.coingeckoApiKey,
      }
    : undefined;
