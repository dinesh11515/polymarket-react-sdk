'use client';

import type {
  ListActivityError,
  SecureListActivityRequest,
} from '@polymarket/client';
import type {
  ListActivityInfiniteData,
  ListActivityQueryOptions,
} from '../../query/account/listActivity.js';
import { listActivityQueryOptions } from '../../query/account/listActivity.js';
import type { UseInfiniteQueryReturnType } from '../../utils/query.js';
import { useInfiniteQuery } from '../../utils/query.js';
import { useOptionalSecureClient } from '../../viem/hooks/useOptionalSecureClient.js';

export type UseActivityParameters = SecureListActivityRequest;

export type UseActivityOptions = {
  query?: ListActivityQueryOptions;
};

export type UseActivityReturnType = UseInfiniteQueryReturnType<
  ListActivityInfiniteData,
  ListActivityError
>;

/**
 * Lists activity for the authenticated Polymarket account.
 *
 * @throws {@link ListActivityError}
 * Thrown on failure.
 *
 * @example
 * ```ts
 * const { data } = useActivity({ pageSize: 20 });
 * const activity = data?.pages.flatMap((page) => page.items) ?? [];
 * ```
 */
export function useActivity(
  parameters: UseActivityParameters = {},
  options: UseActivityOptions = {},
): UseActivityReturnType {
  const secureClient = useOptionalSecureClient();
  return useInfiniteQuery(
    listActivityQueryOptions(secureClient, parameters, options),
  );
}
