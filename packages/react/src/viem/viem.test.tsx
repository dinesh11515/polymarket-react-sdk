'use client';

import { renderHook } from '@testing-library/react';
import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { useOptionalSecureClient } from '../viem/hooks/useOptionalSecureClient.js';

describe('useOptionalSecureClient', () => {
  it('returns undefined without a viem provider', () => {
    const { result } = renderHook(() => useOptionalSecureClient());
    expect(result.current).toBeUndefined();
  });
});

describe('useSecureClient', () => {
  it('throws without PolymarketWagmiProvider', async () => {
    const { useSecureClient } = await import(
      '../viem/hooks/useSecureClient.js'
    );

    expect(() => renderHook(() => useSecureClient())).toThrow(
      'PolymarketWagmiProvider',
    );
  });
});

describe('PolymarketWagmiProvider', () => {
  it('provides optional secure client context', async () => {
    const { PolymarketViemContext } = await import('../viem/contextValue.js');
    const value = {
      status: 'disconnected' as const,
      secureClient: undefined,
      account: undefined,
      error: undefined,
      isConnected: false,
      isAuthenticated: false,
      connectPolymarket: async () => {},
      disconnectPolymarket: async () => {},
    };

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      createElement(PolymarketViemContext.Provider, { value, children });

    const { result } = renderHook(() => useOptionalSecureClient(), {
      wrapper,
    });

    expect(result.current).toBeUndefined();
  });
});
