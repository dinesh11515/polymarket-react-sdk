import type {
  PublicActions,
  SecureActions,
  SecureClient,
} from '@polymarket/client';

type PolymarketSecureClient = SecureClient<PublicActions, SecureActions>;

export function requireSecureClient(
  secureClient: PolymarketSecureClient | undefined,
): PolymarketSecureClient {
  if (!secureClient) {
    throw new Error(
      'Secure client is required. Connect with useConnectPolymarket first.',
    );
  }

  return secureClient;
}
