# polymarket-react-sdk

React hooks for building on Polymarket with [TanStack Query](https://tanstack.com/query).

> **Unofficial SDK.** Not affiliated with, endorsed by, or sponsored by
> Polymarket. Built on the official
> [`@polymarket/client`](https://www.npmjs.com/package/@polymarket/client).
> Trading features move real funds on Polygon mainnet — use at your own risk.

> **Beta:** install with the `@beta` tag until stable release. ESM-only.

```bash
pnpm add polymarket-react-sdk@beta @polymarket/client @tanstack/react-query react
```

## Exports

- **`polymarket-react-sdk`** — public read hooks, WebSocket subscriptions, provider
- **`polymarket-react-sdk/viem`** — wallet connect, trading mutations, authenticated account hooks
- **`polymarket-react-sdk/query`** — `polymarketKeys`, query option factories, SSR helpers (no React)

Wallet features require peer deps `viem` and `wagmi`:

```bash
pnpm add viem wagmi
```

## Usage

```tsx
import {
  PolymarketProvider,
  createPolymarketConfig,
  useMarkets,
} from 'polymarket-react-sdk';

const polymarketConfig = createPolymarketConfig();

export function App() {
  return (
    <PolymarketProvider config={polymarketConfig}>
      <MarketList />
    </PolymarketProvider>
  );
}

function MarketList() {
  const { data, fetchNextPage, hasNextPage, isLoading } = useMarkets({
    closed: false,
    pageSize: 10,
  });

  if (isLoading) return <p>Loading…</p>;

  const markets = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <ul>
      {markets.map((market) => (
        <li key={market.id}>{market.question ?? market.slug ?? market.id}</li>
      ))}
      {hasNextPage ? (
        <button type='button' onClick={() => fetchNextPage()}>
          Load more
        </button>
      ) : null}
    </ul>
  );
}
```

## Wallet & trading

Wrap your app with `PolymarketWagmiProvider` (it renders `WagmiProvider` and
`PolymarketProvider` for you), authenticate, then use the trading hooks:

```tsx
import {
  PolymarketWagmiProvider,
  createPolymarketWagmiConfig,
  useConnectPolymarket,
  usePlaceLimitOrder,
} from 'polymarket-react-sdk/viem';
import { createPolymarketConfig } from 'polymarket-react-sdk';

const wagmiConfig = createPolymarketWagmiConfig();
const config = createPolymarketConfig();

export function App() {
  return (
    <PolymarketWagmiProvider wagmiConfig={wagmiConfig} config={config}>
      <Trade />
    </PolymarketWagmiProvider>
  );
}

function Trade() {
  const { connectPolymarket } = useConnectPolymarket();
  const { mutate: placeLimitOrder, data } = usePlaceLimitOrder();

  // Order rejections are IN-BAND: the mutation resolves with
  // `{ ok: false, code, message }` instead of throwing.
  if (data && !data.ok) {
    console.warn(`Rejected (${data.code}): ${data.message}`);
  }

  // render connect button + order form ...
  return null;
}
```

Account hooks (`usePositions`, `useOpenOrders`, `useActivity`,
`usePortfolioValue`) are disabled until authentication completes — no manual
`enabled` wiring needed.

## Realtime invalidation

Pair subscriptions with `polymarketKeys` to keep queries fresh from WebSocket
events instead of polling:

```tsx
import { useSubscription } from 'polymarket-react-sdk';
import { polymarketKeys } from 'polymarket-react-sdk/query';
import { useQueryClient } from '@tanstack/react-query';

function LiveOrderBook({ tokenId }: { tokenId: string }) {
  const queryClient = useQueryClient();

  useSubscription([{ topic: 'market', tokenIds: [tokenId] }], {
    enabled: Boolean(tokenId),
    onEvent: () => {
      void queryClient.invalidateQueries({
        queryKey: polymarketKeys.data.orderBook({ tokenId }),
      });
    },
  });

  // render order book from useOrderBook({ tokenId }) ...
}
```

## SSR

```ts
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import {
  createPolymarketConfig,
  createPolymarketQueryClient,
  fetchMarketQueryOptions,
} from 'polymarket-react-sdk/query';

const config = createPolymarketConfig();
const queryClient = createPolymarketQueryClient();

await queryClient.prefetchQuery(
  fetchMarketQueryOptions(config, { slug: 'example-market' }),
);
```

The `/query` entry has no React imports and the root and `/viem` entries ship
`'use client'` banners, so hooks work out of the box with the Next.js App
Router.

## License

MIT
