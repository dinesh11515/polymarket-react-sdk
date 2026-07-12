'use client';

import { usePolymarketMutation } from '../../utils/mutation.js';
import { usePolymarketViemContext } from './usePolymarketViemContext.js';

export type UseDisconnectPolymarketReturnType = {
  disconnectPolymarket: () => void;
  disconnectPolymarketAsync: () => Promise<void>;
  isPending: boolean;
  error: Error | null;
  reset: () => void;
};

/**
 * Disconnects the wallet and tears down the secure client session.
 */
export function useDisconnectPolymarket(): UseDisconnectPolymarketReturnType {
  const { disconnectPolymarket } = usePolymarketViemContext();

  const mutation = usePolymarketMutation<void, Error, void>({
    mutationFn: disconnectPolymarket,
  });

  return {
    disconnectPolymarket: mutation.mutate,
    disconnectPolymarketAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error ?? null,
    reset: mutation.reset,
  };
}
