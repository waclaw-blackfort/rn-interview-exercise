# Coin Tracker

A small React Native (Expo) app that shows crypto market prices from CoinGecko's public API.

```
npm install
npx expo start
npm test
npm run typecheck
```

## Structure

- `src/market/coingecko.ts`: the CoinGecko client (batched requests, short cache, errors on non-2xx).
- `src/format.ts`: price and percent formatting in the user's currency and locale.
- `src/i18n/`: translations (English, German). Every user-facing string goes through `t()`.
- `src/theme.ts`: light and dark colour tokens (`useTheme()`).
- `src/ui/`: shared building blocks (`Screen`, `TopBar`).
- `src/home/`: the Markets home screen.

## Conventions

- No hard-coded user-facing strings or colours.
- Touch targets at least 44 x 44.
- Every module ships with tests next to it (`*.test.ts`).
