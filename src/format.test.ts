import { describe, expect, it } from 'vitest';

import { formatChange, formatPrice } from './format';

describe('formatPrice', () => {
  it('formats normal and tiny prices', () => {
    expect(formatPrice(64123.456)).toBe('$64,123.46');
    expect(formatPrice(0.00001234)).toBe('$0.00001234');
  });
  it('shows a dash while unknown', () => {
    expect(formatPrice(undefined)).toBe('–');
  });
});

describe('formatChange', () => {
  it('is always signed', () => {
    expect(formatChange(2.1)).toBe('+2.10%');
    expect(formatChange(-0.42)).toBe('-0.42%');
  });
});
