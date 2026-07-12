import type {
  Activity,
  ListActivityError,
  Page,
  PublicActions,
  SecureActions,
  SecureClient,
  SecureListActivityRequest,
} from '@polymarket/client';
import type {
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { polymarketKeys } from '../keys.js';

type PolymarketSecureClient = SecureClient<PublicActions, SecureActions>;

export type ListActivityQueryOptions = {
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number | false;
};

export type ListActivityInfiniteData = {
  pages: Page<Activity[]>[];
  pageParams: Array<ActivityPaginationParam | undefined>;
};

type ActivityPaginationParam = Page<Activity[]>['nextCursor'];

export function listActivityQueryOptions(
  secureClient: PolymarketSecureClient | undefined,
  parameters: SecureListActivityRequest = {},
  options: { query?: ListActivityQueryOptions } = {},
): UseInfiniteQueryOptions<
  Page<Activity[]>,
  ListActivityError,
  ListActivityInfiniteData,
  ReturnType<typeof polymarketKeys.account.activity>,
  ActivityPaginationParam | undefined
> {
  const { enabled = true, ...queryOptions } = options.query ?? {};

  return {
    queryKey: polymarketKeys.account.activity(parameters),
    initialPageParam: undefined,
    queryFn: async ({ pageParam }) => {
      if (!secureClient) {
        throw new Error('Secure client is required.');
      }

      const paginator = secureClient.listActivity(parameters);
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

export type ListActivityQueryResult = UseInfiniteQueryResult<
  ListActivityInfiniteData,
  ListActivityError
>;
