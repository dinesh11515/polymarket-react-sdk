import type {
  SecureFetchPortfolioValueRequest,
  SecureListActivityRequest,
  SecureListPositionsRequest,
} from '@polymarket/client';
import type {
  FetchPriceRequest,
  FetchPricesRequest,
  ListActivityRequest,
  ListEventsRequest,
  ListMarketsRequest,
  ListOpenOrdersRequest,
  SearchRequest,
} from '@polymarket/client/actions';

export const polymarketKeys = {
  all: ['polymarket'] as const,
  discovery: {
    all: () => [...polymarketKeys.all, 'discovery'] as const,
    markets: (parameters: ListMarketsRequest) =>
      [...polymarketKeys.discovery.all(), 'markets', parameters] as const,
    market: (parameters: MarketQueryKeyInput) =>
      [...polymarketKeys.discovery.all(), 'market', parameters] as const,
    events: (parameters: ListEventsRequest) =>
      [...polymarketKeys.discovery.all(), 'events', parameters] as const,
    event: (parameters: EventQueryKeyInput) =>
      [...polymarketKeys.discovery.all(), 'event', parameters] as const,
    search: (parameters: SearchRequest) =>
      [...polymarketKeys.discovery.all(), 'search', parameters] as const,
  },
  data: {
    all: () => [...polymarketKeys.all, 'data'] as const,
    orderBook: (parameters: OrderBookQueryKeyInput) =>
      [...polymarketKeys.data.all(), 'orderBook', parameters] as const,
    price: (parameters: FetchPriceRequest) =>
      [...polymarketKeys.data.all(), 'price', parameters] as const,
    prices: (parameters: FetchPricesRequest) =>
      [...polymarketKeys.data.all(), 'prices', parameters] as const,
  },
  account: {
    all: () => [...polymarketKeys.all, 'account'] as const,
    positionsAll: () => [...polymarketKeys.account.all(), 'positions'] as const,
    positions: (parameters: SecureListPositionsRequest = {}) =>
      [...polymarketKeys.account.all(), 'positions', parameters] as const,
    openOrdersAll: () =>
      [...polymarketKeys.account.all(), 'openOrders'] as const,
    openOrders: (parameters: ListOpenOrdersRequest = {}) =>
      [...polymarketKeys.account.all(), 'openOrders', parameters] as const,
    portfolioValueAll: () =>
      [...polymarketKeys.account.all(), 'portfolioValue'] as const,
    portfolioValue: (parameters: SecureFetchPortfolioValueRequest = {}) =>
      [...polymarketKeys.account.all(), 'portfolioValue', parameters] as const,
    activityAll: () => [...polymarketKeys.account.all(), 'activity'] as const,
    activity: (parameters: SecureListActivityRequest = {}) =>
      [...polymarketKeys.account.all(), 'activity', parameters] as const,
    walletActivityAll: () =>
      [...polymarketKeys.account.all(), 'walletActivity'] as const,
    walletActivity: (parameters: ListActivityRequest) =>
      [...polymarketKeys.account.all(), 'walletActivity', parameters] as const,
  },
};

export type MarketQueryKeyInput = {
  id?: string;
  slug?: string;
  url?: string;
};

export type EventQueryKeyInput = {
  id?: string;
  slug?: string;
  url?: string;
};

export type OrderBookQueryKeyInput = {
  tokenId: string;
};
