import { useSearch } from 'polymarket-react-sdk';
import { useState } from 'react';

type SearchPanelProps = {
  onSelectMarket: (slug: string) => void;
};

export function SearchPanel({ onSelectMarket }: SearchPanelProps) {
  const [query, setQuery] = useState('');
  const trimmedQuery = query.trim();

  const { data, isFetching, isError, error } = useSearch(
    { q: trimmedQuery, pageSize: 8 },
    { query: { enabled: trimmedQuery.length >= 2 } },
  );

  const events = data?.pages.flatMap((page) => page.items.events ?? []) ?? [];

  return (
    <section className='panel search-panel'>
      <div className='panel-header'>
        <h2>Search</h2>
      </div>

      <input
        type='search'
        className='search-input'
        placeholder='Search events…'
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      {trimmedQuery.length >= 2 && isFetching ? (
        <p className='status'>Searching…</p>
      ) : null}
      {isError ? (
        <p className='status status--error'>
          {error instanceof Error ? error.message : 'Search failed'}
        </p>
      ) : null}

      {trimmedQuery.length >= 2 && events.length > 0 ? (
        <ul className='market-list__items search-results'>
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
                  {firstMarket.question ? (
                    <span className='market-card__price'>
                      {firstMarket.question}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      {trimmedQuery.length >= 2 && !isFetching && events.length === 0 ? (
        <p className='status'>No events found.</p>
      ) : null}
    </section>
  );
}
