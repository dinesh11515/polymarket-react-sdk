import type {
  AccountIdentity,
  ApiKeyCreds,
  PublicActions,
  SecureActions,
  SecureClient,
} from '@polymarket/client';
import type { Connector } from 'wagmi';

export type PolymarketSecureClient = SecureClient<PublicActions, SecureActions>;

export type PolymarketSecureClientParameters = {
  wallet?: string;
  credentials?: ApiKeyCreds;
  nonce?: number;
};

export type PolymarketConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'authenticating'
  | 'connected'
  | 'error';

export type ConnectPolymarketParameters = {
  connector: Connector;
};

export type PolymarketViemContextValue = {
  status: PolymarketConnectionStatus;
  secureClient: PolymarketSecureClient | undefined;
  account: AccountIdentity | undefined;
  error: Error | undefined;
  isConnected: boolean;
  isAuthenticated: boolean;
  connectPolymarket: (parameters: ConnectPolymarketParameters) => Promise<void>;
  disconnectPolymarket: () => Promise<void>;
};

export type PolymarketConnectionState = {
  status: PolymarketConnectionStatus;
  secureClient: PolymarketSecureClient | undefined;
  account: AccountIdentity | undefined;
  error: Error | undefined;
  isConnected: boolean;
  isAuthenticated: boolean;
};
