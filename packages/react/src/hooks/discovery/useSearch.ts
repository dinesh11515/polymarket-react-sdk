'use client';

import type { SearchError } from '@polymarket/client';
import type { SearchRequest } from '@polymarket/client/actions';
import type {
  SearchInfiniteData,
  SearchQueryOptions,
} from '../../query/discovery/search.js';
import { searchQueryOptions } from '../../query/discovery/search.js';
import type { UseInfiniteQueryReturnType } from '../../utils/query.js';
import { useInfiniteQuery } from '../../utils/query.js';
import type { UseConfigParameters } from '../useConfig.js';
import { useConfig } from '../useConfig.js';

export type UseSearchParameters = SearchRequest;

export type UseSearchOptions = UseConfigParameters & {
  query?: SearchQueryOptions;
};

export type UseSearchReturnType = UseInfiniteQueryReturnType<
  SearchInfiniteData,
  SearchError
>;

/**
 * Searches Polymarket events, profiles, and tags with infinite pagination.
 *
 * @throws {@link SearchError}
 * Thrown on failure.
 *
 * @example
 * ```ts
 * const { data } = useSearch({ q: 'election', pageSize: 10 });
 * const events = data?.pages.flatMap((page) => page.items.events) ?? [];
 * ```
 */
export function useSearch(
  parameters: UseSearchParameters,
  options: UseSearchOptions = {},
): UseSearchReturnType {
  const config = useConfig(options);
  return useInfiniteQuery(searchQueryOptions(config, parameters, options));
}
