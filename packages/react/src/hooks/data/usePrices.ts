'use client';

import type { FetchPricesError, Prices } from '@polymarket/client';
import type { FetchPricesRequest } from '@polymarket/client/actions';
import type { FetchPricesQueryOptions } from '../../query/data/fetchPrices.js';
import { fetchPricesQueryOptions } from '../../query/data/fetchPrices.js';
import type { UseQueryReturnType } from '../../utils/query.js';
import { useQuery } from '../../utils/query.js';
import type { UseConfigParameters } from '../useConfig.js';
import { useConfig } from '../useConfig.js';

export type UsePricesParameters = FetchPricesRequest;

export type UsePricesOptions = UseConfigParameters & {
  query?: FetchPricesQueryOptions;
};

export type UsePricesReturnType = UseQueryReturnType<Prices, FetchPricesError>;

/**
 * Fetches quoted prices for multiple tokens.
 *
 * @throws {@link FetchPricesError}
 * Thrown on failure.
 *
 * @example
 * ```ts
 * const { data: prices } = usePrices([
 *   { tokenId: '123', side: OrderSide.BUY },
 *   { tokenId: '456', side: OrderSide.SELL },
 * ]);
 * ```
 */
export function usePrices(
  parameters: UsePricesParameters,
  options: UsePricesOptions = {},
): UsePricesReturnType {
  const config = useConfig(options);
  return useQuery(fetchPricesQueryOptions(config, parameters, options));
}
