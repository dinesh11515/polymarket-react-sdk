---
'polymarket-react-sdk': patch
---

Move the shared mutation helper (`usePolymarketMutation`, `UseMutationReturnType`) out of `utils/query.ts` into its own `utils/mutation.ts`. This was only ever consumed by trading/viem hooks, but living in the shared query module caused the root entry's `dist/index.js` build to carry a dead `useMutation` import from `@tanstack/react-query`.
