import { useEvents } from 'polymarket-react-sdk';

type EventListProps = {
  onSelectMarket: (slug: string) => void;
};

export function EventList({ onSelectMarket }: EventListProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useEvents({
    closed: false,
    pageSize: 8,
  });

  const events = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <section className='panel event-list'>
      <div className='panel-header'>
        <h2>Events</h2>
        <span className='badge'>{events.length} loaded</span>
      </div>

      {isLoading ? <p className='status'>Loading events…</p> : null}
      {isError ? (
        <p className='status status--error'>
          {error instanceof Error ? error.message : 'Failed to load events'}
        </p>
      ) : null}

      <ul className='market-list__items'>
        {events.map((event) => {
          const firstMarket = event.markets?.[0];
          const slug = firstMarket?.slug;
          if (!slug) return null;

          return (
            <li key={event.id ?? slug}>
              <button
                type='button'
                className='market-card'
                onClick={() => onSelectMarket(slug)}
              >
                <span className='market-card__question'>
                  {event.title ?? slug}
                </span>
                <span className='market-card__price'>
                  {event.markets?.length ?? 0} markets
                </span>
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
          {isFetchingNextPage ? 'Loading…' : 'Load more events'}
        </button>
      ) : null}
    </section>
  );
}
