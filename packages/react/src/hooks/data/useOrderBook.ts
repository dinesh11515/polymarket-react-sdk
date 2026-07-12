'use client';

import type { FetchOrderBookError, OrderBook } from '@polymarket/client';
import type { FetchOrderBookRequest } from '@polymarket/client/actions';
import type { FetchOrderBookQueryOptions } from '../../query/data/fetchOrderBook.js';
import { fetchOrderBookQueryOptions } from '../../query/data/fetchOrderBook.js';
import type { UseQueryReturnType } from '../../utils/query.js';
import { useQuery } from '../../utils/query.js';
import type { UseConfigParameters } from '../useConfig.js';
import { useConfig } from '../useConfig.js';

export type UseOrderBookParameters = FetchOrderBookRequest;

export type UseOrderBookOptions = UseConfigParameters & {
  query?: FetchOrderBookQueryOptions;
};

export type UseOrderBookReturnType = UseQueryReturnType<
  OrderBook,
  FetchOrderBookError
>;

/**
 * Fetches the order book for a market outcome token.
 *
 * @throws {@link FetchOrderBookError}
 * Thrown on failure.
 *
 * @example
 * ```ts
 * const { data: orderBook } = useOrderBook({ tokenId: '123' });
 * ```
 */
export function useOrderBook(
  parameters: UseOrderBookParameters,
  options: UseOrderBookOptions = {},
): UseOrderBookReturnType {
  const config = useConfig(options);
  return useQuery(fetchOrderBookQueryOptions(config, parameters, options));
}
