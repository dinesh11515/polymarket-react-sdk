'use client';

import type { PolymarketSecureClient } from '../types.js';
import { usePolymarketViemContext } from './usePolymarketViemContext.js';

export type UseSecureClientReturnType = PolymarketSecureClient | undefined;

/**
 * Returns the authenticated secure client, if available.
 */
export function useSecureClient(): UseSecureClientReturnType {
  const { secureClient } = usePolymarketViemContext();
  return secureClient;
}
