import type { Page, SearchError } from '@polymarket/client';
import type { SearchRequest, SearchResults } from '@polymarket/client/actions';
import type {
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import type { PolymarketConfig } from '../../createConfig.js';
import { polymarketKeys } from '../keys.js';

export type SearchQueryOptions = {
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number | false;
};

export type SearchInfiniteData = {
  pages: Page<SearchResults>[];
  pageParams: Array<SearchPaginationParam | undefined>;
};

type SearchPaginationParam = Page<SearchResults>['nextCursor'];

export function searchQueryOptions(
  config: PolymarketConfig,
  parameters: SearchRequest,
  options: { query?: SearchQueryOptions } = {},
): UseInfiniteQueryOptions<
  Page<SearchResults>,
  SearchError,
  SearchInfiniteData,
  ReturnType<typeof polymarketKeys.discovery.search>,
  SearchPaginationParam | undefined
> {
  const { enabled = true, ...queryOptions } = options.query ?? {};

  return {
    queryKey: polymarketKeys.discovery.search(parameters),
    initialPageParam: undefined,
    queryFn: async ({ pageParam }) => {
      const paginator = config.publicClient.search(parameters);
      if (pageParam === undefined) {
        return paginator.firstPage();
      }
      return paginator.from(pageParam).firstPage();
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    ...queryOptions,
    enabled: Boolean(parameters.q?.trim()) && enabled,
  };
}

export type SearchQueryResult = UseInfiniteQueryResult<
  SearchInfiniteData,
  SearchError
>;
