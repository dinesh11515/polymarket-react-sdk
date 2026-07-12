'use client';

import type { FetchPriceError } from '@polymarket/client';
import type { FetchPriceRequest } from '@polymarket/client/actions';
import type { FetchPriceQueryOptions } from '../../query/data/fetchPrice.js';
import { fetchPriceQueryOptions } from '../../query/data/fetchPrice.js';
import type { UseQueryReturnType } from '../../utils/query.js';
import { useQuery } from '../../utils/query.js';
import type { UseConfigParameters } from '../useConfig.js';
import { useConfig } from '../useConfig.js';

export type UsePriceParameters = FetchPriceRequest;

export type UsePriceOptions = UseConfigParameters & {
  query?: FetchPriceQueryOptions;
};

export type UsePriceReturnType = UseQueryReturnType<string, FetchPriceError>;

/**
 * Fetches the current quoted price for a token and side.
 *
 * @throws {@link FetchPriceError}
 * Thrown on failure.
 *
 * @example
 * ```ts
 * const { data: price } = usePrice({
 *   tokenId: '123',
 *   side: OrderSide.BUY,
 * });
 * ```
 */
export function usePrice(
  parameters: UsePriceParameters,
  options: UsePriceOptions = {},
): UsePriceReturnType {
  const config = useConfig(options);
  return useQuery(fetchPriceQueryOptions(config, parameters, options));
}
