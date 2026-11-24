import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Screen } from '../ui/Screen';
import { TopBar } from '../ui/TopBar';
import { searchCoins } from './api';
import { useWatchlist } from './useWatchlist';
import { WatchlistRow } from './WatchlistRow';

// Markets > Watchlist: follow coins you don't hold. Search CoinGecko to add one, sort by name or
// 24h change, and remove a coin with the X.
export function WatchlistScreen({ onBack }: { onBack: () => void }) {
  const { coins, loading, lastUpdated, refresh, addCoin, removeCoin } = useWatchlist();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'change'>('name');
  const [sorted, setSorted] = useState(coins);

  useEffect(() => {
    if (query.length < 2) return;
    searchCoins(query).then(setResults);
  }, [query]);

  // Keep the sorted copy in step with the list.
  useEffect(() => {
    setSorted(coins.sort((a, b) => (sortBy === 'name' ? a.name.localeCompare(b.name) : b.change24h! - a.change24h!)));
  }, [coins, sortBy]);

  return (
    <Screen>
      <TopBar onBack={onBack} title="Watchlist" />
      <View style={styles.searchBox}>
        <TextInput value={query} onChangeText={setQuery} placeholder="Search coins" placeholderTextColor="#777" style={styles.input} />
      </View>
      <ScrollView>
        {results.map((r) => (
          <Pressable
            onPress={() => {
              addCoin({ id: r.id, symbol: r.symbol, name: r.name });
              setQuery('');
              setResults([]);
              refresh();
            }}
            style={styles.result}
          >
            <Text style={styles.resultText}>
              {r.name} ({r.symbol})
            </Text>
          </Pressable>
        ))}

        <View style={styles.sortRow}>
          <Text onPress={() => setSortBy('name')} style={[styles.sort, sortBy === 'name' && styles.sortOn]}>
            Name
          </Text>
          <Text onPress={() => setSortBy('change')} style={[styles.sort, sortBy === 'change' && styles.sortOn]}>
            24h change
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator />
        ) : (
          sorted.map((coin, index) => (
            <WatchlistRow
              key={index}
              coin={coin}
              style={{ marginHorizontal: 16 }}
              onRemove={() => {
                Alert.alert('Remove coin', `Remove ${coin.name} from your watchlist?`, [
                  { text: 'Cancel' },
                  { text: 'Remove', style: 'destructive', onPress: () => removeCoin(coin.id) },
                ]);
              }}
            />
          ))
        )}
        {!loading && coins.length === 0 && <Text style={styles.empty}>Your watchlist is empty. Search for a coin to add it.</Text>}
        {lastUpdated && <Text style={styles.updated}>Updated {lastUpdated.toLocaleTimeString()}</Text>}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchBox: { paddingHorizontal: 16, paddingVertical: 8 },
  input: { backgroundColor: '#1a1a1a', color: '#fff', borderRadius: 12, paddingHorizontal: 14, height: 44, fontSize: 16 },
  result: { paddingHorizontal: 16, paddingVertical: 12 },
  resultText: { color: '#fff', fontSize: 16 },
  sortRow: { flexDirection: 'row', gap: 16, paddingHorizontal: 16, paddingVertical: 8 },
  sort: { color: '#777', fontSize: 14 },
  sortOn: { color: '#fff', fontWeight: '600' },
  empty: { color: '#999', textAlign: 'center', marginTop: 40, paddingHorizontal: 32 },
  updated: { color: '#666', fontSize: 12, textAlign: 'center', marginVertical: 16 },
});
