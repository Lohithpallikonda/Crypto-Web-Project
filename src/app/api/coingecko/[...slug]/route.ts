import { NextRequest } from "next/server";
import { env, getCoingeckoHeaders } from "@/lib/env";

const DEFAULT_HEADERS = {
  accept: "application/json",
};

const FORWARDED_RESPONSE_HEADERS = [
  "content-type",
  "cache-control",
  "expires",
  "last-modified",
  "etag",
];

const CACHE_TTL_MS = 45 * 1000;
const ERROR_CACHE_TTL_MS = 15 * 1000;

interface CachedResponse {
  createdAt: number;
  ttl: number;
  status: number;
  headers: [string, string][];
  body: ArrayBuffer;
}

const responseCache = new Map<string, CachedResponse>();

function buildTargetUrl(request: NextRequest, slug: string[] = []) {
  const base = env.coingeckoApiBaseUrl;
  const path = slug.length ? `/${slug.join("/")}` : "";
  const search = request.nextUrl.search;
  return `${base}${path}${search}`;
}

function copyResponseHeaders(source: Headers) {
  const headers = new Headers();
  FORWARDED_RESPONSE_HEADERS.forEach((header) => {
    const value = source.get(header);
    if (value) headers.set(header, value);
  });
  return headers;
}

function buildCacheKey(url: string) {
  return url;
}

function fromCached(entry: CachedResponse) {
  return new Response(entry.body.slice(0), {
    status: entry.status,
    headers: new Headers(entry.headers),
  });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug?: string[] }> }
) {
  const { slug } = await context.params;
  const targetUrl = buildTargetUrl(request, slug ?? []);
  const cacheKey = buildCacheKey(targetUrl);

  const cached = responseCache.get(cacheKey);
  if (cached && Date.now() - cached.createdAt <= cached.ttl) {
    return fromCached(cached);
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        ...DEFAULT_HEADERS,
        ...getCoingeckoHeaders(),
      },
      cache: "no-store",
    });

    const headers = copyResponseHeaders(response.headers);
    const body = await response.arrayBuffer();

    if (!response.ok) {
      headers.set("content-type", "application/json");

      responseCache.set(cacheKey, {
        createdAt: Date.now(),
        ttl: ERROR_CACHE_TTL_MS,
        status: response.status,
        headers: Array.from(headers.entries()),
        body,
      });

      return new Response(
        JSON.stringify({
          status: response.status,
          statusText: response.statusText,
          error: new TextDecoder().decode(body),
        }),
        {
          status: response.status,
          headers,
        }
      );
    }

    responseCache.set(cacheKey, {
      createdAt: Date.now(),
      ttl: CACHE_TTL_MS,
      status: response.status,
      headers: Array.from(headers.entries()),
      body,
    });

    return new Response(body.slice(0), {
      status: response.status,
      headers,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: 502,
        error: (error as Error).message,
        targetUrl,
      }),
      {
        status: 502,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }
}
