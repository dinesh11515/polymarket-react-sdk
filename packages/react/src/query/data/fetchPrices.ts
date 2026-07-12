import type { FetchPricesError, Prices } from '@polymarket/client';
import type { FetchPricesRequest } from '@polymarket/client/actions';
import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { PolymarketConfig } from '../../createConfig.js';
import { polymarketKeys } from '../keys.js';

export type FetchPricesQueryOptions = {
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number | false;
};

export function fetchPricesQueryOptions(
  config: PolymarketConfig,
  parameters: FetchPricesRequest,
  options: { query?: FetchPricesQueryOptions } = {},
): UseQueryOptions<
  Prices,
  FetchPricesError,
  Prices,
  ReturnType<typeof polymarketKeys.data.prices>
> {
  const { enabled = true, ...queryOptions } = options.query ?? {};

  return {
    queryKey: polymarketKeys.data.prices(parameters),
    queryFn: async () => config.publicClient.fetchPrices(parameters),
    staleTime: 5_000,
    ...queryOptions,
    enabled: parameters.length > 0 && enabled,
  };
}

export type FetchPricesQueryResult = UseQueryResult<Prices, FetchPricesError>;
