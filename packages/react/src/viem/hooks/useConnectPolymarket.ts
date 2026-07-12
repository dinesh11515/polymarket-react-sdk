'use client';

import type { CreateSecureClientError } from '@polymarket/client';
import { usePolymarketMutation } from '../../utils/mutation.js';
import type { ConnectPolymarketParameters } from '../types.js';
import { usePolymarketViemContext } from './usePolymarketViemContext.js';

export type UseConnectPolymarketParameters = ConnectPolymarketParameters;

export type UseConnectPolymarketReturnType = {
  connectPolymarket: (parameters: UseConnectPolymarketParameters) => void;
  connectPolymarketAsync: (
    parameters: UseConnectPolymarketParameters,
  ) => Promise<void>;
  isPending: boolean;
  error: CreateSecureClientError | Error | null;
  reset: () => void;
};

/**
 * Connects a wallet and authenticates a Polymarket secure client.
 *
 * @throws {@link CreateSecureClientError}
 * Thrown on authentication failure.
 */
export function useConnectPolymarket(): UseConnectPolymarketReturnType {
  const {
    connectPolymarket,
    status,
    error: connectionError,
  } = usePolymarketViemContext();

  const mutation = usePolymarketMutation<
    void,
    CreateSecureClientError | Error,
    UseConnectPolymarketParameters
  >({
    mutationFn: connectPolymarket,
  });

  return {
    connectPolymarket: mutation.mutate,
    connectPolymarketAsync: mutation.mutateAsync,
    isPending:
      mutation.isPending ||
      status === 'connecting' ||
      status === 'authenticating',
    error: mutation.error ?? connectionError ?? null,
    reset: mutation.reset,
  };
}
