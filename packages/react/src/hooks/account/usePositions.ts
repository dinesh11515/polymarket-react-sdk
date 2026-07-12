'use client';

import type {
  ListPositionsError,
  SecureListPositionsRequest,
} from '@polymarket/client';
import type {
  ListPositionsInfiniteData,
  ListPositionsQueryOptions,
} from '../../query/account/listPositions.js';
import { listPositionsQueryOptions } from '../../query/account/listPositions.js';
import type { UseInfiniteQueryReturnType } from '../../utils/query.js';
import { useInfiniteQuery } from '../../utils/query.js';
import { useOptionalSecureClient } from '../../viem/hooks/useOptionalSecureClient.js';

export type UsePositionsParameters = SecureListPositionsRequest;

export type UsePositionsOptions = {
  query?: ListPositionsQueryOptions;
};

export type UsePositionsReturnType = UseInfiniteQueryReturnType<
  ListPositionsInfiniteData,
  ListPositionsError
>;

/**
 * Lists positions for the authenticated Polymarket account.
 *
 * @throws {@link ListPositionsError}
 * Thrown on failure.
 *
 * @example
 * ```ts
 * const { data } = usePositions({ pageSize: 20 });
 * ```
 */
export function usePositions(
  parameters: UsePositionsParameters = {},
  options: UsePositionsOptions = {},
): UsePositionsReturnType {
  const secureClient = useOptionalSecureClient();
  return useInfiniteQuery(
    listPositionsQueryOptions(secureClient, parameters, options),
  );
}
