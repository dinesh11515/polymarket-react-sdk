'use client';

import type { PolymarketPublicClient } from '../createConfig.js';
import type { UseConfigParameters } from './useConfig.js';
import { useConfig } from './useConfig.js';

export type UsePublicClientParameters = UseConfigParameters;

export type UsePublicClientReturnType = PolymarketPublicClient;

/**
 * Returns the `@polymarket/client` public client from the resolved config,
 * for calling client APIs the hooks do not cover.
 *
 * @example
 * ```ts
 * const publicClient = usePublicClient();
 * const market = await publicClient.fetchMarket({ slug: 'example-market' });
 * ```
 */
export function usePublicClient(
  parameters: UsePublicClientParameters = {},
): UsePublicClientReturnType {
  return useConfig(parameters).publicClient;
}
