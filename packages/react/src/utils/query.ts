import type {
  DefaultError,
  QueryKey,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import {
  useInfiniteQuery as useTanstackInfiniteQuery,
  useMutation as useTanstackMutation,
  useQuery as useTanstackQuery,
} from '@tanstack/react-query';

export type UseQueryReturnType<
  data = unknown,
  error = DefaultError,
> = UseQueryResult<data, error> & {
  queryKey: QueryKey;
};

export type UseInfiniteQueryReturnType<
  data = unknown,
  error = DefaultError,
> = UseInfiniteQueryResult<data, error> & {
  queryKey: QueryKey;
};

export function useQuery<queryFnData, error, data, queryKey extends QueryKey>(
  parameters: UseQueryOptions<queryFnData, error, data, queryKey> & {
    queryKey: queryKey;
  },
): UseQueryReturnType<data, error> {
  const result = useTanstackQuery(parameters);
  return {
    ...result,
    queryKey: parameters.queryKey,
  };
}

export function useInfiniteQuery<
  queryFnData,
  error,
  data,
  queryKey extends QueryKey,
  pageParam,
>(
  parameters: UseInfiniteQueryOptions<
    queryFnData,
    error,
    data,
    queryKey,
    pageParam
  > & {
    queryKey: queryKey;
  },
): UseInfiniteQueryReturnType<data, error> {
  const result = useTanstackInfiniteQuery(parameters);
  return {
    ...result,
    queryKey: parameters.queryKey,
  };
}

export type UseMutationReturnType<
  data = unknown,
  error = DefaultError,
  variables = void,
  context = unknown,
> = UseMutationResult<data, error, variables, context>;

export function usePolymarketMutation<
  data = unknown,
  error = DefaultError,
  variables = void,
  context = unknown,
>(
  parameters: UseMutationOptions<data, error, variables, context>,
): UseMutationReturnType<data, error, variables, context> {
  return useTanstackMutation(parameters);
}
