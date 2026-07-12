'use client';

import { createSecureClient, production } from '@polymarket/client';
import { signerFrom } from '@polymarket/client/viem';
import type { QueryClient } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import {
  createElement,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { Config } from 'wagmi';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchChain,
  useConfig as useWagmiConfig,
  WagmiProvider,
} from 'wagmi';
import { getAccount, getWalletClient } from 'wagmi/actions';
import { PolymarketProvider } from '../context.js';
import type { PolymarketConfig } from '../createConfig.js';
import { polymarketKeys } from '../query/keys.js';
import { PolymarketViemContext } from './contextValue.js';
import type {
  ConnectPolymarketParameters,
  PolymarketConnectionStatus,
  PolymarketSecureClient,
  PolymarketSecureClientParameters,
  PolymarketViemContextValue,
} from './types.js';

const polygonChainId = production.chainId;

export type { ConnectPolymarketParameters, PolymarketViemContextValue };

export type PolymarketWagmiProviderProps = {
  wagmiConfig: Config;
  config: PolymarketConfig;
  secureClient?: PolymarketSecureClientParameters;
  queryClient?: QueryClient;
  children: ReactNode;
};

/**
 * Provides wagmi, Polymarket config, and secure-client lifecycle to the tree.
 */
export function PolymarketWagmiProvider({
  wagmiConfig,
  config,
  secureClient: secureClientParameters,
  queryClient,
  children,
}: PolymarketWagmiProviderProps) {
  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount>
      <PolymarketProvider config={config} queryClient={queryClient}>
        <PolymarketViemConnector
          config={config}
          secureClientParameters={secureClientParameters}
        >
          {children}
        </PolymarketViemConnector>
      </PolymarketProvider>
    </WagmiProvider>
  );
}

type PolymarketViemConnectorProps = {
  config: PolymarketConfig;
  secureClientParameters?: PolymarketSecureClientParameters;
  children: ReactNode;
};

function PolymarketViemConnector({
  config,
  secureClientParameters,
  children,
}: PolymarketViemConnectorProps) {
  const wagmiConfig = useWagmiConfig();
  const queryClient = useQueryClient();
  const { address, isConnected, chainId } = useAccount();
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();

  const [status, setStatus] =
    useState<PolymarketConnectionStatus>('disconnected');
  const [secureClient, setSecureClient] = useState<
    PolymarketSecureClient | undefined
  >();
  const [account, setAccount] =
    useState<PolymarketViemContextValue['account']>();
  const [error, setError] = useState<Error | undefined>();

  const secureClientRef = useRef<PolymarketSecureClient | undefined>(undefined);
  secureClientRef.current = secureClient;

  const teardownSecureClient = useCallback(async () => {
    const client = secureClientRef.current;
    secureClientRef.current = undefined;
    setSecureClient(undefined);
    setAccount(undefined);

    if (!client) {
      return;
    }

    // Separate try blocks: a failed WebSocket close must not skip ending the
    // server-side auth session.
    try {
      await client.closeSubscriptions();
    } catch {
      // Ignore teardown errors during disconnect or account changes.
    }
    try {
      await client.endAuthentication();
    } catch {
      // Ignore teardown errors during disconnect or account changes.
    }

    await queryClient.cancelQueries({
      queryKey: polymarketKeys.account.all(),
    });
    queryClient.removeQueries({
      queryKey: polymarketKeys.account.all(),
    });
  }, [queryClient]);

  const connectInFlightRef = useRef(false);

  const connectPolymarket = useCallback(
    async (parameters: ConnectPolymarketParameters) => {
      if (connectInFlightRef.current) {
        throw new Error(
          'A Polymarket connection attempt is already in progress.',
        );
      }
      connectInFlightRef.current = true;
      setError(undefined);

      try {
        let accountState = getAccount(wagmiConfig);

        if (!accountState.isConnected) {
          setStatus('connecting');
          await connectAsync({
            connector: parameters.connector,
            chainId: polygonChainId,
          });
          accountState = getAccount(wagmiConfig);
        }

        if (accountState.chainId !== polygonChainId) {
          setStatus('connecting');
          await switchChainAsync({ chainId: polygonChainId });
        }

        setStatus('authenticating');

        const walletClient = await getWalletClient(wagmiConfig, {
          chainId: polygonChainId,
        });

        if (!walletClient?.account) {
          throw new Error('Wallet client with account is required.');
        }

        if (secureClientRef.current) {
          await teardownSecureClient();
        }

        const client = await createSecureClient(
          secureClientParameters?.credentials
            ? {
                signer: signerFrom(walletClient),
                wallet: secureClientParameters.wallet,
                credentials: secureClientParameters.credentials,
                environment: config.environment,
                apiKey: config.apiKey,
              }
            : {
                signer: signerFrom(walletClient),
                wallet: secureClientParameters?.wallet,
                nonce: secureClientParameters?.nonce,
                environment: config.environment,
                apiKey: config.apiKey,
              },
        );

        secureClientRef.current = client;
        setSecureClient(client);
        setAccount(client.account);
        setStatus('connected');
      } catch (cause) {
        const nextError =
          cause instanceof Error ? cause : new Error(String(cause));
        setError(nextError);

        if (secureClientRef.current) {
          // The failure happened before the existing session was replaced
          // (e.g. a rejected chain-switch prompt) — keep the valid session
          // instead of logging the user out.
          setStatus('connected');
        } else {
          setStatus('error');
          await teardownSecureClient();
        }
        throw nextError;
      } finally {
        connectInFlightRef.current = false;
      }
    },
    [
      config.apiKey,
      config.environment,
      connectAsync,
      secureClientParameters?.credentials,
      secureClientParameters?.nonce,
      secureClientParameters?.wallet,
      switchChainAsync,
      teardownSecureClient,
      wagmiConfig,
    ],
  );

  const disconnectPolymarket = useCallback(async () => {
    setError(undefined);
    await teardownSecureClient();
    try {
      if (isConnected) {
        await disconnectAsync();
      }
    } finally {
      // The local session is already torn down — status must reflect that
      // even when the connector's disconnect rejects.
      setStatus('disconnected');
    }
  }, [disconnectAsync, isConnected, teardownSecureClient]);

  // These effects depend on `secureClient` state (not the ref) so they
  // re-run when a client finishes authenticating AFTER the triggering wallet
  // event — otherwise a connect that resolves post-account-switch would leave
  // a client authenticated for the wrong account.
  useEffect(() => {
    if (!isConnected) {
      if (secureClient) {
        void teardownSecureClient().then(() => {
          setStatus('disconnected');
        });
      } else {
        setStatus('disconnected');
      }
      return;
    }

    if (
      secureClient &&
      address &&
      secureClient.account.signer.toLowerCase() !== address.toLowerCase()
    ) {
      void teardownSecureClient().then(() => {
        setStatus('disconnected');
      });
    }
  }, [address, isConnected, secureClient, teardownSecureClient]);

  useEffect(() => {
    if (
      isConnected &&
      chainId !== undefined &&
      chainId !== polygonChainId &&
      secureClient
    ) {
      void teardownSecureClient().then(() => {
        setStatus('disconnected');
      });
    }
  }, [chainId, isConnected, secureClient, teardownSecureClient]);

  const contextValue = useMemo<PolymarketViemContextValue>(
    () => ({
      status,
      secureClient,
      account,
      error,
      isConnected,
      isAuthenticated: secureClient !== undefined,
      connectPolymarket,
      disconnectPolymarket,
    }),
    [
      account,
      connectPolymarket,
      disconnectPolymarket,
      error,
      isConnected,
      secureClient,
      status,
    ],
  );

  return createElement(
    PolymarketViemContext.Provider,
    { value: contextValue },
    children,
  );
}
