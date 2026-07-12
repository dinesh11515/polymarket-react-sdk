'use client';

import type { SubscriptionHandle } from '@polymarket/client/actions';
import { useEffect, useRef, useState } from 'react';
import { runSubscriptionLoop } from './runSubscriptionLoop.js';
import type { SubscriptionStatus } from './types.js';

export type UseSubscriptionCoreReturnType<TEvent> = {
  status: SubscriptionStatus;
  latestEvent: TEvent | undefined;
  error: unknown;
  isConnected: boolean;
  isConnecting: boolean;
  isError: boolean;
};

type SubscribableClient<TSubscriptions> = {
  subscribe(
    subscriptions: TSubscriptions,
  ): Promise<SubscriptionHandle<unknown>>;
};

export type UseSubscriptionCoreParameters<TSubscriptions, TEvent> = {
  client: SubscribableClient<TSubscriptions> | undefined;
  subscriptions: TSubscriptions;
  enabled?: boolean;
  onEvent?: (event: TEvent) => void;
};

export function useSubscriptionCore<TSubscriptions, TEvent>({
  client,
  subscriptions,
  enabled = true,
  onEvent,
}: UseSubscriptionCoreParameters<
  TSubscriptions,
  TEvent
>): UseSubscriptionCoreReturnType<TEvent> {
  const [status, setStatus] = useState<SubscriptionStatus>('idle');
  const [latestEvent, setLatestEvent] = useState<TEvent>();
  const [error, setError] = useState<unknown>();

  const subscriptionsRef = useRef(subscriptions);
  subscriptionsRef.current = subscriptions;

  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const subscriptionsKey = stableStringify(subscriptions);
  const isEnabled =
    enabled &&
    client !== undefined &&
    Array.isArray(subscriptions) &&
    subscriptions.length > 0;

  // biome-ignore lint/correctness/useExhaustiveDependencies: subscriptionsKey tracks serialized spec changes
  useEffect(() => {
    if (!isEnabled || client === undefined) {
      setStatus('idle');
      setError(undefined);
      setLatestEvent(undefined);
      return;
    }

    const abortController = new AbortController();

    setStatus('connecting');
    setError(undefined);
    setLatestEvent(undefined);

    void runSubscriptionLoop({
      signal: abortController.signal,
      subscribe: () => client.subscribe(subscriptionsRef.current),
      onConnected: () => {
        if (!abortController.signal.aborted) {
          setStatus('connected');
        }
      },
      onEvent: (event) => {
        const typedEvent = event as TEvent;
        setLatestEvent(typedEvent);
        onEventRef.current?.(typedEvent);
      },
      onError: (unknownError) => {
        if (abortController.signal.aborted) {
          return;
        }

        setStatus('error');
        setError(unknownError);
      },
    }).finally(() => {
      if (!abortController.signal.aborted) {
        setStatus((current) => (current === 'error' ? current : 'closed'));
      }
    });

    return () => {
      abortController.abort();
      setStatus('idle');
    };
  }, [client, isEnabled, subscriptionsKey]);

  return {
    status,
    latestEvent,
    error,
    isConnected: status === 'connected',
    isConnecting: status === 'connecting',
    isError: status === 'error',
  };
}

/**
 * JSON.stringify with object keys sorted recursively, so specs that differ
 * only in property order do not trigger a resubscribe.
 */
function stableStringify(value: unknown): string {
  return JSON.stringify(value, (_key, val: unknown) => {
    if (val === null || typeof val !== 'object' || Array.isArray(val)) {
      return val;
    }
    return Object.fromEntries(
      Object.entries(val as Record<string, unknown>).sort(([a], [b]) =>
        a.localeCompare(b),
      ),
    );
  });
}
