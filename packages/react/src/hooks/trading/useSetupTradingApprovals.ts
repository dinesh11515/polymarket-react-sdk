'use client';

import type { SetupTradingApprovalsError } from '@polymarket/client';
import type { DeprecatedTransactionHandle } from '@polymarket/client/actions';
import type { UseMutationOptions } from '@tanstack/react-query';
import type { UseMutationReturnType } from '../../utils/query.js';
import { usePolymarketMutation } from '../../utils/query.js';
import { requireSecureClient } from '../../utils/requireSecureClient.js';
import { useOptionalSecureClient } from '../../viem/hooks/useOptionalSecureClient.js';

export type UseSetupTradingApprovalsOptions = {
  mutation?: Omit<
    UseMutationOptions<
      DeprecatedTransactionHandle,
      SetupTradingApprovalsError,
      void
    >,
    'mutationFn'
  >;
};

export type UseSetupTradingApprovalsReturnType = UseMutationReturnType<
  DeprecatedTransactionHandle,
  SetupTradingApprovalsError,
  void
>;

/**
 * Sets up trading approvals for the authenticated account.
 *
 * @throws {@link SetupTradingApprovalsError}
 * Thrown on failure.
 *
 * @example
 * ```ts
 * const { mutate: setupTradingApprovals } = useSetupTradingApprovals();
 *
 * setupTradingApprovals();
 * ```
 */
export function useSetupTradingApprovals(
  options: UseSetupTradingApprovalsOptions = {},
): UseSetupTradingApprovalsReturnType {
  const secureClient = useOptionalSecureClient();
  const { mutation: mutationOptions = {} } = options;

  return usePolymarketMutation({
    ...mutationOptions,
    mutationFn: () => requireSecureClient(secureClient).setupTradingApprovals(),
  });
}
