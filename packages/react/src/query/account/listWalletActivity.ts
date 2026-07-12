import type { Activity, ListActivityError, Page } from '@polymarket/client';
import type { ListActivityRequest } from '@polymarket/client/actions';
import type {
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import type { PolymarketConfig } from '../../createConfig.js';
import { polymarketKeys } from '../keys.js';

export type ListWalletActivityQueryOptions = {
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number | false;
};

export type ListWalletActivityInfiniteData = {
  pages: Page<Activity[]>[];
  pageParams: Array<WalletActivityPaginationParam | undefined>;
};

type WalletActivityPaginationParam = Page<Activity[]>['nextCursor'];

export function listWalletActivityQueryOptions(
  config: PolymarketConfig,
  parameters: ListActivityRequest,
  options: { query?: ListWalletActivityQueryOptions } = {},
): UseInfiniteQueryOptions<
  Page<Activity[]>,
  ListActivityError,
  ListWalletActivityInfiniteData,
  ReturnType<typeof polymarketKeys.account.walletActivity>,
  WalletActivityPaginationParam | undefined
> {
  const { enabled = true, ...queryOptions } = options.query ?? {};

  return {
    queryKey: polymarketKeys.account.walletActivity(parameters),
    initialPageParam: undefined,
    queryFn: async ({ pageParam }) => {
      const paginator = config.publicClient.listActivity(parameters);
      if (pageParam === undefined) {
        return paginator.firstPage();
      }
      return paginator.from(pageParam).firstPage();
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    ...queryOptions,
    enabled: Boolean(parameters.user) && enabled,
  };
}

export type ListWalletActivityQueryResult = UseInfiniteQueryResult<
  ListWalletActivityInfiniteData,
  ListActivityError
>;
