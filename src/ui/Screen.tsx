import type { ReactNode } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import { useTheme } from '../theme';

export function Screen({ children }: { children: ReactNode }) {
  const c = useTheme();
  return <SafeAreaView style={[styles.screen, { backgroundColor: c.background }]}>{children}</SafeAreaView>;
}

const styles = StyleSheet.create({ screen: { flex: 1 } });
