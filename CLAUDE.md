# CLAUDE.md

Guidance for Claude Code and other AI agents working in this repository.

## Project overview

`polymarket-react-sdk` is an unofficial React hooks SDK for Polymarket, built on
`@polymarket/client` (official Polymarket client, peer dep) and TanStack Query v5.
It ships read hooks (markets, events, order books, prices, search), realtime
WebSocket subscriptions, wallet auth + trading mutations via viem/wagmi, and
SSR-safe query option factories. Published unscoped to npm on the `beta` dist-tag
from `packages/react`.

## Monorepo layout

- `packages/react` — the published package (`polymarket-react-sdk@0.1.0-beta.x`)
- `examples/vite-react` — demo app; aliases the SDK to `src/` via `vite.config.ts`
- Workspace: pnpm (`packages/*`, `examples/*`), Node 24 (`.nvmrc`), pnpm 10

## Architecture

- `src/query/*` — framework-light query option factories (`*QueryOptions`) that
  own query keys, `queryFn`, pagination (`initialPageParam`/`getNextPageParam`),
  and `enabled` guards. No React imports here; usable in SSR.
- `src/hooks/*` — thin wrappers: resolve config/secure client, call the matching
  `src/query/*` factory, pass through to TanStack Query. Keep logic in `query/*`,
  not in hooks.
- `src/viem/*` — the ONLY place `viem`, `wagmi` (incl. `wagmi/actions`,
  `wagmi/connectors`), and `@polymarket/client/viem` may be imported (enforced
  by a Biome `noRestrictedImports` override in `biome.json`). Never import
  `@wagmi/core` — it is not a declared dependency; use `wagmi/actions`. Holds
  `PolymarketWagmiProvider`, secure-client lifecycle, and connection hooks.
  `src/viem/types.ts` may use type-only wagmi imports.
- `src/subscriptions/*` — `runSubscriptionLoop` (async-iterable consumption with
  AbortSignal teardown) + `useSubscriptionCore` (useEffect lifecycle, resubscribes
  when the JSON-serialized spec changes). Public/secure subscription hooks wrap it.
- `src/query/keys.ts` — `polymarketKeys` factory. Prefix keys (`openOrdersAll`,
  `positionsAll`, …) exist for invalidation; parameterized keys extend them.
  Invalidation helpers live in `src/utils/invalidateAccountQueries.ts`.

## Export entrypoints (packages/react/src/exports/)

| Entry | File | Use |
|---|---|---|
| `polymarket-react-sdk` | `exports/index.ts` | Public read hooks, `useSubscription`, `PolymarketProvider` — no wallet needed |
| `polymarket-react-sdk/viem` | `exports/viem.ts` | Wallet auth, trading mutations, account hooks, `useSecureSubscription` |
| `polymarket-react-sdk/query` | `exports/query.ts` | SSR prefetch: `polymarketKeys`, `*QueryOptions` factories, invalidation helpers — no React |

Never import viem/wagmi-dependent code from the root entry. Anything requiring the
secure client (trading, positions, open orders, activity, portfolio) is exported
only from `/viem`.

## Key conventions

- Request types come from `@polymarket/client/actions`; response/error types from
  `@polymarket/client`. Follow existing imports when adding a hook.
- `OrderResponse.ok === false` is an in-band failure — mutations resolve
  successfully with it; do not throw. `invalidateAfterOrderPlacement` already
  checks `.ok` before invalidating.
- TanStack Query v5 only: `onSuccess` callbacks take 4 args
  `(data, variables, onMutateResult, context)` — preserve user callbacks when
  wrapping (see `usePlaceLimitOrder`).
- Every public hook exports `Use<X>Parameters`, `Use<X>Options`,
  `Use<X>ReturnType` and has JSDoc with `@example`. Hooks are
  `'use client'`-marked; query factories are not.
- Lint/format is Biome only (no eslint/prettier): `pnpm lint`, `pnpm lint:fix`.
  Single quotes, organized imports. Internal imports use `.js` extensions
  (ESM, moduleResolution Bundler).
- Build is tsup, ESM-only, three entries, everything peer-external
  (`tsup.config.ts`), `sideEffects: false`. The root and `/viem` entries get a
  `'use client'` banner at build time (bundling strips source directives);
  `/query` must stay server-safe — no banner, no React. Adding a runtime dep
  requires updating externals + peerDependencies deliberately.
- A changeset (`pnpm changeset`) is REQUIRED for any PR touching
  `packages/react/**` — CI enforces it. Repo is in changesets pre-release mode
  (`beta` tag, `.changeset/pre.json`).

## Commands

```bash
pnpm install          # Node 24 + pnpm 10 required
pnpm build            # tsup build of packages/react + example
pnpm test             # vitest, project "react" (jsdom + typecheck of *.test-d.ts)
pnpm lint / lint:fix  # biome check
pnpm typecheck        # tsc --noEmit across workspace
pnpm dev              # run example app (vite aliases the SDK to src/)
pnpm changeset        # add a changeset (required for package changes)
```

## Hard rules

- Do NOT commit or push unless explicitly asked.
- Do NOT rename the package back to `@polymarket/react` or any `@polymarket/*`
  scope — it is intentionally unscoped (`polymarket-react-sdk`).
- Publishing is gated on the `ENABLE_NPM_PUBLISH` repo variable
  (`.github/workflows/release.yml`); never attempt to publish manually.
- Trading hooks move real funds on Polygon mainnet — never loosen guards
  (`requireSecureClient`, `enabled` checks) or auto-execute order flows in
  examples/tests.
