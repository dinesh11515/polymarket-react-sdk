import type { Event, FetchEventError } from '@polymarket/client';
import type { FetchEventRequest } from '@polymarket/client/actions';
import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { PolymarketConfig } from '../../createConfig.js';
import { type EventQueryKeyInput, polymarketKeys } from '../keys.js';

export type FetchEventQueryOptions = {
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number | false;
};

export function fetchEventQueryOptions(
  config: PolymarketConfig,
  parameters: FetchEventRequest,
  options: { query?: FetchEventQueryOptions } = {},
): UseQueryOptions<
  Event,
  FetchEventError,
  Event,
  ReturnType<typeof polymarketKeys.discovery.event>
> {
  const keyInput: EventQueryKeyInput = {
    id: 'id' in parameters ? parameters.id : undefined,
    slug: 'slug' in parameters ? parameters.slug : undefined,
    url: 'url' in parameters ? parameters.url : undefined,
  };
  const { enabled = true, ...queryOptions } = options.query ?? {};

  return {
    queryKey: polymarketKeys.discovery.event(keyInput),
    queryFn: async () => config.publicClient.fetchEvent(parameters),
    ...queryOptions,
    enabled: hasEventIdentifier(parameters) && enabled,
  };
}

export type FetchEventQueryResult = UseQueryResult<Event, FetchEventError>;

function hasEventIdentifier(parameters: FetchEventRequest): boolean {
  return (
    ('id' in parameters && parameters.id !== undefined) ||
    ('slug' in parameters && parameters.slug !== undefined) ||
    ('url' in parameters && parameters.url !== undefined)
  );
}
