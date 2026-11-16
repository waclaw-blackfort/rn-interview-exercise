import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import { fetchPrices, type PriceMap } from '../market/coingecko';

export const MARKET_IDS = ['bitcoin', 'ethereum', 'solana', 'binancecoin', 'tron'] as const;
const REFRESH_MS = 60_000;

// Prices for the Markets list: loads on mount, refreshes every minute while the app is in front.
export function useMarkets() {
  const [prices, setPrices] = useState<PriceMap>({});
  const [error, setError] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date>();
  const alive = useRef(true);

  const load = useCallback(async () => {
    try {
      const next = await fetchPrices(MARKET_IDS);
      if (!alive.current) return;
      setPrices(next);
      setError(false);
      setUpdatedAt(new Date());
    } catch {
      if (alive.current) setError(true);
    }
  }, []);

  useEffect(() => {
    alive.current = true;
    void load();
    let timer = setInterval(load, REFRESH_MS);
    const sub = AppState.addEventListener('change', (state) => {
      clearInterval(timer);
      if (state === 'active') {
        void load();
        timer = setInterval(load, REFRESH_MS);
      }
    });
    return () => {
      alive.current = false;
      clearInterval(timer);
      sub.remove();
    };
  }, [load]);

  return { prices, error, updatedAt, reload: load };
}
