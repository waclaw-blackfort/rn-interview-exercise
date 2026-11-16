import { afterEach, describe, expect, it, vi } from 'vitest';

import { clearCache, fetchPrices, HttpError, parsePrices } from './coingecko';

afterEach(() => {
  clearCache();
  vi.restoreAllMocks();
});

describe('parsePrices', () => {
  it('keeps coins with a price and drops the rest', () => {
    expect(parsePrices({ bitcoin: { usd: 1, usd_24h_change: 2 }, nope: {} })).toEqual({ bitcoin: { usd: 1, change24h: 2 } });
  });
});

describe('fetchPrices', () => {
  it('asks once for many coins and caches the answer', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ bitcoin: { usd: 5 } }) });
    vi.stubGlobal('fetch', fetchMock);
    await fetchPrices(['ethereum', 'bitcoin']);
    await fetchPrices(['bitcoin', 'ethereum']);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain('ids=bitcoin%2Cethereum');
  });
  it('throws on a non-2xx answer', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 429 }));
    await expect(fetchPrices(['bitcoin'])).rejects.toBeInstanceOf(HttpError);
  });
});
