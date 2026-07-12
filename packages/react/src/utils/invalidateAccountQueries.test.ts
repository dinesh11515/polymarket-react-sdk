import type { CancelOrdersResponse } from '@polymarket/client';
import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { polymarketKeys } from '../query/keys.js';
import { invalidateAfterOrderCancellation } from './invalidateAccountQueries.js';

describe('polymarketKeys account prefixes', () => {
  it('matches open orders queries with any parameters', () => {
    const prefixKey = polymarketKeys.account.openOrdersAll();
    const filteredKey = polymarketKeys.account.openOrders({ market: '0xabc' });

    expect(filteredKey.slice(0, prefixKey.length)).toEqual(prefixKey);
    expect(filteredKey.length).toBeGreaterThan(prefixKey.length);
  });

  it('matches positions and portfolio value queries with any parameters', () => {
    const positionsPrefix = polymarketKeys.account.positionsAll();
    const portfolioPrefix = polymarketKeys.account.portfolioValueAll();
    const positionsKey = polymarketKeys.account.positions({ pageSize: 10 });
    const portfolioKey = polymarketKeys.account.portfolioValue({ user: '0x1' });

    expect(positionsKey.slice(0, positionsPrefix.length)).toEqual(
      positionsPrefix,
    );
    expect(portfolioKey.slice(0, portfolioPrefix.length)).toEqual(
      portfolioPrefix,
    );
  });
});

describe('invalidateAfterOrderCancellation', () => {
  function setup() {
    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    return { queryClient, invalidateSpy };
  }

  it('invalidates open orders when orders were canceled', async () => {
    const { queryClient, invalidateSpy } = setup();
    const response: CancelOrdersResponse = {
      canceled: ['order-1'],
      notCanceled: {},
    };

    await invalidateAfterOrderCancellation(queryClient, response);

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: polymarketKeys.account.openOrdersAll(),
    });
  });

  it('skips invalidation when zero orders were canceled', async () => {
    const { queryClient, invalidateSpy } = setup();
    const response: CancelOrdersResponse = {
      canceled: [],
      notCanceled: { 'order-1': 'already filled' },
    };

    await invalidateAfterOrderCancellation(queryClient, response);

    expect(invalidateSpy).not.toHaveBeenCalled();
  });

  it('invalidates when no response is provided', async () => {
    const { queryClient, invalidateSpy } = setup();

    await invalidateAfterOrderCancellation(queryClient);

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: polymarketKeys.account.openOrdersAll(),
    });
  });
});
