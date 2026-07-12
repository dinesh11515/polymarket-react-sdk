'use client';

import type {
  EventForSubscriptionSpecs,
  PublicSubscriptionSpec,
} from '@polymarket/client/actions';
import {
  type UseSubscriptionCoreReturnType,
  useSubscriptionCore,
} from '../../subscriptions/useSubscriptionCore.js';
import type { UseConfigParameters } from '../useConfig.js';
import { useConfig } from '../useConfig.js';

export type UseSubscriptionParameters<
  TSubscriptions extends readonly PublicSubscriptionSpec[],
> = TSubscriptions;

export type UseSubscriptionOptions<
  TSubscriptions extends readonly PublicSubscriptionSpec[],
> = UseConfigParameters & {
  enabled?: boolean;
  onEvent?: (event: EventForSubscriptionSpecs<TSubscriptions>) => void;
};

export type UseSubscriptionReturnType<
  TSubscriptions extends readonly PublicSubscriptionSpec[],
> = UseSubscriptionCoreReturnType<EventForSubscriptionSpecs<TSubscriptions>>;

/**
 * Subscribes to public Polymarket realtime topics.
 *
 * @throws {@link SubscribeError}
 * Thrown when the subscription cannot be established.
 *
 * @example
 * ```ts
 * useSubscription(
 *   [{ topic: 'market', tokenIds: [tokenId] }],
 *   {
 *     enabled: Boolean(tokenId),
 *     onEvent: (event) => console.log(event),
 *   },
 * );
 * ```
 */
export function useSubscription<
  const TSubscriptions extends readonly PublicSubscriptionSpec[],
>(
  subscriptions: UseSubscriptionParameters<TSubscriptions>,
  options: UseSubscriptionOptions<TSubscriptions> = {},
): UseSubscriptionReturnType<TSubscriptions> {
  const config = useConfig(options);

  return useSubscriptionCore({
    client: config.publicClient,
    subscriptions,
    enabled: options.enabled,
    onEvent: options.onEvent,
  });
}
