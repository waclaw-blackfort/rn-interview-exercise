import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

import { HomeScreen } from './src/home/HomeScreen';
import { WatchlistScreen } from './src/watchlist/WatchlistScreen';

type Page = 'home' | 'watchlist';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  return (
    <>
      <StatusBar style="auto" />
      {page === 'watchlist' ? <WatchlistScreen onBack={() => setPage('home')} /> : <HomeScreen onWatchlist={() => setPage('watchlist')} />}
    </>
  );
}
