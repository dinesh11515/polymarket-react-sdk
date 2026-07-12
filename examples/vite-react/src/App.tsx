import { useState } from 'react';
import { EventList } from './components/EventList.js';
import { MarketDetail } from './components/MarketDetail.js';
import { MarketList } from './components/MarketList.js';
import { OrderBookPanel } from './components/OrderBookPanel.js';
import { SearchPanel } from './components/SearchPanel.js';
import { TradePanel } from './components/TradePanel.js';
import { AppProviders, WalletPanel } from './components/WalletPanel.js';

export function App() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  return (
    <AppProviders>
      <div className='app'>
        <header className='app-header'>
          <div>
            <p className='eyebrow'>polymarket-react-sdk</p>
            <h1>Polymarket React SDK Demo</h1>
          </div>
          <p className='app-header__copy'>
            Public market data plus wallet-authenticated positions via{' '}
            <code>polymarket-react-sdk/viem</code>.
          </p>
        </header>

        <main className='app-layout app-layout--with-wallet'>
          <div className='sidebar-column'>
            <SearchPanel onSelectMarket={setSelectedSlug} />
            <MarketList
              selectedSlug={selectedSlug}
              onSelect={setSelectedSlug}
            />
            <EventList onSelectMarket={setSelectedSlug} />
          </div>

          <section className='detail-column'>
            <WalletPanel />

            {selectedSlug ? (
              <>
                <MarketDetail slug={selectedSlug} />
                <OrderBookPanel slug={selectedSlug} />
                <TradePanel slug={selectedSlug} />
              </>
            ) : (
              <div className='panel empty-state'>
                <h2>Select a market</h2>
                <p>Choose an open market from the list to inspect details.</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </AppProviders>
  );
}
