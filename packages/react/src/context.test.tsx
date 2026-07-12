'use client';

import { renderHook, waitFor } from '@testing-library/react';
import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { PolymarketProvider } from './context.js';
import { createPolymarketConfig } from './createConfig.js';
import { useConfig } from './hooks/useConfig.js';

describe('useConfig', () => {
  it('returns config from provider', () => {
    const config = createPolymarketConfig();

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      createElement(PolymarketProvider, { config, children });

    const { result } = renderHook(() => useConfig(), { wrapper });

    expect(result.current.publicClient).toBe(config.publicClient);
  });
});

describe('useMarkets', () => {
  it.skip('fetches the first page of markets', async () => {
    const { useMarkets } = await import('./hooks/discovery/useMarkets.js');
    const config = createPolymarketConfig();

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      createElement(PolymarketProvider, { config, children });

    const { result } = renderHook(
      () => useMarkets({ closed: false, pageSize: 3 }),
      { wrapper },
    );

    await waitFor(
      () => {
        expect(result.current.isSuccess).toBe(true);
      },
      { timeout: 15_000 },
    );

    expect(result.current.data?.pages[0]?.items.length).toBeGreaterThan(0);
  });
});
