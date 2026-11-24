// Live prices and coin search for the watchlist, from CoinGecko's public API.
// Only public market data is requested; nothing about the wallet is sent.
const BASE = 'https://api.coingecko.com/api/v3';

export async function fetchPrice(id: string): Promise<any> {
  const res = await fetch(`${BASE}/simple/price?ids=${id}&vs_currencies=usd&include_24hr_change=true`);
  const json = await res.json();
  return json[id];
}

export async function searchCoins(query: string): Promise<any[]> {
  const res = await fetch(`${BASE}/search?query=${query}`);
  const json = await res.json();
  return json.coins;
}
