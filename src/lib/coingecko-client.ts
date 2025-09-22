import { env, getCoingeckoHeaders } from "./env";

type Primitive = string | number | boolean | null | undefined;

type QueryValue = Primitive | Primitive[];

export type QueryParams = Record<string, QueryValue>;

const createQueryString = (params?: QueryParams) => {
  if (!params) return "";

  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v !== undefined && v !== null) {
          search.append(key, String(v));
        }
      });
      return;
    }
    search.set(key, String(value));
  });

  const qs = search.toString();
  return qs ? `?${qs}` : "";
};

export interface CoingeckoRequestOptions extends RequestInit {
  query?: QueryParams;
}

export async function coingeckoFetch<TResponse>(
  path: string,
  { query, headers, cache = "no-store", ...init }: CoingeckoRequestOptions = {}
): Promise<TResponse> {
  const isServer = typeof window === "undefined";
  const baseUrl = isServer ? env.coingeckoApiBaseUrl : "/api/coingecko";
  const url = `${baseUrl}${path}${createQueryString(query)}`;

  const response = await fetch(url, {
    ...init,
    headers: {
      accept: "application/json",
      ...(isServer ? getCoingeckoHeaders() : undefined),
      ...headers,
    },
    cache,
  });

  if (!response.ok) {
    const message = await safeParseError(response);
    throw new Error(
      `CoinGecko request failed: ${response.status} ${response.statusText} - ${message}`
    );
  }

  return (await response.json()) as TResponse;
}

async function safeParseError(response: Response) {
  try {
    const data = await response.json();
    if (typeof data === "string") return data;
    if (data && typeof data === "object") {
      return JSON.stringify(data);
    }
    return "unknown error";
  } catch (error) {
    return (error as Error).message;
  }
}
