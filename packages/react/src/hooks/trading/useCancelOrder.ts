'use client';

import type {
  CancelOrderError,
  CancelOrdersResponse,
} from '@polymarket/client';
import type { CancelOrderRequest } from '@polymarket/client/actions';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { invalidateAfterOrderCancellation } from '../../utils/invalidateAccountQueries.js';
import type { UseMutationReturnType } from '../../utils/mutation.js';
import { usePolymarketMutation } from '../../utils/mutation.js';
import { requireSecureClient } from '../../utils/requireSecureClient.js';
import { useOptionalSecureClient } from '../../viem/hooks/useOptionalSecureClient.js';

export type UseCancelOrderParameters = CancelOrderRequest;

export type UseCancelOrderOptions = {
  mutation?: Omit<
    UseMutationOptions<
      CancelOrdersResponse,
      CancelOrderError,
      UseCancelOrderParameters
    >,
    'mutationFn'
  >;
};

export type UseCancelOrderReturnType = UseMutationReturnType<
  CancelOrdersResponse,
  CancelOrderError,
  UseCancelOrderParameters
>;

/**
 * Cancels a single open order.
 *
 * @throws {@link CancelOrderError}
 * Thrown on failure.
 *
 * @example
 * ```ts
 * const { mutate: cancelOrder } = useCancelOrder();
 *
 * cancelOrder({ orderId: 'abc' });
 * ```
 */
export function useCancelOrder(
  options: UseCancelOrderOptions = {},
): UseCancelOrderReturnType {
  const secureClient = useOptionalSecureClient();
  const queryClient = useQueryClient();
  const { mutation: mutationOptions = {} } = options;

  return usePolymarketMutation({
    ...mutationOptions,
    mutationFn: (parameters) =>
      requireSecureClient(secureClient).cancelOrder(parameters),
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
