import { describe, expect, it } from 'vitest';

import { de } from './de';
import { en } from './en';
import { translate } from './index';

describe('i18n', () => {
  it('has every English key in German', () => {
    expect(Object.keys(de).sort()).toEqual(Object.keys(en).sort());
  });
  it('fills in variables and falls back to English', () => {
    expect(translate('de-DE', 'home.updated', { time: '10:00' })).toBe('Aktualisiert 10:00');
    expect(translate('fr', 'home.title')).toBe('Markets');
  });
});
