import type { CancelOrdersResponse, OrderResponse } from '@polymarket/client';
import type { QueryClient } from '@tanstack/react-query';
import { polymarketKeys } from '../query/keys.js';

export async function invalidateOpenOrders(
  queryClient: QueryClient,
): Promise<void> {
  await queryClient.invalidateQueries({
    queryKey: polymarketKeys.account.openOrdersAll(),
  });
}

export async function invalidatePositionsAndPortfolio(
  queryClient: QueryClient,
): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: polymarketKeys.account.positionsAll(),
    }),
    queryClient.invalidateQueries({
      queryKey: polymarketKeys.account.portfolioValueAll(),
    }),
  ]);
}

export async function invalidateAccountQueries(
  queryClient: QueryClient,
): Promise<void> {
  await queryClient.invalidateQueries({
    queryKey: polymarketKeys.account.all(),
  });
}

export async function invalidateAfterOrderPlacement(
  queryClient: QueryClient,
  response: OrderResponse,
): Promise<void> {
  if (!response.ok) {
    return;
  }

  await invalidateAccountQueries(queryClient);
}

export async function invalidateAfterOrderCancellation(
  queryClient: QueryClient,
  response?: CancelOrdersResponse,
): Promise<void> {
  if (response && response.canceled.length === 0) {
    return;
  }

  await invalidateOpenOrders(queryClient);
}
