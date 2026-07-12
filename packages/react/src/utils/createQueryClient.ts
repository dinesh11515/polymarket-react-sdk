import { QueryClient } from '@tanstack/react-query';

export type CreatePolymarketQueryClientParameters = {
  defaultStaleTime?: number;
};

/**
 * Creates a TanStack Query client with Polymarket defaults.
 *
 * On the server, query retries are disabled for safer prefetch/dehydrate flows.
 */
export function createPolymarketQueryClient(
  parameters: CreatePolymarketQueryClientParameters = {},
): QueryClient {
  const isServer = typeof window === 'undefined';

  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: parameters.defaultStaleTime ?? 30_000,
        retry: isServer ? false : undefined,
      },
    },
  });
}
