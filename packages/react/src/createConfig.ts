import type {
  ApiKeyAuthorization,
  EnvironmentConfig,
  PublicActions,
  PublicClient,
  SecureActions,
} from '@polymarket/client';
import { createPublicClient } from '@polymarket/client';

export type PolymarketPublicClient = PublicClient<PublicActions, SecureActions>;

export type PolymarketConfig = {
  readonly publicClient: PolymarketPublicClient;
  readonly environment?: EnvironmentConfig;
  readonly apiKey?: ApiKeyAuthorization;
};

export type CreatePolymarketConfigParameters = {
  environment?: EnvironmentConfig;
  apiKey?: ApiKeyAuthorization;
  publicClient?: PolymarketPublicClient;
};

/**
 * Creates a Polymarket config for use with {@link PolymarketProvider}.
 *
 * @example
 * ```ts
 * const config = createPolymarketConfig();
 * ```
 */
export function createPolymarketConfig(
  parameters: CreatePolymarketConfigParameters = {},
): PolymarketConfig {
  const publicClient =
    parameters.publicClient ??
    createPublicClient({
      environment: parameters.environment,
      apiKey: parameters.apiKey,
    });

  return {
    publicClient,
    environment: parameters.environment,
    apiKey: parameters.apiKey,
  };
}
