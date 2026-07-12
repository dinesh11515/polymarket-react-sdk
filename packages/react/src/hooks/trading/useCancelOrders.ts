'use client';

import type {
  CancelOrdersError,
  CancelOrdersResponse,
} from '@polymarket/client';
import type { CancelOrdersRequest } from '@polymarket/client/actions';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { invalidateAfterOrderCancellation } from '../../utils/invalidateAccountQueries.js';
import type { UseMutationReturnType } from '../../utils/query.js';
import { usePolymarketMutation } from '../../utils/query.js';
import { requireSecureClient } from '../../utils/requireSecureClient.js';
import { useOptionalSecureClient } from '../../viem/hooks/useOptionalSecureClient.js';

export type UseCancelOrdersParameters = CancelOrdersRequest;

export type UseCancelOrdersOptions = {
  mutation?: Omit<
    UseMutationOptions<
      CancelOrdersResponse,
      CancelOrdersError,
      UseCancelOrdersParameters
    >,
    'mutationFn'
  >;
};

export type UseCancelOrdersReturnType = UseMutationReturnType<
  CancelOrdersResponse,
  CancelOrdersError,
  UseCancelOrdersParameters
>;

/**
 * Cancels multiple open orders.
 *
 * @throws {@link CancelOrdersError}
 * Thrown on failure.
 *
 * @example
 * ```ts
 * const { mutate: cancelOrders } = useCancelOrders();
 *
 * cancelOrders({ orderIds: ['abc', 'def'] });
 * ```
 */
export function useCancelOrders(
  options: UseCancelOrdersOptions = {},
): UseCancelOrdersReturnType {
  const secureClient = useOptionalSecureClient();
  const queryClient = useQueryClient();
  const { mutation: mutationOptions = {} } = options;

  return usePolymarketMutation({
    ...mutationOptions,
    mutationFn: (parameters) =>
      requireSecureClient(secureClient).cancelOrders(parameters),
    onSuccess: async (data, variables, onMutateResult, context) => {
      await invalidateAfterOrderCancellation(queryClient, data);
      await mutationOptions.onSuccess?.(
        data,
        variables,
        onMutateResult,
        context,
      );
    },
  });
}
