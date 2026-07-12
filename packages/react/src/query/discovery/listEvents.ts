import type { Event, ListEventsError, Page } from '@polymarket/client';
import type { ListEventsRequest } from '@polymarket/client/actions';
import type {
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import type { PolymarketConfig } from '../../createConfig.js';
import { polymarketKeys } from '../keys.js';

export type ListEventsQueryOptions = {
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number | false;
};

export type ListEventsInfiniteData = {
  pages: Page<Event[]>[];
  pageParams: Array<EventsPaginationParam | undefined>;
};

type EventsPaginationParam = Page<Event[]>['nextCursor'];

export function listEventsQueryOptions(
  config: PolymarketConfig,
  parameters: ListEventsRequest = {},
  options: { query?: ListEventsQueryOptions } = {},
): UseInfiniteQueryOptions<
  Page<Event[]>,
  ListEventsError,
  ListEventsInfiniteData,
  ReturnType<typeof polymarketKeys.discovery.events>,
  EventsPaginationParam | undefined
> {
  const { enabled = true, ...queryOptions } = options.query ?? {};

  return {
    queryKey: polymarketKeys.discovery.events(parameters),
    initialPageParam: undefined,
    queryFn: async ({ pageParam }) => {
      const paginator = config.publicClient.listEvents(parameters);
      if (pageParam === undefined) {
        return paginator.firstPage();
      }
      return paginator.from(pageParam).firstPage();
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    ...queryOptions,
    enabled,
  };
}

export type ListEventsQueryResult = UseInfiniteQueryResult<
  ListEventsInfiniteData,
  ListEventsError
>;
