'use client';

import type { ListEventsError } from '@polymarket/client';
import type { ListEventsRequest } from '@polymarket/client/actions';
import type {
  ListEventsInfiniteData,
  ListEventsQueryOptions,
} from '../../query/discovery/listEvents.js';
import { listEventsQueryOptions } from '../../query/discovery/listEvents.js';
import type { UseInfiniteQueryReturnType } from '../../utils/query.js';
import { useInfiniteQuery } from '../../utils/query.js';
import type { UseConfigParameters } from '../useConfig.js';
import { useConfig } from '../useConfig.js';

export type UseEventsParameters = ListEventsRequest;

export type UseEventsOptions = UseConfigParameters & {
  query?: ListEventsQueryOptions;
};

export type UseEventsReturnType = UseInfiniteQueryReturnType<
  ListEventsInfiniteData,
  ListEventsError
>;

/**
 * Lists events with infinite pagination.
 *
 * @throws {@link ListEventsError}
 * Thrown on failure.
 *
 * @example
 * ```ts
 * const { data, fetchNextPage, hasNextPage } = useEvents({
 *   closed: false,
 *   pageSize: 20,
 * });
 * ```
 */
export function useEvents(
  parameters: UseEventsParameters = {},
  options: UseEventsOptions = {},
): UseEventsReturnType {
  const config = useConfig(options);
  return useInfiniteQuery(listEventsQueryOptions(config, parameters, options));
}
