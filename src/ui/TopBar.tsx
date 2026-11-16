import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTranslation } from '../i18n';
import { useTheme } from '../theme';

export function TopBar({ title, onBack }: { title: string; onBack?: () => void }) {
  const c = useTheme();
  const { t } = useTranslation();
  return (
    <View style={styles.bar}>
      {onBack && (
        <Pressable accessibilityRole="button" accessibilityLabel={t('common.back')} onPress={onBack} style={styles.back}>
          <Text style={{ color: c.text, fontSize: 22 }}>‹</Text>
        </Pressable>
      )}
      <Text accessibilityRole="header" style={[styles.title, { color: c.text }]}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, minHeight: 52 },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '600', marginLeft: 8 },
});
