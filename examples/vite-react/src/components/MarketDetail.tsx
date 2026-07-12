import type { Market } from '@polymarket/client';
import { useMarket } from 'polymarket-react-sdk';

type MarketDetailProps = {
  slug: string;
};

export function MarketDetail({ slug }: MarketDetailProps) {
  const { data: market, isLoading, isError, error } = useMarket({ slug });

  if (isLoading) {
    return (
      <section className='panel'>
        <p className='status'>Loading market…</p>
      </section>
    );
  }

  if (isError || !market) {
    return (
      <section className='panel'>
        <p className='status status--error'>
          {error instanceof Error ? error.message : 'Failed to load market'}
        </p>
      </section>
    );
  }

  const yes = market.outcomes?.yes;
  const no = market.outcomes?.no;

  return (
    <section className='panel market-detail'>
      <div className='panel-header'>
        <h2>{market.question ?? market.slug ?? market.id}</h2>
      </div>

      {market.description ? (
        <p className='market-detail__description'>{market.description}</p>
      ) : null}

      <dl className='stat-grid'>
        <div>
          <dt>Slug</dt>
          <dd>{market.slug ?? '—'}</dd>
        </div>
        <div>
          <dt>State</dt>
          <dd>{formatState(market.state)}</dd>
        </div>
        <div>
          <dt>Volume</dt>
          <dd>
            {formatUsd(market.metrics?.volumeNum ?? market.metrics?.volume)}
          </dd>
        </div>
        <div>
          <dt>Liquidity</dt>
          <dd>
            {formatUsd(
              market.metrics?.liquidityNum ?? market.metrics?.liquidity,
            )}
          </dd>
        </div>
      </dl>

      <div className='outcome-row'>
        {yes ? (
          <div className='outcome-chip outcome-chip--yes'>
            <span>{yes.label ?? 'Yes'}</span>
            <strong>{formatPercent(yes.price)}</strong>
          </div>
        ) : null}
        {no ? (
          <div className='outcome-chip outcome-chip--no'>
            <span>{no.label ?? 'No'}</span>
            <strong>{formatPercent(no.price)}</strong>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function formatState(state: Market['state']): string {
  if (!state) return '—';
  if (state.closed) return 'Closed';
  if (state.active) return 'Active';
  if (state.acceptingOrders) return 'Accepting orders';
  return '—';
}

function formatPercent(value: string | null | undefined): string {
  if (!value) return '—';
  const numeric = Number.parseFloat(value);
  if (Number.isNaN(numeric)) return value;
  return `${Math.round(numeric * 100)}¢`;
}

function formatUsd(value: string | number | null | undefined): string {
  if (value === undefined || value === null || value === '') return '—';
  const numeric = typeof value === 'number' ? value : Number.parseFloat(value);
  if (Number.isNaN(numeric)) return String(value);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(numeric);
}
