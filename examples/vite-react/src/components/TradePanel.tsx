import { OrderSide } from '@polymarket/client';
import { useQueryClient } from '@tanstack/react-query';
import { useMarket } from 'polymarket-react-sdk';
import { polymarketKeys } from 'polymarket-react-sdk/query';
import {
  useCancelOrder,
  useOpenOrders,
  usePlaceMarketOrder,
  usePolymarketConnection,
  useSecureSubscription,
  useSetupTradingApprovals,
} from 'polymarket-react-sdk/viem';

type TradePanelProps = {
  slug: string;
};

export function TradePanel({ slug }: TradePanelProps) {
  const queryClient = useQueryClient();
  const { isAuthenticated } = usePolymarketConnection();
  const { data: market } = useMarket({ slug });
  const tokenId = market?.outcomes?.yes?.tokenId;

  useSecureSubscription([{ topic: 'user' }], {
    enabled: isAuthenticated,
    onEvent: () => {
      // A fill changes open orders, positions, AND portfolio value.
      void queryClient.invalidateQueries({
        queryKey: polymarketKeys.account.all(),
      });
    },
  });

  const {
    mutate: setupTradingApprovals,
    isPending: isSettingUpApprovals,
    error: approvalsError,
  } = useSetupTradingApprovals();
  const {
    mutate: placeMarketOrder,
    isPending: isPlacingOrder,
    data: orderResponse,
    error: orderError,
  } = usePlaceMarketOrder();
  const {
    mutate: cancelOrder,
    isPending: isCancellingOrder,
    error: cancelError,
  } = useCancelOrder();
  const {
    data,
    isLoading,
    isError: isOpenOrdersError,
    error: openOrdersError,
  } = useOpenOrders({}, { query: { enabled: isAuthenticated } });

  const openOrders = data?.pages.flatMap((page) => page.items) ?? [];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <section className='panel trade-panel'>
      <div className='panel-header'>
        <h2>Trading</h2>
      </div>

      <div className='wallet-panel__actions'>
        <button
          type='button'
          className='button button--secondary'
          disabled={isSettingUpApprovals}
          onClick={() => {
            const confirmed = window.confirm(
              'This grants on-chain token approvals to the Polymarket exchange contracts. Continue?',
            );
            if (!confirmed) return;
            setupTradingApprovals();
          }}
        >
          {isSettingUpApprovals ? 'Setting up…' : 'Setup approvals'}
        </button>

        <button
          type='button'
          className='button button--secondary'
          disabled={!tokenId || isPlacingOrder}
          onClick={() => {
            if (!tokenId) return;
            const confirmed = window.confirm(
              'This places a REAL $1 market order with your funds on Polygon mainnet. Continue?',
            );
            if (!confirmed) return;
            placeMarketOrder({
              tokenId,
              side: OrderSide.BUY,
              amount: 1,
            });
          }}
        >
          {isPlacingOrder ? 'Placing…' : 'Buy $1 market (demo)'}
        </button>
      </div>

      <p className='status'>⚠️ Demo trades use real funds on Polygon mainnet.</p>

      {approvalsError ? (
        <p className='status status--error'>
          Approvals failed: {approvalsError.message}
        </p>
      ) : null}
      {orderError ? (
        <p className='status status--error'>
          Order failed: {orderError.message}
        </p>
      ) : null}
      {orderResponse && !orderResponse.ok ? (
        <p className='status status--error'>
          Order rejected ({orderResponse.code}): {orderResponse.message}
        </p>
      ) : null}
      {orderResponse?.ok ? (
        <p className='status'>
          Order placed: {orderResponse.orderId} ({orderResponse.status})
        </p>
      ) : null}
      {cancelError ? (
        <p className='status status--error'>
          Cancel failed: {cancelError.message}
        </p>
      ) : null}

      <h3 className='wallet-panel__subtitle'>Open orders</h3>
      {isLoading ? <p className='status'>Loading open orders…</p> : null}
      {isOpenOrdersError ? (
        <p className='status status--error'>
          Failed to load open orders
          {openOrdersError instanceof Error
            ? `: ${openOrdersError.message}`
            : ''}
          {' — your live exposure may not be shown.'}
        </p>
      ) : null}
      {openOrders.length > 0 ? (
        <ul className='positions-list'>
          {openOrders.map((order) => (
            <li key={order.id}>
              <span>
                {order.side} {order.originalSize} @ {order.price}
              </span>
              <button
                type='button'
                className='button button--secondary button--compact'
                disabled={isCancellingOrder}
                onClick={() => cancelOrder({ orderId: order.id })}
              >
                Cancel
              </button>
            </li>
          ))}
        </ul>
      ) : (
        !isLoading &&
        !isOpenOrdersError && <p className='status'>No open orders.</p>
      )}
    </section>
  );
}
