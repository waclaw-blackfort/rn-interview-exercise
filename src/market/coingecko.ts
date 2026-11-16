// The app's one CoinGecko client. The free API allows only a few calls a minute, so requests are
// batched (one call for many coins) and answers are cached briefly.
const API = 'https://api.coingecko.com/api/v3';
const CACHE_MS = 30_000;

export type Price = { usd: number; change24h?: number };
export type PriceMap = Record<string, Price>;
export type SearchResult = { id: string; symbol: string; name: string; thumb?: string };

export class HttpError extends Error {
  constructor(readonly status: number, url: string) {
    super(`${url} returned HTTP ${status}`);
  }
}

const cache = new Map<string, { at: number; value: Promise<unknown> }>();

export async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new HttpError(res.status, url);
  return (await res.json()) as T;
}

function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.value as Promise<T>;
  const value = load();
  cache.set(key, { at: Date.now(), value });
  value.catch(() => cache.delete(key));
  return value;
}

export function clearCache() {
  cache.clear();
}

type SimplePriceResponse = Record<string, { usd?: number; usd_24h_change?: number }>;

// Prices for many coins in one request.
export function fetchPrices(ids: readonly string[]): Promise<PriceMap> {
  if (ids.length === 0) return Promise.resolve({});
  const list = [...new Set(ids)].sort().join(',');
  return cached(`prices:${list}`, async () => {
    const body = await getJson<SimplePriceResponse>(`${API}/simple/price?ids=${encodeURIComponent(list)}&vs_currencies=usd&include_24hr_change=true`);
    return parsePrices(body);
  });
}

export function parsePrices(body: SimplePriceResponse): PriceMap {
  const out: PriceMap = {};
  for (const [id, p] of Object.entries(body)) {
    if (typeof p?.usd === 'number') out[id] = { usd: p.usd, change24h: p.usd_24h_change };
  }
  return out;
}
