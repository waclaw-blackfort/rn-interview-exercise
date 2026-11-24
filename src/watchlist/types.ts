// A coin the person follows on the watchlist (not a coin they hold).
export type WatchedCoin = {
  id: string;
  symbol: string;
  name: string;
  price?: number;
  change24h?: number;
};
