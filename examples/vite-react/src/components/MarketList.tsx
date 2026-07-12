import { useMarkets } from 'polymarket-react-sdk';
import { useEffect } from 'react';

type MarketListProps = {
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
};

export function MarketList({ selectedSlug, onSelect }: MarketListProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useMarkets({
    closed: false,
    pageSize: 12,
  });

  const markets = data?.pages.flatMap((page) => page.items) ?? [];

  useEffect(() => {
    if (!selectedSlug && markets[0]?.slug) {
      onSelect(markets[0].slug);
    }
  }, [markets, onSelect, selectedSlug]);

  return (
    <aside className='panel market-list'>
      <div className='panel-header'>
        <h2>Open markets</h2>
        <span className='badge'>{markets.length} loaded</span>
      </div>

      {isLoading ? <p className='status'>Loading markets…</p> : null}
      {isError ? (
        <p className='status status--error'>
          {error instanceof Error ? error.message : 'Failed to load markets'}
        </p>
      ) : null}

      <ul className='market-list__items'>
        {markets.map((market) => {
          const slug = market.slug;
          if (!slug) return null;

          const yesPrice = market.outcomes?.yes?.price;
          const isSelected = slug === selectedSlug;

          return (
            <li key={slug}>
              <button
                type='button'
                className={
                  isSelected ? 'market-card market-card--active' : 'market-card'
                }
                onClick={() => onSelect(slug)}
              >
                <span className='market-card__question'>
                  {market.question ?? slug}
                </span>
                {yesPrice ? (
                  <span className='market-card__price'>
                    Yes {formatPercent(yesPrice)}
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>

      {hasNextPage ? (
        <button
          type='button'
          className='button button--secondary'
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage ? 'Loading…' : 'Load more'}
        </button>
      ) : null}
    </aside>
  );
}

function formatPercent(value: string): string {
  const numeric = Number.parseFloat(value);
  if (Number.isNaN(numeric)) return value;
  return `${Math.round(numeric * 100)}¢`;
}
