import type { FetchPriceError } from '@polymarket/client';
import type { FetchPriceRequest } from '@polymarket/client/actions';
import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { PolymarketConfig } from '../../createConfig.js';
import { polymarketKeys } from '../keys.js';

export type FetchPriceQueryOptions = {
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number | false;
};

export function fetchPriceQueryOptions(
  config: PolymarketConfig,
  parameters: FetchPriceRequest,
  options: { query?: FetchPriceQueryOptions } = {},
): UseQueryOptions<
  string,
  FetchPriceError,
  string,
  ReturnType<typeof polymarketKeys.data.price>
> {
  const { enabled = true, ...queryOptions } = options.query ?? {};

  return {
    queryKey: polymarketKeys.data.price(parameters),
    queryFn: async () => config.publicClient.fetchPrice(parameters),
    staleTime: 5_000,
    ...queryOptions,
    enabled: Boolean(parameters.tokenId) && enabled,
  };
}

export type FetchPriceQueryResult = UseQueryResult<string, FetchPriceError>;
