'use client';

import type { OrderResponse, PlaceMarketOrderError } from '@polymarket/client';
import type { PrepareMarketOrderRequest } from '@polymarket/client/actions';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { invalidateAfterOrderPlacement } from '../../utils/invalidateAccountQueries.js';
import type { UseMutationReturnType } from '../../utils/query.js';
import { usePolymarketMutation } from '../../utils/query.js';
import { requireSecureClient } from '../../utils/requireSecureClient.js';
import { useOptionalSecureClient } from '../../viem/hooks/useOptionalSecureClient.js';

export type UsePlaceMarketOrderParameters = PrepareMarketOrderRequest;

export type UsePlaceMarketOrderOptions = {
  mutation?: Omit<
    UseMutationOptions<
      OrderResponse,
      PlaceMarketOrderError,
      UsePlaceMarketOrderParameters
    >,
    'mutationFn'
  >;
};

export type UsePlaceMarketOrderReturnType = UseMutationReturnType<
  OrderResponse,
  PlaceMarketOrderError,
  UsePlaceMarketOrderParameters
>;

/**
 * Places a market order for the authenticated account.
 *
 * @throws {@link PlaceMarketOrderError}
 * Thrown on failure.
 *
 * @example
 * ```ts
 * const { mutate: placeMarketOrder } = usePlaceMarketOrder();
 *
 * placeMarketOrder({
 *   tokenId: '123',
 *   side: OrderSide.BUY,
 *   amount: 10,
 * });
 * ```
 */
export function usePlaceMarketOrder(
  options: UsePlaceMarketOrderOptions = {},
): UsePlaceMarketOrderReturnType {
  const secureClient = useOptionalSecureClient();
  const queryClient = useQueryClient();
  const { mutation: mutationOptions = {} } = options;

  return usePolymarketMutation({
    ...mutationOptions,
    mutationFn: (parameters) =>
      requireSecureClient(secureClient).placeMarketOrder(parameters),
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
