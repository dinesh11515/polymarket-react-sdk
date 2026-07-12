'use client';

import { useContext } from 'react';
import { PolymarketViemContext } from '../contextValue.js';
import type { PolymarketSecureClient } from '../types.js';

export function useOptionalSecureClient(): PolymarketSecureClient | undefined {
  const context = useContext(PolymarketViemContext);
  return context?.secureClient;
}
