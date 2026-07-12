import type { FetchMarketError, Market } from '@polymarket/client';
import type { FetchMarketRequest } from '@polymarket/client/actions';
import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { PolymarketConfig } from '../../createConfig.js';
import { type MarketQueryKeyInput, polymarketKeys } from '../keys.js';

export type FetchMarketQueryOptions = {
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number | false;
};

export function fetchMarketQueryOptions(
  config: PolymarketConfig,
  parameters: FetchMarketRequest,
  options: { query?: FetchMarketQueryOptions } = {},
): UseQueryOptions<
  Market,
  FetchMarketError,
  Market,
  ReturnType<typeof polymarketKeys.discovery.market>
> {
  const keyInput: MarketQueryKeyInput = {
    id: 'id' in parameters ? parameters.id : undefined,
    slug: 'slug' in parameters ? parameters.slug : undefined,
    url: 'url' in parameters ? parameters.url : undefined,
  };
  const { enabled = true, ...queryOptions } = options.query ?? {};

  return {
    queryKey: polymarketKeys.discovery.market(keyInput),
    queryFn: async () => config.publicClient.fetchMarket(parameters),
    ...queryOptions,
    enabled: hasMarketIdentifier(parameters) && enabled,
  };
}

export type FetchMarketQueryResult = UseQueryResult<Market, FetchMarketError>;

function hasMarketIdentifier(parameters: FetchMarketRequest): boolean {
  return (
    ('id' in parameters && parameters.id !== undefined) ||
    ('slug' in parameters && parameters.slug !== undefined) ||
    ('url' in parameters && parameters.url !== undefined)
  );
}
