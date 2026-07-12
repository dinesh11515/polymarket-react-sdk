import type {
  FetchPortfolioValueError,
  PublicActions,
  SecureActions,
  SecureClient,
  SecureFetchPortfolioValueRequest,
  Value,
} from '@polymarket/client';
import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { polymarketKeys } from '../keys.js';

type PolymarketSecureClient = SecureClient<PublicActions, SecureActions>;

export type FetchPortfolioValueQueryOptions = {
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number | false;
};

export function fetchPortfolioValueQueryOptions(
  secureClient: PolymarketSecureClient | undefined,
  parameters: SecureFetchPortfolioValueRequest = {},
  options: { query?: FetchPortfolioValueQueryOptions } = {},
): UseQueryOptions<
  Value[],
  FetchPortfolioValueError,
  Value[],
  ReturnType<typeof polymarketKeys.account.portfolioValue>
> {
  const { enabled = true, ...queryOptions } = options.query ?? {};

  return {
    queryKey: polymarketKeys.account.portfolioValue(parameters),
    queryFn: async () => {
      if (!secureClient) {
        throw new Error('Secure client is required.');
      }

      return secureClient.fetchPortfolioValue(parameters);
    },
    ...queryOptions,
    enabled: secureClient !== undefined && enabled,
  };
}

export type FetchPortfolioValueQueryResult = UseQueryResult<
  Value[],
  FetchPortfolioValueError
>;
