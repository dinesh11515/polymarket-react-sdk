'use client';

import type { FetchMarketError, Market } from '@polymarket/client';
import type { FetchMarketRequest } from '@polymarket/client/actions';
import type { FetchMarketQueryOptions } from '../../query/discovery/fetchMarket.js';
import { fetchMarketQueryOptions } from '../../query/discovery/fetchMarket.js';
import type { UseQueryReturnType } from '../../utils/query.js';
import { useQuery } from '../../utils/query.js';
import type { UseConfigParameters } from '../useConfig.js';
import { useConfig } from '../useConfig.js';

export type UseMarketParameters = FetchMarketRequest;

export type UseMarketOptions = UseConfigParameters & {
  query?: FetchMarketQueryOptions;
};

export type UseMarketReturnType = UseQueryReturnType<Market, FetchMarketError>;

/**
 * Fetches a single market by id, slug, or Polymarket URL.
 *
 * @throws {@link FetchMarketError}
 * Thrown on failure.
 *
 * @example
 * ```ts
 * const { data: market } = useMarket({ slug: 'example-market' });
 * ```
 */
export function useMarket(
  parameters: UseMarketParameters,
  options: UseMarketOptions = {},
): UseMarketReturnType {
  const config = useConfig(options);
  return useQuery(fetchMarketQueryOptions(config, parameters, options));
}
