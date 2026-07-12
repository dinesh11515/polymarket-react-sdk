import { OrderSide } from '@polymarket/client';
import { useQueryClient } from '@tanstack/react-query';
import {
  useMarket,
  useOrderBook,
  usePrice,
  useSubscription,
} from 'polymarket-react-sdk';
import { polymarketKeys } from 'polymarket-react-sdk/query';
import { useMemo, useState } from 'react';

type OutcomeSide = 'yes' | 'no';

type OrderBookPanelProps = {
  slug: string;
};

export function OrderBookPanel({ slug }: OrderBookPanelProps) {
  const queryClient = useQueryClient();
  const [side, setSide] = useState<OutcomeSide>('yes');
  const { data: market, isLoading: isMarketLoading } = useMarket({ slug });

  const tokenId =
    side === 'yes'
      ? market?.outcomes?.yes?.tokenId
      : market?.outcomes?.no?.tokenId;

  const subscriptions = useMemo(
    () =>
      tokenId
        ? ([{ topic: 'market', tokenIds: [tokenId] }] as const)
        : ([] as const),
    [tokenId],
  );

  const { isConnected } = useSubscription(subscriptions, {
    enabled: Boolean(tokenId),
    onEvent: () => {
      if (!tokenId) return;

      void queryClient.invalidateQueries({
        queryKey: polymarketKeys.data.orderBook({ tokenId }),
      });
      void queryClient.invalidateQueries({
        queryKey: polymarketKeys.data.price({
          tokenId,
          side: OrderSide.BUY,
        }),
      });
      void queryClient.invalidateQueries({
        queryKey: polymarketKeys.data.price({
          tokenId,
          side: OrderSide.SELL,
        }),
      });
    },
  });

  const {
    data: orderBook,
    isLoading: isOrderBookLoading,
    isError,
    error,
  } = useOrderBook(
    { tokenId: tokenId ?? '' },
    {
      query: {
        enabled: Boolean(tokenId),
      },
    },
  );

  const { data: buyPrice } = usePrice(
    { tokenId: tokenId ?? '', side: OrderSide.BUY },
    {
      query: {
        enabled: Boolean(tokenId),
      },
    },
  );

  const { data: sellPrice } = usePrice(
    { tokenId: tokenId ?? '', side: OrderSide.SELL },
    {
      query: {
        enabled: Boolean(tokenId),
      },
    },
  );

  const isLoading = isMarketLoading || (Boolean(tokenId) && isOrderBookLoading);

  return (
    <section className='panel order-book'>
      <div className='panel-header'>
        <h2>Order book</h2>
        <div className='panel-header__meta'>
          {isConnected ? <span className='badge badge--live'>Live</span> : null}
          <fieldset className='segmented-control'>
            <legend className='sr-only'>Outcome</legend>
            <button
              type='button'
              className={side === 'yes' ? 'segment segment--active' : 'segment'}
              onClick={() => setSide('yes')}
            >
              Yes
            </button>
            <button
              type='button'
              className={side === 'no' ? 'segment segment--active' : 'segment'}
              onClick={() => setSide('no')}
            >
              No
            </button>
          </fieldset>
        </div>
      </div>

      {buyPrice || sellPrice ? (
        <dl className='stat-grid price-strip'>
          <div>
            <dt>Buy</dt>
            <dd>{buyPrice ? formatPercent(buyPrice) : '—'}</dd>
          </div>
          <div>
            <dt>Sell</dt>
            <dd>{sellPrice ? formatPercent(sellPrice) : '—'}</dd>
          </div>
        </dl>
      ) : null}

      {isLoading ? <p className='status'>Loading order book…</p> : null}
      {isError ? (
        <p className='status status--error'>
          {error instanceof Error ? error.message : 'Failed to load order book'}
        </p>
      ) : null}

      {orderBook ? (
        <div className='order-book__grid'>
          <OrderBookSide
            title='Bids'
            levels={orderBook.bids ?? []}
            tone='bid'
          />
          <OrderBookSide
            title='Asks'
            levels={orderBook.asks ?? []}
            tone='ask'
          />
        </div>
      ) : null}
    </section>
  );
}

type OrderLevel = {
  price: string;
  size: string;
};

type OrderBookSideProps = {
  title: string;
  levels: OrderLevel[];
  tone: 'bid' | 'ask';
};

function OrderBookSide({ title, levels, tone }: OrderBookSideProps) {
  const topLevels = levels.slice(0, 8);

  return (
    <div className='order-book-side'>
      <h3>{title}</h3>
      <table>
        <thead>
          <tr>
            <th>Price</th>
            <th>Size</th>
          </tr>
        </thead>
        <tbody>
          {topLevels.map((level) => (
            <tr
              key={`${tone}-${level.price}`}
              className={`level level--${tone}`}
            >
              <td>{formatPercent(level.price)}</td>
              <td>{formatSize(level.size)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatPercent(value: string): string {
  const numeric = Number.parseFloat(value);
  if (Number.isNaN(numeric)) return value;
  return `${Math.round(numeric * 100)}¢`;
}

function formatSize(value: string): string {
  const numeric = Number.parseFloat(value);
  if (Number.isNaN(numeric)) return value;
  return numeric.toLocaleString('en-US', { maximumFractionDigits: 2 });
}
