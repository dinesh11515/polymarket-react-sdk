import type {
  PublicActions,
  SecureActions,
  SecureClient,
} from '@polymarket/client';
import type { FetchMarketRequest } from '@polymarket/client/actions';
import { describe, expect, it } from 'vitest';
import { createPolymarketConfig } from '../createConfig.js';
import { fetchPortfolioValueQueryOptions } from './account/fetchPortfolioValue.js';
import { listOpenOrdersQueryOptions } from './account/listOpenOrders.js';
import { listWalletActivityQueryOptions } from './account/listWalletActivity.js';
import { fetchOrderBookQueryOptions } from './data/fetchOrderBook.js';
import { fetchPricesQueryOptions } from './data/fetchPrices.js';
import { fetchMarketQueryOptions } from './discovery/fetchMarket.js';
import { searchQueryOptions } from './discovery/search.js';

type PolymarketSecureClient = SecureClient<PublicActions, SecureActions>;

const config = createPolymarketConfig();
const fakeSecureClient = {} as PolymarketSecureClient;

describe('enabled guards cannot be bypassed by user query options', () => {
  it('fetchMarket stays disabled without an identifier', () => {
    const options = fetchMarketQueryOptions(config, {} as FetchMarketRequest, {
      query: { enabled: true },
    });
    expect(options.enabled).toBe(false);
  });

  it('fetchMarket respects user enabled=false with an identifier', () => {
    const options = fetchMarketQueryOptions(
      config,
      { slug: 'example' },
      { query: { enabled: false } },
    );
    expect(options.enabled).toBe(false);
  });

  it('fetchMarket is enabled by default with an identifier', () => {
    const options = fetchMarketQueryOptions(config, { slug: 'example' });
    expect(options.enabled).toBe(true);
  });

  it('search stays disabled for a blank query', () => {
    const options = searchQueryOptions(
      config,
      { q: '   ' },
      { query: { enabled: true } },
    );
    expect(options.enabled).toBe(false);
  });

  it('fetchOrderBook stays disabled without a tokenId', () => {
    const options = fetchOrderBookQueryOptions(
      config,
      { tokenId: '' },
      { query: { enabled: true } },
    );
    expect(options.enabled).toBe(false);
  });

  it('fetchPrices stays disabled for an empty request', () => {
    const options = fetchPricesQueryOptions(config, [], {
      query: { enabled: true },
    });
    expect(options.enabled).toBe(false);
  });

  it('listWalletActivity stays disabled without a user address', () => {
    const options = listWalletActivityQueryOptions(
      config,
      { user: '' },
      { query: { enabled: true } },
    );
    expect(options.enabled).toBe(false);
  });

  it('secure queries stay disabled without a secure client', () => {
    expect(
      listOpenOrdersQueryOptions(undefined, {}, { query: { enabled: true } })
        .enabled,
    ).toBe(false);
    expect(
      fetchPortfolioValueQueryOptions(
        undefined,
        {},
        { query: { enabled: true } },
      ).enabled,
    ).toBe(false);
  });

  it('secure queries honor user enabled with a secure client', () => {
    expect(
      listOpenOrdersQueryOptions(
        fakeSecureClient,
        {},
        { query: { enabled: false } },
      ).enabled,
    ).toBe(false);
    expect(listOpenOrdersQueryOptions(fakeSecureClient, {}).enabled).toBe(true);
  });

  it('user staleTime and refetchInterval still pass through', () => {
    const options = fetchOrderBookQueryOptions(
      config,
      { tokenId: '123' },
      { query: { staleTime: 60_000, refetchInterval: 10_000 } },
    );
    expect(options.staleTime).toBe(60_000);
    expect(options.refetchInterval).toBe(10_000);
    expect(options.enabled).toBe(true);
  });

  it('order book and price queries default to a short staleTime', () => {
    expect(
      fetchOrderBookQueryOptions(config, { tokenId: '123' }).staleTime,
    ).toBe(5_000);
  });
});
