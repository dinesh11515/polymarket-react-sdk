'use client';

import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { createContext, createElement, useState } from 'react';
import type { PolymarketConfig } from './createConfig.js';
import { createPolymarketQueryClient } from './utils/createQueryClient.js';

export const PolymarketContext = createContext<
  PolymarketContextValue | undefined
>(undefined);

export type PolymarketContextValue = {
  config: PolymarketConfig;
};

export type PolymarketProviderProps = {
  config: PolymarketConfig;
  queryClient?: QueryClient;
  children: React.ReactNode;
};

/**
 * Provides Polymarket config and TanStack Query to the component tree.
 */
export function PolymarketProvider({
  config,
  queryClient,
  children,
}: PolymarketProviderProps) {
  const [defaultQueryClient] = useState(createPolymarketQueryClient);
  const resolvedQueryClient = queryClient ?? defaultQueryClient;

  const contextValue: PolymarketContextValue = {
    config,
  };

  return createElement(
    QueryClientProvider,
    { client: resolvedQueryClient },
    createElement(
      PolymarketContext.Provider,
      { value: contextValue },
      children,
    ),
  );
}
