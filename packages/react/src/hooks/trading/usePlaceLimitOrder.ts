'use client';

import type { OrderResponse, PlaceLimitOrderError } from '@polymarket/client';
import type { PrepareLimitOrderRequest } from '@polymarket/client/actions';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { invalidateAfterOrderPlacement } from '../../utils/invalidateAccountQueries.js';
import type { UseMutationReturnType } from '../../utils/mutation.js';
import { usePolymarketMutation } from '../../utils/mutation.js';
import { requireSecureClient } from '../../utils/requireSecureClient.js';
import { useOptionalSecureClient } from '../../viem/hooks/useOptionalSecureClient.js';

export type UsePlaceLimitOrderParameters = PrepareLimitOrderRequest;

export type UsePlaceLimitOrderOptions = {
  mutation?: Omit<
    UseMutationOptions<
      OrderResponse,
      PlaceLimitOrderError,
      UsePlaceLimitOrderParameters
    >,
    'mutationFn'
  >;
};

export type UsePlaceLimitOrderReturnType = UseMutationReturnType<
  OrderResponse,
  PlaceLimitOrderError,
  UsePlaceLimitOrderParameters
>;

/**
 * Places a limit order for the authenticated account.
 *
 * @throws {@link PlaceLimitOrderError}
 * Thrown on failure.
 *
 * @example
 * ```ts
 * const { mutate: placeLimitOrder } = usePlaceLimitOrder();
 *
 * placeLimitOrder({
 *   tokenId: '123',
 *   side: OrderSide.BUY,
 *   price: 0.5,
 *   size: 10,
 * });
 * ```
 */
export function usePlaceLimitOrder(
  options: UsePlaceLimitOrderOptions = {},
): UsePlaceLimitOrderReturnType {
  const secureClient = useOptionalSecureClient();
  const queryClient = useQueryClient();
  const { mutation: mutationOptions = {} } = options;

  return usePolymarketMutation({
    ...mutationOptions,
    mutationFn: (parameters) =>
      requireSecureClient(secureClient).placeLimitOrder(parameters),
    onSuccess: async (data, variables, onMutateResult, context) => {
      await invalidateAfterOrderPlacement(queryClient, data);
      await mutationOptions.onSuccess?.(
        data,
        variables,
        onMutateResult,
        context,
      );
    },
  });
}
