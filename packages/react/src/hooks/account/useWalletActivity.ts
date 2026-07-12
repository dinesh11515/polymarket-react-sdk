'use client';

import type { ListActivityError } from '@polymarket/client';
import type { ListActivityRequest } from '@polymarket/client/actions';
import type {
  ListWalletActivityInfiniteData,
  ListWalletActivityQueryOptions,
} from '../../query/account/listWalletActivity.js';
import { listWalletActivityQueryOptions } from '../../query/account/listWalletActivity.js';
import type { UseInfiniteQueryReturnType } from '../../utils/query.js';
import { useInfiniteQuery } from '../../utils/query.js';
import type { UseConfigParameters } from '../useConfig.js';
import { useConfig } from '../useConfig.js';

export type UseWalletActivityParameters = ListActivityRequest;

export type UseWalletActivityOptions = UseConfigParameters & {
  query?: ListWalletActivityQueryOptions;
};

export type UseWalletActivityReturnType = UseInfiniteQueryReturnType<
  ListWalletActivityInfiniteData,
  ListActivityError
>;

/**
 * Lists public on-chain activity for a wallet address.
 *
 * @throws {@link ListActivityError}
 * Thrown on failure.
 *
 * @example
 * ```ts
 * const { data } = useWalletActivity({
 *   user: '0xabc...',
 *   pageSize: 20,
 * });
 * ```
 */
export function useWalletActivity(
  parameters: UseWalletActivityParameters,
  options: UseWalletActivityOptions = {},
): UseWalletActivityReturnType {
  const config = useConfig(options);
  return useInfiniteQuery(
    listWalletActivityQueryOptions(config, parameters, options),
  );
}
