import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { fetchPrice } from './api';
import type { WatchedCoin } from './types';

const STORAGE_KEY = 'watchlist';
const REFRESH_MS = 5000;

// The watchlist: the coins the person follows, saved on this phone, with live prices that
// refresh every few seconds and again when the app comes back to the front.
export function useWatchlist() {
  const [coins, setCoins] = useState<WatchedCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>();

  // Load the saved list.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      setCoins(JSON.parse(raw!) || []);
    });
  }, []);

  // Save whenever the list changes.
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(coins));
  });

  const refresh = async () => {
    const updated = await Promise.all(
      coins.map(async (coin) => {
        const data = await fetchPrice(coin.id);
        coin.price = data.usd;
        coin.change24h = data.usd_24h_change;
        return coin;
      }),
    );
    setCoins((prev) => prev.map((c) => updated.find((u) => u.id === c.id) ?? c));
    setLoading(false);
    setLastUpdated(new Date());
  };

  // Keep prices live.
  useEffect(() => {
    refresh();
    setInterval(refresh, REFRESH_MS);
    AppState.addEventListener('change', (state) => {
      if (state === 'active') refresh();
    });
  }, []);

  const addCoin = (coin: WatchedCoin) => {
    coins.push(coin);
    setCoins(coins);
  };

  const removeCoin = (id: string) => {
    setCoins(coins.filter((c) => c.id !== id));
  };

  return { coins, loading, lastUpdated, refresh, addCoin, removeCoin };
}
