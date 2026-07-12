'use client';

import type {
  FetchPortfolioValueError,
  SecureFetchPortfolioValueRequest,
  Value,
} from '@polymarket/client';
import type { FetchPortfolioValueQueryOptions } from '../../query/account/fetchPortfolioValue.js';
import { fetchPortfolioValueQueryOptions } from '../../query/account/fetchPortfolioValue.js';
import type { UseQueryReturnType } from '../../utils/query.js';
import { useQuery } from '../../utils/query.js';
import { useOptionalSecureClient } from '../../viem/hooks/useOptionalSecureClient.js';

export type UsePortfolioValueParameters = SecureFetchPortfolioValueRequest;

export type UsePortfolioValueOptions = {
  query?: FetchPortfolioValueQueryOptions;
};

export type UsePortfolioValueReturnType = UseQueryReturnType<
  Value[],
  FetchPortfolioValueError
>;

/**
 * Fetches portfolio value for the authenticated Polymarket account.
 *
 * @throws {@link FetchPortfolioValueError}
 * Thrown on failure.
 *
 * @example
 * ```ts
 * const { data: portfolioValue } = usePortfolioValue();
 * ```
 */
export function usePortfolioValue(
  parameters: UsePortfolioValueParameters = {},
  options: UsePortfolioValueOptions = {},
): UsePortfolioValueReturnType {
  const secureClient = useOptionalSecureClient();
  return useQuery(
    fetchPortfolioValueQueryOptions(secureClient, parameters, options),
  );
}
