'use client';

import type { Event, FetchEventError } from '@polymarket/client';
import type { FetchEventRequest } from '@polymarket/client/actions';
import type { FetchEventQueryOptions } from '../../query/discovery/fetchEvent.js';
import { fetchEventQueryOptions } from '../../query/discovery/fetchEvent.js';
import type { UseQueryReturnType } from '../../utils/query.js';
import { useQuery } from '../../utils/query.js';
import type { UseConfigParameters } from '../useConfig.js';
import { useConfig } from '../useConfig.js';

export type UseEventParameters = FetchEventRequest;

export type UseEventOptions = UseConfigParameters & {
  query?: FetchEventQueryOptions;
};

export type UseEventReturnType = UseQueryReturnType<Event, FetchEventError>;

/**
 * Fetches a single event by id, slug, or Polymarket URL.
 *
 * @throws {@link FetchEventError}
 * Thrown on failure.
 *
 * @example
 * ```ts
 * const { data: event } = useEvent({ slug: 'example-event' });
 * ```
 */
export function useEvent(
  parameters: UseEventParameters,
  options: UseEventOptions = {},
): UseEventReturnType {
  const config = useConfig(options);
  return useQuery(fetchEventQueryOptions(config, parameters, options));
}
