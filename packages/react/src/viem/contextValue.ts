import { createContext } from 'react';
import type { PolymarketViemContextValue } from './types.js';

export const PolymarketViemContext = createContext<
  PolymarketViemContextValue | undefined
>(undefined);
