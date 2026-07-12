import type { ListMarketsError, Market, Page } from '@polymarket/client';
import type { ListMarketsRequest } from '@polymarket/client/actions';
import type {
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import type { PolymarketConfig } from '../../createConfig.js';
import { polymarketKeys } from '../keys.js';

export type ListMarketsQueryOptions = {
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number | false;
};

export type ListMarketsInfiniteData = {
  pages: Page<Market[]>[];
  pageParams: Array<MarketsPaginationParam | undefined>;
};

type MarketsPaginationParam = Page<Market[]>['nextCursor'];

export function listMarketsQueryOptions(
  config: PolymarketConfig,
  parameters: ListMarketsRequest = {},
  options: { query?: ListMarketsQueryOptions } = {},
): UseInfiniteQueryOptions<
  Page<Market[]>,
  ListMarketsError,
  ListMarketsInfiniteData,
  ReturnType<typeof polymarketKeys.discovery.markets>,
  MarketsPaginationParam | undefined
> {
  const { enabled = true, ...queryOptions } = options.query ?? {};

  return {
    queryKey: polymarketKeys.discovery.markets(parameters),
    initialPageParam: undefined,
    queryFn: async ({ pageParam }) => {
      const paginator = config.publicClient.listMarkets(parameters);
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

export type ListMarketsQueryResult = UseInfiniteQueryResult<
  ListMarketsInfiniteData,
  ListMarketsError
>;
