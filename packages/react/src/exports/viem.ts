export {
  type Activity,
  CancelOrderError,
  CancelOrdersError,
  type CancelOrdersResponse,
  FetchPortfolioValueError,
  ListActivityError,
  ListOpenOrdersError,
  ListPositionsError,
  type OpenOrder,
  type OrderResponse,
  PlaceLimitOrderError,
  PlaceMarketOrderError,
  type Position,
  type SecureListActivityRequest,
  SetupTradingApprovalsError,
  type Value,
} from '@polymarket/client';
export type {
  SecureRealtimeEvent,
  SecureSubscriptionSpec,
  SubscribeError,
  UserSubscription,
} from '@polymarket/client/actions';
export {
  type UseActivityOptions,
  type UseActivityParameters,
  type UseActivityReturnType,
  useActivity,
} from '../hooks/account/useActivity.js';
export {
  type UseOpenOrdersOptions,
  type UseOpenOrdersParameters,
  type UseOpenOrdersReturnType,
  useOpenOrders,
} from '../hooks/account/useOpenOrders.js';
export {
  type UsePortfolioValueOptions,
  type UsePortfolioValueParameters,
  type UsePortfolioValueReturnType,
  usePortfolioValue,
} from '../hooks/account/usePortfolioValue.js';
export {
  type UsePositionsOptions,
  type UsePositionsParameters,
  type UsePositionsReturnType,
  usePositions,
} from '../hooks/account/usePositions.js';
export {
  type UseSecureSubscriptionOptions,
  type UseSecureSubscriptionParameters,
  type UseSecureSubscriptionReturnType,
  useSecureSubscription,
} from '../hooks/subscriptions/useSecureSubscription.js';
export {
  type UseCancelOrderOptions,
  type UseCancelOrderParameters,
  type UseCancelOrderReturnType,
  useCancelOrder,
} from '../hooks/trading/useCancelOrder.js';
export {
  type UseCancelOrdersOptions,
  type UseCancelOrdersParameters,
  type UseCancelOrdersReturnType,
  useCancelOrders,
} from '../hooks/trading/useCancelOrders.js';
export {
  type UsePlaceLimitOrderOptions,
  type UsePlaceLimitOrderParameters,
  type UsePlaceLimitOrderReturnType,
  usePlaceLimitOrder,
} from '../hooks/trading/usePlaceLimitOrder.js';
export {
  type UsePlaceMarketOrderOptions,
  type UsePlaceMarketOrderParameters,
  type UsePlaceMarketOrderReturnType,
  usePlaceMarketOrder,
} from '../hooks/trading/usePlaceMarketOrder.js';
export {
  type UseSetupTradingApprovalsOptions,
  type UseSetupTradingApprovalsReturnType,
  useSetupTradingApprovals,
} from '../hooks/trading/useSetupTradingApprovals.js';
export {
  PolymarketWagmiProvider,
  type PolymarketWagmiProviderProps,
} from '../viem/context.js';
export { PolymarketViemContext } from '../viem/contextValue.js';
export {
  type CreatePolymarketWagmiConfigParameters,
  createPolymarketWagmiConfig,
} from '../viem/createWagmiConfig.js';
export {
  PolymarketViemProviderNotFoundError,
  type PolymarketViemProviderNotFoundErrorType,
} from '../viem/errors/context.js';
export {
  type UseConnectPolymarketParameters,
  type UseConnectPolymarketReturnType,
  useConnectPolymarket,
} from '../viem/hooks/useConnectPolymarket.js';
export {
  type UseDisconnectPolymarketReturnType,
  useDisconnectPolymarket,
} from '../viem/hooks/useDisconnectPolymarket.js';
export {
  type UsePolymarketConnectionReturnType,
  usePolymarketConnection,
} from '../viem/hooks/usePolymarketConnection.js';
export {
  type UseSecureClientReturnType,
  useSecureClient,
} from '../viem/hooks/useSecureClient.js';
export type {
  ConnectPolymarketParameters,
  PolymarketConnectionState,
  PolymarketConnectionStatus,
  PolymarketSecureClient,
  PolymarketSecureClientParameters,
  PolymarketViemContextValue,
} from '../viem/types.js';
