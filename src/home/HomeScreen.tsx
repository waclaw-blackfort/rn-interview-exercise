import { memo, useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { formatChange, formatPrice } from '../format';
import { locale, useTranslation } from '../i18n';
import type { Price } from '../market/coingecko';
import { useTheme, type Colors } from '../theme';
import { Screen } from '../ui/Screen';
import { TopBar } from '../ui/TopBar';
import { MARKET_IDS, useMarkets } from './useMarkets';

const NAMES: Record<(typeof MARKET_IDS)[number], string> = { bitcoin: 'Bitcoin', ethereum: 'Ethereum', solana: 'Solana', binancecoin: 'BNB', tron: 'TRON' };

export function HomeScreen() {
  const { t } = useTranslation();
  const c = useTheme();
  const { prices, error, updatedAt, reload } = useMarkets();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  }, [reload]);

  return (
    <Screen>
      <TopBar title={t('home.title')} />
      <FlatList
        data={MARKET_IDS}
        keyExtractor={(id) => id}
        renderItem={({ item }) => <MarketRow name={NAMES[item]} price={prices[item]} colors={c} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListFooterComponent={
          <Text style={[styles.footer, { color: c.textMuted }]}>
            {error ? t('home.error') : updatedAt ? t('home.updated', { time: updatedAt.toLocaleTimeString(locale()) }) : ''}
          </Text>
        }
      />
    </Screen>
  );
}

const MarketRow = memo(function MarketRow({ name, price, colors }: { name: string; price?: Price; colors: Colors }) {
  const loc = locale();
  const up = (price?.change24h ?? 0) >= 0;
  const label = `${name}, ${formatPrice(price?.usd, loc)}, ${formatChange(price?.change24h, loc)}`;
  return (
    <View accessible accessibilityLabel={label} style={[styles.row, { borderBottomColor: colors.border }]}>
      <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
      <View style={styles.right}>
        <Text style={[styles.price, { color: colors.text }]}>{formatPrice(price?.usd, loc)}</Text>
        <Text style={[styles.change, { color: up ? colors.up : colors.down }]}>{formatChange(price?.change24h, loc)}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, minHeight: 60, borderBottomWidth: StyleSheet.hairlineWidth },
  name: { flex: 1, fontSize: 16, fontWeight: '600' },
  right: { alignItems: 'flex-end' },
  price: { fontSize: 16 },
  change: { fontSize: 14 },
  footer: { textAlign: 'center', fontSize: 14, marginVertical: 16 },
});
