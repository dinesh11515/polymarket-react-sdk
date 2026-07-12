'use client';

import type { OrderResponse } from '@polymarket/client';
import type {
  PrepareLimitOrderRequest,
  PrepareMarketOrderRequest,
} from '@polymarket/client/actions';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { createElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { polymarketKeys } from '../../query/keys.js';
import { PolymarketViemContext } from '../../viem/contextValue.js';
import type {
  PolymarketSecureClient,
  PolymarketViemContextValue,
} from '../../viem/types.js';
import { usePlaceLimitOrder } from './usePlaceLimitOrder.js';
import { usePlaceMarketOrder } from './usePlaceMarketOrder.js';

const acceptedResponse = {
  ok: true,
  orderId: 'order-1',
  status: 'live',
} as unknown as OrderResponse;

const rejectedResponse = {
  ok: false,
  code: 'INSUFFICIENT_FUNDS',
  message: 'not enough balance',
} as unknown as OrderResponse;

const limitOrderRequest = {
  tokenId: '123',
  side: 'BUY',
  price: 0.5,
  size: 10,
} as unknown as PrepareLimitOrderRequest;

const marketOrderRequest = {
  tokenId: '123',
  side: 'BUY',
  amount: 1,
} as unknown as PrepareMarketOrderRequest;

function setup(
  clientMethod: 'placeLimitOrder' | 'placeMarketOrder',
  response: OrderResponse,
) {
  const placeOrder = vi.fn(async () => response);
  const secureClient = {
    [clientMethod]: placeOrder,
  } as unknown as PolymarketSecureClient;

  const contextValue: PolymarketViemContextValue = {
    status: 'connected',
    secureClient,
    account: undefined,
    error: undefined,
    isConnected: true,
    isAuthenticated: true,
    connectPolymarket: async () => {},
    disconnectPolymarket: async () => {},
  };

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

  const wrapper = ({ children }: { children: React.ReactNode }) =>
    createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(PolymarketViemContext.Provider, {
        value: contextValue,
        children,
      }),
    );

  return { wrapper, invalidateSpy, placeOrder };
}

// biome-ignore format: table alignment
const hookCases = [
  {
    hookName: 'usePlaceLimitOrder',
    clientMethod: 'placeLimitOrder',
    useHook: usePlaceLimitOrder,
    request: limitOrderRequest,
  },
  {
    hookName: 'usePlaceMarketOrder',
    clientMethod: 'placeMarketOrder',
    useHook: usePlaceMarketOrder,
    request: marketOrderRequest,
  },
] as const;

describe.each(hookCases)('$hookName', ({ clientMethod, useHook, request }) => {
  it('invalidates account queries and preserves the user onSuccess on accepted orders', async () => {
    const { wrapper, invalidateSpy, placeOrder } = setup(
      clientMethod,
      acceptedResponse,
    );
    const onSuccess = vi.fn();

    const { result } = renderHook(
      () =>
        useHook({
          mutation: { onSuccess },
        } as never) as ReturnType<typeof usePlaceLimitOrder>,
      { wrapper },
    );

    await act(async () => {
      const response = await result.current.mutateAsync(request as never);
      expect(response).toBe(acceptedResponse);
    });

    expect(placeOrder).toHaveBeenCalledWith(request);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: polymarketKeys.account.all(),
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);
    // TanStack Query v5 signature: (data, variables, onMutateResult, context)
    expect(onSuccess.mock.calls[0]).toHaveLength(4);
    expect(onSuccess.mock.calls[0]?.[0]).toBe(acceptedResponse);
    expect(onSuccess.mock.calls[0]?.[1]).toBe(request);
  });

  it('resolves with in-band rejections without invalidating queries', async () => {
    const { wrapper, invalidateSpy } = setup(clientMethod, rejectedResponse);
    const onSuccess = vi.fn();

    const { result } = renderHook(
      () =>
        useHook({
          mutation: { onSuccess },
        } as never) as ReturnType<typeof usePlaceLimitOrder>,
      { wrapper },
    );

    await act(async () => {
      // ok:false must NOT throw — it is an in-band failure.
      const response = await result.current.mutateAsync(request as never);
      expect(response).toBe(rejectedResponse);
    });

    expect(invalidateSpy).not.toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('rejects when no secure client is available', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      createElement(QueryClientProvider, { client: queryClient, children });

    const { result } = renderHook(
      () => useHook() as ReturnType<typeof usePlaceLimitOrder>,
      { wrapper },
    );

    await act(async () => {
      await expect(
        result.current.mutateAsync(request as never),
      ).rejects.toThrow('Secure client is required');
    });
  });
});
