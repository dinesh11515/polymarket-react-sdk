import type { SubscriptionHandle } from '@polymarket/client/actions';

export type RunSubscriptionLoopParameters<TEvent> = {
  subscribe: () => Promise<SubscriptionHandle<TEvent>>;
  onEvent: (event: TEvent) => void;
  signal: AbortSignal;
  onConnected?: () => void;
  onError?: (error: unknown) => void;
};

export async function runSubscriptionLoop<TEvent>({
  subscribe,
  onEvent,
  signal,
  onConnected,
  onError,
}: RunSubscriptionLoopParameters<TEvent>): Promise<void> {
  let handle: SubscriptionHandle<TEvent> | undefined;

  const closeHandle = async () => {
    if (!handle) {
      return;
    }

    const activeHandle = handle;
    handle = undefined;
    await activeHandle.close().catch(() => undefined);
  };

  const onAbort = () => {
    void closeHandle();
  };

  signal.addEventListener('abort', onAbort);

  try {
    handle = await subscribe();

    if (signal.aborted) {
      return;
    }

    onConnected?.();

    for await (const event of handle) {
      if (signal.aborted) {
        break;
      }
      onEvent(event);
    }
  } catch (error) {
    if (!signal.aborted) {
      onError?.(error);
    }
  } finally {
    signal.removeEventListener('abort', onAbort);
    await closeHandle();
  }
}
