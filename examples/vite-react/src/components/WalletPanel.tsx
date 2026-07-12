import { createPolymarketConfig } from 'polymarket-react-sdk';
import {
  type Activity,
  PolymarketWagmiProvider,
  useActivity,
  useConnectPolymarket,
  useDisconnectPolymarket,
  usePolymarketConnection,
  usePositions,
} from 'polymarket-react-sdk/viem';
import { useAccount, useConnectors } from 'wagmi';
import { wagmiConfig } from '../wagmi.js';

const polymarketConfig = createPolymarketConfig();

export function WalletPanel() {
  const { isConnected, isAuthenticated, status, account, address } =
    usePolymarketConnection();
  const { connectPolymarket, isPending, error } = useConnectPolymarket();
  const { disconnectPolymarket, isPending: isDisconnecting } =
    useDisconnectPolymarket();
  const { connector } = useAccount();
  const connectors = useConnectors();

  const {
    data,
    isLoading,
    isError,
    error: positionsError,
  } = usePositions({ pageSize: 5 }, { query: { enabled: isAuthenticated } });

  const {
    data: activityData,
    isLoading: isActivityLoading,
    isError: isActivityError,
    error: activityError,
  } = useActivity({ pageSize: 5 }, { query: { enabled: isAuthenticated } });

  const positions = data?.pages.flatMap((page) => page.items) ?? [];
  const activity = activityData?.pages.flatMap((page) => page.items) ?? [];

  return (
    <section className='panel wallet-panel'>
      <div className='panel-header'>
        <h2>Wallet</h2>
        <span className='badge'>{status}</span>
      </div>

      {isAuthenticated && account ? (
        <dl className='stat-grid'>
          <div>
            <dt>Signer</dt>
            <dd>{truncateAddress(account.signer)}</dd>
          </div>
          <div>
            <dt>Wallet</dt>
            <dd>{truncateAddress(account.wallet)}</dd>
          </div>
          <div>
            <dt>Type</dt>
            <dd>{account.walletType}</dd>
          </div>
          <div>
            <dt>Address</dt>
            <dd>{address ? truncateAddress(address) : '—'}</dd>
          </div>
        </dl>
      ) : (
        <p className='status'>
          Connect a wallet on Polygon to authenticate with Polymarket.
        </p>
      )}

      {error ? (
        <p className='status status--error'>
          {error instanceof Error ? error.message : 'Connection failed'}
        </p>
      ) : null}

      <div className='wallet-panel__actions'>
        {!isAuthenticated ? (
          isConnected && connector ? (
            <button
              type='button'
              className='button button--secondary'
              disabled={isPending}
              onClick={() => connectPolymarket({ connector })}
            >
              {isPending ? 'Authenticating…' : 'Authenticate with Polymarket'}
            </button>
          ) : (
            connectors.map((item) => (
              <button
                key={item.uid}
                type='button'
                className='button button--secondary'
                disabled={isPending}
                onClick={() => connectPolymarket({ connector: item })}
              >
                {isPending ? 'Connecting…' : `Connect ${item.name}`}
              </button>
            ))
          )
        ) : (
          <button
            type='button'
            className='button button--secondary'
            disabled={isDisconnecting}
            onClick={() => disconnectPolymarket()}
          >
            {isDisconnecting ? 'Disconnecting…' : 'Disconnect'}
          </button>
        )}
      </div>

      {isAuthenticated ? (
        <>
          <h3 className='wallet-panel__subtitle'>Your positions</h3>
          {isLoading ? <p className='status'>Loading positions…</p> : null}
          {isError ? (
            <p className='status status--error'>
              {positionsError instanceof Error
                ? positionsError.message
                : 'Failed to load positions'}
            </p>
          ) : null}
          {positions.length > 0 ? (
            <ul className='positions-list'>
              {positions.map((position) => (
                <li key={position.tokenId ?? position.conditionId}>
                  <span>{position.title ?? position.slug ?? 'Position'}</span>
                  <span>{position.size ?? '—'}</span>
                </li>
              ))}
            </ul>
          ) : (
            !isLoading && <p className='status'>No open positions.</p>
          )}

          <h3 className='wallet-panel__subtitle'>Recent activity</h3>
          {isActivityLoading ? (
            <p className='status'>Loading activity…</p>
          ) : null}
          {isActivityError ? (
            <p className='status status--error'>
              {activityError instanceof Error
                ? activityError.message
                : 'Failed to load activity'}
            </p>
          ) : null}
          {activity.length > 0 ? (
            <ul className='positions-list'>
              {activity.map((item, index) => (
                <li key={activityKey(item, index)}>
                  <span>{activityLabel(item)}</span>
                  <span>{activityValue(item)}</span>
                </li>
              ))}
            </ul>
          ) : (
            !isActivityLoading && <p className='status'>No recent activity.</p>
          )}
        </>
      ) : null}
    </section>
  );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <PolymarketWagmiProvider
      wagmiConfig={wagmiConfig}
      config={polymarketConfig}
    >
      {children}
    </PolymarketWagmiProvider>
  );
}

function truncateAddress(value: string): string {
  return `${value.slice(0, 6)}…${value.slice(-4)}`;
}

function activityKey(item: Activity, index: number): string {
  if ('transactionHash' in item && item.transactionHash) {
    return item.transactionHash;
  }
  return `${item.type}-${index}`;
}

function activityLabel(item: Activity): string {
  if ('title' in item && item.title) {
    return item.title;
  }
  return item.type;
}

function activityValue(item: Activity): string {
  if ('size' in item && item.size) {
    return String(item.size);
  }
  if ('usdcSize' in item && item.usdcSize) {
    return String(item.usdcSize);
  }
  if ('amount' in item && item.amount) {
    return String(item.amount);
  }
  return '—';
}
