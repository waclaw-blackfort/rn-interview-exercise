import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { WatchedCoin } from './types';

type Props = { coin: WatchedCoin; onRemove: () => void; style?: any };

// One coin on the watchlist: symbol and name, price and 24h change, and a remove button.
export const WatchlistRow = memo(function WatchlistRow({ coin, onRemove, style }: Props) {
  const up = (coin.change24h ?? 0) >= 0;
  return (
    <View style={[styles.row, style]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.symbol}>{coin.symbol.toUpperCase()}</Text>
        <Text style={styles.name}>{coin.name}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.price}>${coin.price?.toFixed(2)}</Text>
        <Text style={{ color: up ? '#3EE0A1' : '#FF5A5F', fontSize: 12 }}>{coin.change24h?.toFixed(2)}%</Text>
      </View>
      <Pressable onPress={onRemove} style={styles.remove}>
        <Text style={{ color: '#888' }}>✕</Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#222' },
  symbol: { color: '#fff', fontSize: 16, fontWeight: '600' },
  name: { color: '#999', fontSize: 12 },
  price: { color: '#fff', fontSize: 16 },
  remove: { width: 24, height: 24, marginLeft: 12, alignItems: 'center', justifyContent: 'center' },
});
