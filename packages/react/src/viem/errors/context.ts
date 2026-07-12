export class PolymarketViemProviderNotFoundError extends Error {
  override name = 'PolymarketViemProviderNotFoundError';

  constructor() {
    super(
      '`PolymarketWagmiProvider` not found. Wrap your app with `PolymarketWagmiProvider` from `polymarket-react-sdk/viem`.',
    );
  }
}

export type PolymarketViemProviderNotFoundErrorType =
  typeof PolymarketViemProviderNotFoundError;
