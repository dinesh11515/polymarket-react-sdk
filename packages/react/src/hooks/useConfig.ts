'use client';

import { useContext } from 'react';
import { PolymarketContext } from '../context.js';
import type { PolymarketConfig } from '../createConfig.js';
import { PolymarketProviderNotFoundError } from '../errors/context.js';

export type UseConfigParameters = {
  config?: PolymarketConfig;
};

export type UseConfigReturnType = PolymarketConfig;

/**
 * Returns the Polymarket config from {@link PolymarketProvider}, or the
 * `config` passed as a parameter (which takes precedence).
 *
 * @throws {@link PolymarketProviderNotFoundError}
 * Thrown when no provider is found and no config override is given.
 *
 * @example
 * ```ts
 * const config = useConfig();
 * ```
 */
export function useConfig(
  parameters: UseConfigParameters = {},
): UseConfigReturnType {
  const context = useContext(PolymarketContext);
  if (parameters.config) {
    return parameters.config;
  }
  if (!context) {
    throw new PolymarketProviderNotFoundError();
  }
  return context.config;
}
