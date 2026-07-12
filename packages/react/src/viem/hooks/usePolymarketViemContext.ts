'use client';

import { useContext } from 'react';
import { PolymarketViemContext } from '../contextValue.js';
import { PolymarketViemProviderNotFoundError } from '../errors/context.js';
import type { PolymarketViemContextValue } from '../types.js';

export function usePolymarketViemContext(): PolymarketViemContextValue {
  const context = useContext(PolymarketViemContext);

  if (!context) {
    throw new PolymarketViemProviderNotFoundError();
  }

  return context;
}
