# Polymarket React SDK

React hooks for building on [Polymarket](https://polymarket.com), powered by [`@polymarket/client`](https://www.npmjs.com/package/@polymarket/client) and [TanStack Query](https://tanstack.com/query).

> **Unofficial SDK.** This project is not affiliated with, endorsed by, or
> sponsored by Polymarket. It builds on the official `@polymarket/client`
> package. Trading features move real funds on Polygon mainnet — use at your
> own risk.

Published as [`polymarket-react-sdk`](https://www.npmjs.com/package/polymarket-react-sdk) from [dinesh11515/polymarket-react-sdk](https://github.com/dinesh11515/polymarket-react-sdk). ESM-only.

## Requirements

- Node.js **24+** (see `.nvmrc`)
- pnpm **10+**

## Install

```bash
pnpm add polymarket-react-sdk@beta @polymarket/client @tanstack/react-query react
```

Wallet-authenticated features also need `viem` and `wagmi`:

```bash
pnpm add viem wagmi
```

## Quick start

```tsx
import {
  PolymarketProvider,
  createPolymarketConfig,
  useMarkets,
} from 'polymarket-react-sdk';

const config = createPolymarketConfig();

export function App() {
  return (
    <PolymarketProvider config={config}>
      <MarketList />
    </PolymarketProvider>
  );
}

function MarketList() {
  const { data, isLoading } = useMarkets({ closed: false, pageSize: 10 });
  if (isLoading) return <p>Loading…</p>;
  const markets = data?.pages.flatMap((page) => page.items) ?? [];
  return (
    <ul>
      {markets.map((market) => (
        <li key={market.id}>{market.question ?? market.slug ?? market.id}</li>
      ))}
    </ul>
  );
}
```

See [`packages/react/README.md`](./packages/react/README.md) for hook reference and [`examples/vite-react`](./examples/vite-react) for a full demo.

## Exports

| Entry | Use case |
|-------|----------|
| `polymarket-react-sdk` | Public read hooks, subscriptions, provider |
| `polymarket-react-sdk/viem` | Wallet auth, trading, account hooks |
| `polymarket-react-sdk/query` | SSR prefetch — query keys and option factories |

## Development

```bash
pnpm install
pnpm build
pnpm test
pnpm dev          # run example app (aliases the SDK to src/)
```

## Changesets

Package changes require a changeset:

```bash
pnpm changeset
```

CI skips the changeset check for PRs that only touch docs, CI, or the example app.

## Publishing

Publishing is **opt-in** and gated on the `ENABLE_NPM_PUBLISH` repository
variable — every trigger (including manual dispatch) is a no-op until it is
set to `true`.

1. Log in to npm with the account linked to your GitHub (`npm login`).
2. Add an `NPM_TOKEN` secret **or** configure npm trusted publishing (OIDC) for `release.yml`.
3. Set the repository variable `ENABLE_NPM_PUBLISH` to `true`.
4. Merge to `main` — the release workflow lints, typechecks, builds, tests,
   then versions and publishes `polymarket-react-sdk` on the `beta` dist-tag.

Manual re-run (still requires `ENABLE_NPM_PUBLISH=true`):

```bash
gh workflow run release.yml
```

## License

MIT — see [LICENSE](./LICENSE).
