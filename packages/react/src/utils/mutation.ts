import type {
  DefaultError,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { useMutation as useTanstackMutation } from '@tanstack/react-query';

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
