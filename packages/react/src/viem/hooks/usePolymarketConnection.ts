'use client';

import { useAccount } from 'wagmi';
import type { PolymarketConnectionState } from '../types.js';
import { usePolymarketViemContext } from './usePolymarketViemContext.js';

export type UsePolymarketConnectionReturnType = PolymarketConnectionState & {
  address: ReturnType<typeof useAccount>['address'];
  chainId: ReturnType<typeof useAccount>['chainId'];
};

/**
 * Returns wallet and Polymarket authentication state.
 */
export function usePolymarketConnection(): UsePolymarketConnectionReturnType {
  const { address, chainId } = useAccount();
  const connection = usePolymarketViemContext();

  return {
    status: connection.status,
    secureClient: connection.secureClient,
    account: connection.account,
    error: connection.error,
    isConnected: connection.isConnected,
    isAuthenticated: connection.isAuthenticated,
    address,
    chainId,
  };
}
