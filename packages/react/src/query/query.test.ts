import { describe, expect, it } from 'vitest';
import {
  createPolymarketConfig,
  createPolymarketQueryClient,
  fetchMarketQueryOptions,
  polymarketKeys,
} from '../exports/query.js';

describe('createPolymarketQueryClient', () => {
  it('creates a query client with default stale time', () => {
    const queryClient = createPolymarketQueryClient();
    expect(queryClient.getDefaultOptions().queries?.staleTime).toBe(30_000);
  });
});

describe('fetchMarketQueryOptions', () => {
  it('builds query options for SSR prefetch', () => {
    const config = createPolymarketConfig();
    const options = fetchMarketQueryOptions(config, { slug: 'example-market' });

    expect(options.queryKey).toEqual(
      polymarketKeys.discovery.market({ slug: 'example-market' }),
    );
    expect(options.queryFn).toBeTypeOf('function');
    expect(options.enabled).toBe(true);
  });
});
