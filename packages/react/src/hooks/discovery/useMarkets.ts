'use client';

import type { ListMarketsError } from '@polymarket/client';
import type { ListMarketsRequest } from '@polymarket/client/actions';
import type {
  ListMarketsInfiniteData,
  ListMarketsQueryOptions,
} from '../../query/discovery/listMarkets.js';
import { listMarketsQueryOptions } from '../../query/discovery/listMarkets.js';
import type { UseInfiniteQueryReturnType } from '../../utils/query.js';
import { useInfiniteQuery } from '../../utils/query.js';
import type { UseConfigParameters } from '../useConfig.js';
import { useConfig } from '../useConfig.js';

export type UseMarketsParameters = ListMarketsRequest;

export type UseMarketsOptions = UseConfigParameters & {
  query?: ListMarketsQueryOptions;
};

export type UseMarketsReturnType = UseInfiniteQueryReturnType<
  ListMarketsInfiniteData,
  ListMarketsError
>;

/**
 * Lists markets with infinite pagination.
 *
 * @throws {@link ListMarketsError}
 * Thrown on failure.
 *
 * @example
 * ```ts
 * const { data, fetchNextPage, hasNextPage } = useMarkets({
 *   closed: false,
 *   pageSize: 20,
 * });
 * ```
 */
export function useMarkets(
  parameters: UseMarketsParameters = {},
  options: UseMarketsOptions = {},
): UseMarketsReturnType {
  const config = useConfig(options);
  return useInfiniteQuery(listMarketsQueryOptions(config, parameters, options));
}
