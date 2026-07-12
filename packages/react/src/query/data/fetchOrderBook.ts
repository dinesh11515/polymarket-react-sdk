import type { FetchOrderBookError, OrderBook } from '@polymarket/client';
import type { FetchOrderBookRequest } from '@polymarket/client/actions';
import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { PolymarketConfig } from '../../createConfig.js';
import { polymarketKeys } from '../keys.js';

export type FetchOrderBookQueryOptions = {
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number | false;
};

export function fetchOrderBookQueryOptions(
  config: PolymarketConfig,
  parameters: FetchOrderBookRequest,
  options: { query?: FetchOrderBookQueryOptions } = {},
): UseQueryOptions<
  OrderBook,
  FetchOrderBookError,
  OrderBook,
  ReturnType<typeof polymarketKeys.data.orderBook>
> {
  const { enabled = true, ...queryOptions } = options.query ?? {};

  return {
    queryKey: polymarketKeys.data.orderBook({ tokenId: parameters.tokenId }),
    queryFn: async () => config.publicClient.fetchOrderBook(parameters),
    staleTime: 5_000,
    ...queryOptions,
    enabled: Boolean(parameters.tokenId) && enabled,
  };
}

export type FetchOrderBookQueryResult = UseQueryResult<
  OrderBook,
  FetchOrderBookError
>;
