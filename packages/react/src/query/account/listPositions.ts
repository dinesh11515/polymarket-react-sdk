import type {
  ListPositionsError,
  Page,
  Position,
  PublicActions,
  SecureActions,
  SecureClient,
  SecureListPositionsRequest,
} from '@polymarket/client';
import type {
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { polymarketKeys } from '../keys.js';

type PolymarketSecureClient = SecureClient<PublicActions, SecureActions>;

export type ListPositionsQueryOptions = {
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number | false;
};

export type ListPositionsInfiniteData = {
  pages: Page<Position[]>[];
  pageParams: Array<PositionsPaginationParam | undefined>;
};

type PositionsPaginationParam = Page<Position[]>['nextCursor'];

export function listPositionsQueryOptions(
  secureClient: PolymarketSecureClient | undefined,
  parameters: SecureListPositionsRequest = {},
  options: { query?: ListPositionsQueryOptions } = {},
): UseInfiniteQueryOptions<
  Page<Position[]>,
  ListPositionsError,
  ListPositionsInfiniteData,
  ReturnType<typeof polymarketKeys.account.positions>,
  PositionsPaginationParam | undefined
> {
  const { enabled = true, ...queryOptions } = options.query ?? {};

  return {
    queryKey: polymarketKeys.account.positions(parameters),
    initialPageParam: undefined,
    queryFn: async ({ pageParam }) => {
      if (!secureClient) {
        throw new Error('Secure client is required.');
      }

      const paginator = secureClient.listPositions(parameters);
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

export type ListPositionsQueryResult = UseInfiniteQueryResult<
  ListPositionsInfiniteData,
  ListPositionsError
>;
