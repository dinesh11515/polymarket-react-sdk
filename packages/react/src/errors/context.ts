export class PolymarketProviderNotFoundError extends Error {
  override name = 'PolymarketProviderNotFoundError' as const;

  constructor() {
    super(
      '`PolymarketProvider` not found. Wrap your app with `PolymarketProvider`.',
    );
  }
}

export type PolymarketProviderNotFoundErrorType =
  typeof PolymarketProviderNotFoundError;
