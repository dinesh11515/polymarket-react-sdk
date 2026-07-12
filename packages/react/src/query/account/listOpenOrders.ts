import type {
  ListOpenOrdersError,
  OpenOrder,
  Page,
  PublicActions,
  SecureActions,
  SecureClient,
} from '@polymarket/client';
import type { ListOpenOrdersRequest } from '@polymarket/client/actions';
import type {
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { polymarketKeys } from '../keys.js';

type PolymarketSecureClient = SecureClient<PublicActions, SecureActions>;

export type ListOpenOrdersQueryOptions = {
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number | false;
};

export type ListOpenOrdersInfiniteData = {
  pages: Page<OpenOrder[]>[];
  pageParams: Array<OpenOrdersPaginationParam | undefined>;
};

type OpenOrdersPaginationParam = Page<OpenOrder[]>['nextCursor'];

export function listOpenOrdersQueryOptions(
  secureClient: PolymarketSecureClient | undefined,
  parameters: ListOpenOrdersRequest = {},
  options: { query?: ListOpenOrdersQueryOptions } = {},
): UseInfiniteQueryOptions<
  Page<OpenOrder[]>,
  ListOpenOrdersError,
  ListOpenOrdersInfiniteData,
  ReturnType<typeof polymarketKeys.account.openOrders>,
  OpenOrdersPaginationParam | undefined
> {
  const { enabled = true, ...queryOptions } = options.query ?? {};

  return {
    queryKey: polymarketKeys.account.openOrders(parameters),
    initialPageParam: undefined,
    queryFn: async ({ pageParam }) => {
      if (!secureClient) {
        throw new Error('Secure client is required.');
      }

      const paginator = secureClient.listOpenOrders(parameters);
      if (pageParam === undefined) {
        return paginator.firstPage();
      }
      return paginator.from(pageParam).firstPage();
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    ...queryOptions,
    enabled: secureClient !== undefined && enabled,
  };
}

export type ListOpenOrdersQueryResult = UseInfiniteQueryResult<
  ListOpenOrdersInfiniteData,
  ListOpenOrdersError
>;
