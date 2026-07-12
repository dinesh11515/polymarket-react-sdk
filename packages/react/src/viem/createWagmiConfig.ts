'use client';

import { polygon } from 'viem/chains';
import type { Config, CreateConnectorFn } from 'wagmi';
import { createConfig, http } from 'wagmi';
import { injected } from 'wagmi/connectors';

export type CreatePolymarketWagmiConfigParameters = {
  connectors?: CreateConnectorFn[];
  ssr?: boolean;
};

/**
 * Creates a default wagmi config for Polymarket on Polygon.
 *
 * Injected wallets are discovered automatically (EIP-6963). Pass `connectors`
 * to add WalletConnect, Coinbase Wallet, etc.
 *
 * @example
 * ```ts
 * const wagmiConfig = createPolymarketWagmiConfig();
 * ```
 */
export function createPolymarketWagmiConfig(
  parameters: CreatePolymarketWagmiConfigParameters = {},
): Config {
  const { connectors = [injected()], ssr = false } = parameters;

  return createConfig({
    chains: [polygon],
    connectors,
    transports: {
      [polygon.id]: http(),
    },
    ssr,
  });
}
