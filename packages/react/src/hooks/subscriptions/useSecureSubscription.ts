'use client';

import type {
  EventForSubscriptionSpecs,
  SecureSubscriptionSpec,
} from '@polymarket/client/actions';
import {
  type UseSubscriptionCoreReturnType,
  useSubscriptionCore,
} from '../../subscriptions/useSubscriptionCore.js';
import { useOptionalSecureClient } from '../../viem/hooks/useOptionalSecureClient.js';

export type UseSecureSubscriptionParameters<
  TSubscriptions extends readonly SecureSubscriptionSpec[],
> = TSubscriptions;

export type UseSecureSubscriptionOptions<
  TSubscriptions extends readonly SecureSubscriptionSpec[],
> = {
  enabled?: boolean;
  onEvent?: (event: EventForSubscriptionSpecs<TSubscriptions>) => void;
};

export type UseSecureSubscriptionReturnType<
  TSubscriptions extends readonly SecureSubscriptionSpec[],
> = UseSubscriptionCoreReturnType<EventForSubscriptionSpecs<TSubscriptions>>;

/**
 * Subscribes to authenticated Polymarket realtime topics, including user streams.
 *
 * @throws {@link SubscribeError}
 * Thrown when the subscription cannot be established.
 *
 * @example
 * ```ts
 * useSecureSubscription(
 *   [{ topic: 'user' }],
 *   {
 *     enabled: isAuthenticated,
 *     onEvent: (event) => console.log(event),
 *   },
 * );
 * ```
 */
export function useSecureSubscription<
  const TSubscriptions extends readonly SecureSubscriptionSpec[],
>(
  subscriptions: UseSecureSubscriptionParameters<TSubscriptions>,
  options: UseSecureSubscriptionOptions<TSubscriptions> = {},
): UseSecureSubscriptionReturnType<TSubscriptions> {
  const secureClient = useOptionalSecureClient();

  return useSubscriptionCore({
    client: secureClient,
    subscriptions,
    enabled: options.enabled,
    onEvent: options.onEvent,
  });
}
