import { de } from './de';
import { en, type MessageKey } from './en';

const DICTS: Record<string, Record<MessageKey, string>> = { en, de };

export function locale(): string {
  return Intl.DateTimeFormat().resolvedOptions().locale ?? 'en';
}

export function translate(lang: string, key: MessageKey, vars: Record<string, string | number> = {}): string {
  const dict = DICTS[lang.slice(0, 2)] ?? en;
  return dict[key].replace(/\{\{(\w+)\}\}/g, (_, name: string) => String(vars[name] ?? ''));
}

export function useTranslation() {
  const lang = locale();
  return { t: (key: MessageKey, vars?: Record<string, string | number>) => translate(lang, key, vars), lang };
}

export type { MessageKey };
