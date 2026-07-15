# polymarket-react-sdk

## 0.1.0

### Patch Changes

- ae47deb: Initial public beta: read hooks (markets, events, order books, prices,
  search), realtime WebSocket subscriptions, wallet auth + trading mutations via
  viem/wagmi, and SSR-safe query option factories — plus pre-release hardening:

  - `enabled` guards in query option factories can no longer be bypassed by
    user-supplied `query.enabled` — the guard is now ANDed with it in every
    factory (identifier guards, secure-client guards, search/prices guards).
  - Order book and price queries default to `staleTime: 5_000` (overridable).
  - Subscriptions: an `error` status is no longer overwritten by `closed`;
    `latestEvent` resets on resubscribe; spec keys are order-insensitive.
  - `/viem` entry now imports `wagmi/actions` instead of the undeclared
    `@wagmi/core` (fixes strict pnpm / Yarn PnP installs).
  - Root and `/viem` bundles ship `'use client'` banners for the Next.js App
    Router.
  - `invalidateAfterOrderCancellation` skips invalidation when the response
    reports zero canceled orders.
  - `createPolymarketWagmiConfig` drops the unused `appName` parameter and
    always enables EIP-6963 injected-wallet discovery.
  - Package metadata: LICENSE and CHANGELOG shipped in the tarball, `engines`
    restriction removed for consumers on older Node versions.

- 8a8046f: Exit changesets prerelease mode and publish to the `latest` dist-tag (`0.1.0`) so the package is searchable on npm. Install no longer requires the `@beta` tag.
- 677313d: Move the shared mutation helper (`usePolymarketMutation`, `UseMutationReturnType`) out of `utils/query.ts` into its own `utils/mutation.ts`. This was only ever consumed by trading/viem hooks, but living in the shared query module caused the root entry's `dist/index.js` build to carry a dead `useMutation` import from `@tanstack/react-query`.

## 0.1.0-beta.2

### Patch Changes

- 677313d: Move the shared mutation helper (`usePolymarketMutation`, `UseMutationReturnType`) out of `utils/query.ts` into its own `utils/mutation.ts`. This was only ever consumed by trading/viem hooks, but living in the shared query module caused the root entry's `dist/index.js` build to carry a dead `useMutation` import from `@tanstack/react-query`.

## 0.1.0-beta.1

### Patch Changes

- ae47deb: Initial public beta: read hooks (markets, events, order books, prices,
  search), realtime WebSocket subscriptions, wallet auth + trading mutations via
  viem/wagmi, and SSR-safe query option factories — plus pre-release hardening:

  - `enabled` guards in query option factories can no longer be bypassed by
    user-supplied `query.enabled` — the guard is now ANDed with it in every
    factory (identifier guards, secure-client guards, search/prices guards).
  - Order book and price queries default to `staleTime: 5_000` (overridable).
  - Subscriptions: an `error` status is no longer overwritten by `closed`;
    `latestEvent` resets on resubscribe; spec keys are order-insensitive.
  - `/viem` entry now imports `wagmi/actions` instead of the undeclared
    `@wagmi/core` (fixes strict pnpm / Yarn PnP installs).
  - Root and `/viem` bundles ship `'use client'` banners for the Next.js App
    Router.
  - `invalidateAfterOrderCancellation` skips invalidation when the response
    reports zero canceled orders.
  - `createPolymarketWagmiConfig` drops the unused `appName` parameter and
    always enables EIP-6963 injected-wallet discovery.
  - Package metadata: LICENSE and CHANGELOG shipped in the tarball, `engines`
    restriction removed for consumers on older Node versions.

## 0.1.0-beta.0

### Minor Changes

- Initial beta release with public read hooks, viem wallet integration, trading mutations, WebSocket subscriptions, and SSR query exports.
