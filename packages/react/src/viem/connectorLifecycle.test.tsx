'use client';

import { createSecureClient } from '@polymarket/client';
import { useQueryClient } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { createElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Config } from 'wagmi';
import { createPolymarketConfig } from '../createConfig.js';
import { polymarketKeys } from '../query/keys.js';
import { PolymarketWagmiProvider } from './context.js';
import { usePolymarketViemContext } from './hooks/usePolymarketViemContext.js';

const { walletState, mockSecureClient } = vi.hoisted(() => {
  const walletState = {
    address: '0xAbC0000000000000000000000000000000000001' as
      | `0x${string}`
      | undefined,
    isConnected: false,
    chainId: 137 as number | undefined,
  };
  const mockSecureClient = {
    account: {
      signer: '0xAbC0000000000000000000000000000000000001',
      wallet: '0xDeF0000000000000000000000000000000000002',
      walletType: 'EOA',
    },
    closeSubscriptions: vi.fn(async () => undefined),
    endAuthentication: vi.fn(async () => undefined),
  };
  return { walletState, mockSecureClient };
});

vi.mock('wagmi', () => ({
  WagmiProvider: ({ children }: { children: React.ReactNode }) => children,
  useAccount: () => ({ ...walletState }),
  useConnect: () => ({ connectAsync: vi.fn(async () => ({})) }),
  useDisconnect: () => ({ disconnectAsync: vi.fn(async () => undefined) }),
  useSwitchChain: () => ({ switchChainAsync: vi.fn(async () => ({})) }),
  useConfig: () => ({}),
}));

vi.mock('wagmi/actions', () => ({
  getAccount: vi.fn(() => ({
    isConnected: true,
    chainId: 137,
  })),
  getWalletClient: vi.fn(async () => ({
    account: { address: walletState.address },
  })),
}));

vi.mock('@polymarket/client/viem', () => ({
  signerFrom: vi.fn(() => ({})),
}));

vi.mock('@polymarket/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@polymarket/client')>();
  return {
    ...actual,
    createSecureClient: vi.fn(async () => mockSecureClient),
  };
});

describe('PolymarketWagmiProvider secure-client lifecycle', () => {
  beforeEach(() => {
    walletState.address = '0xAbC0000000000000000000000000000000000001';
    walletState.isConnected = false;
    walletState.chainId = 137;
    mockSecureClient.closeSubscriptions.mockClear();
    mockSecureClient.endAuthentication.mockClear();
  });

  function renderConnection() {
    const config = createPolymarketConfig();
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      createElement(PolymarketWagmiProvider, {
        wagmiConfig: {} as Config,
        config,
        children,
      });
    return renderHook(
      () => ({
        connection: usePolymarketViemContext(),
        queryClient: useQueryClient(),
      }),
      { wrapper },
    );
  }

  async function authenticate(
    result: ReturnType<typeof renderConnection>['result'],
    rerender: () => void,
  ) {
    walletState.isConnected = true;
    rerender();
    await act(async () => {
      await result.current.connection.connectPolymarket({
        connector: {} as never,
      });
    });
    expect(result.current.connection.status).toBe('connected');
    expect(result.current.connection.isAuthenticated).toBe(true);
    expect(result.current.connection.secureClient).toBeDefined();
  }

  it('tears down the secure client when the wallet account changes', async () => {
    const { result, rerender } = renderConnection();
    await authenticate(result, rerender);

    walletState.address = '0xAbC0000000000000000000000000000000000009';
    rerender();

    await waitFor(() => {
      expect(result.current.connection.status).toBe('disconnected');
    });
    expect(mockSecureClient.closeSubscriptions).toHaveBeenCalled();
    expect(mockSecureClient.endAuthentication).toHaveBeenCalled();
    expect(result.current.connection.secureClient).toBeUndefined();
    expect(result.current.connection.isAuthenticated).toBe(false);
  });

  it('purges cached account queries when the wallet account changes', async () => {
    const { result, rerender } = renderConnection();
    await authenticate(result, rerender);

    const positionsKey = polymarketKeys.account.positions({});
    act(() => {
      result.current.queryClient.setQueryData(positionsKey, {
        pages: [],
        pageParams: [],
      });
    });
    expect(result.current.queryClient.getQueryData(positionsKey)).toBeDefined();

    walletState.address = '0xAbC0000000000000000000000000000000000009';
    rerender();

    // Wallet B must never see wallet A's cached positions.
    await waitFor(() => {
      expect(
        result.current.queryClient.getQueryData(positionsKey),
      ).toBeUndefined();
    });
  });

  it('tears down the secure client when the wallet disconnects', async () => {
    const { result, rerender } = renderConnection();
    await authenticate(result, rerender);

    walletState.isConnected = false;
    walletState.address = undefined;
    rerender();

    await waitFor(() => {
      expect(result.current.connection.status).toBe('disconnected');
    });
    expect(mockSecureClient.endAuthentication).toHaveBeenCalled();
    expect(result.current.connection.secureClient).toBeUndefined();
  });

  it('tears down the secure client when the chain leaves Polygon', async () => {
    const { result, rerender } = renderConnection();
    await authenticate(result, rerender);

    walletState.chainId = 1;
    rerender();

    await waitFor(() => {
      expect(result.current.connection.status).toBe('disconnected');
    });
    expect(mockSecureClient.endAuthentication).toHaveBeenCalled();
    expect(result.current.connection.secureClient).toBeUndefined();
  });

  it('sets error status and rethrows when authentication fails', async () => {
    vi.mocked(createSecureClient).mockRejectedValueOnce(
      new Error('auth failed'),
    );

    const { result, rerender } = renderConnection();
    walletState.isConnected = true;
    rerender();

    await act(async () => {
      await expect(
        result.current.connection.connectPolymarket({
          connector: {} as never,
        }),
      ).rejects.toThrow('auth failed');
    });

    expect(result.current.connection.status).toBe('error');
    expect(result.current.connection.error?.message).toBe('auth failed');
    expect(result.current.connection.secureClient).toBeUndefined();
    expect(result.current.connection.isAuthenticated).toBe(false);
  });

  it('rejects concurrent connection attempts', async () => {
    // First call parks inside createSecureClient until released.
    let releaseFirst!: () => void;
    vi.mocked(createSecureClient).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          releaseFirst = () => resolve(mockSecureClient as never);
        }),
    );

    const { result, rerender } = renderConnection();
    walletState.isConnected = true;
    rerender();

    await act(async () => {
      const first = result.current.connection.connectPolymarket({
        connector: {} as never,
      });
      await expect(
        result.current.connection.connectPolymarket({
          connector: {} as never,
        }),
      ).rejects.toThrow('already in progress');
      releaseFirst();
      await first;
    });

    expect(result.current.connection.status).toBe('connected');
  });
});
