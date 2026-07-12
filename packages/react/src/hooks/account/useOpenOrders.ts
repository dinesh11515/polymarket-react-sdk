'use client';

import type { ListOpenOrdersError } from '@polymarket/client';
import type { ListOpenOrdersRequest } from '@polymarket/client/actions';
import type {
  ListOpenOrdersInfiniteData,
  ListOpenOrdersQueryOptions,
} from '../../query/account/listOpenOrders.js';
import { listOpenOrdersQueryOptions } from '../../query/account/listOpenOrders.js';
import type { UseInfiniteQueryReturnType } from '../../utils/query.js';
import { useInfiniteQuery } from '../../utils/query.js';
import { useOptionalSecureClient } from '../../viem/hooks/useOptionalSecureClient.js';

export type UseOpenOrdersParameters = ListOpenOrdersRequest;

export type UseOpenOrdersOptions = {
  query?: ListOpenOrdersQueryOptions;
};

export type UseOpenOrdersReturnType = UseInfiniteQueryReturnType<
  ListOpenOrdersInfiniteData,
  ListOpenOrdersError
>;

/**
 * Lists open orders for the authenticated Polymarket account.
 *
 * @throws {@link ListOpenOrdersError}
 * Thrown on failure.
 *
 * @example
 * ```ts
 * const { data } = useOpenOrders({ market: '0x...' });
 * ```
 */
export function useOpenOrders(
  parameters: UseOpenOrdersParameters = {},
  options: UseOpenOrdersOptions = {},
): UseOpenOrdersReturnType {
  const secureClient = useOptionalSecureClient();
  return useInfiniteQuery(
    listOpenOrdersQueryOptions(secureClient, parameters, options),
  );
}
