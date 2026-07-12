'use client';

import type { SubscriptionHandle } from '@polymarket/client/actions';
import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useSubscriptionCore } from './useSubscriptionCore.js';

type TestEvent = { id: number };
type TestSpec = { topic: string; tokenIds?: string[] };

function createHandle(events: TestEvent[]) {
  let notifyClose: (() => void) | undefined;
  const handle = {
    close: vi.fn(async () => {
      notifyClose?.();
    }),
    async *[Symbol.asyncIterator]() {
      for (const event of events) {
        yield event;
      }
      await new Promise<void>((resolve) => {
        notifyClose = resolve;
      });
    },
  };
  return handle as typeof handle & SubscriptionHandle<TestEvent>;
}

describe('useSubscriptionCore', () => {
  it('keeps error status after the loop settles when subscribe fails', async () => {
    const failure = new Error('boom');
    const client = {
      subscribe: vi.fn(async (): Promise<SubscriptionHandle<unknown>> => {
        throw failure;
      }),
    };

    const { result } = renderHook(() =>
      useSubscriptionCore<TestSpec[], TestEvent>({
        client,
        subscriptions: [{ topic: 'market' }],
      }),
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe(failure);

    // The loop's finally must not downgrade 'error' to 'closed'.
    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.status).toBe('error');
    expect(result.current.isError).toBe(true);
  });

  it('delivers events, invokes onEvent, and resets latestEvent on spec change', async () => {
    const handles: ReturnType<typeof createHandle>[] = [];
    const client = {
      subscribe: vi.fn(async (): Promise<SubscriptionHandle<unknown>> => {
        const handle = createHandle([{ id: handles.length + 1 }]);
        handles.push(handle);
        return handle;
      }),
    };
    const onEvent = vi.fn();

    const { result, rerender } = renderHook(
      ({ spec }: { spec: TestSpec[] }) =>
        useSubscriptionCore<TestSpec[], TestEvent>({
          client,
          subscriptions: spec,
          onEvent,
        }),
      { initialProps: { spec: [{ topic: 'market', tokenIds: ['a'] }] } },
    );

    await waitFor(() => {
      expect(result.current.latestEvent).toEqual({ id: 1 });
    });
    expect(result.current.isConnected).toBe(true);
    expect(onEvent).toHaveBeenCalledWith({ id: 1 });

    rerender({ spec: [{ topic: 'market', tokenIds: ['b'] }] });

    // The previous market's event must not linger while resubscribing.
    expect(result.current.latestEvent).toBeUndefined();

    await waitFor(() => {
      expect(result.current.latestEvent).toEqual({ id: 2 });
    });
    expect(client.subscribe).toHaveBeenCalledTimes(2);
    expect(handles[0]?.close).toHaveBeenCalled();
  });

  it('reports closed when the stream ends without an error', async () => {
    const client = {
      subscribe: vi.fn(async (): Promise<SubscriptionHandle<unknown>> => {
        // Stream ends immediately after a single event.
        const endedHandle = {
          close: vi.fn(async () => undefined),
          async *[Symbol.asyncIterator]() {
            yield { id: 1 };
          },
        };
        return endedHandle as SubscriptionHandle<unknown>;
      }),
    };

    const { result } = renderHook(() =>
      useSubscriptionCore<TestSpec[], TestEvent>({
        client,
        subscriptions: [{ topic: 'market' }],
      }),
    );

    await waitFor(() => {
      expect(result.current.status).toBe('closed');
    });
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it('does not resubscribe when the spec differs only in key order', async () => {
    const client = {
      subscribe: vi.fn(
        async (): Promise<SubscriptionHandle<unknown>> =>
          createHandle([{ id: 1 }]),
      ),
    };

    const { result, rerender } = renderHook(
      ({ spec }: { spec: TestSpec[] }) =>
        useSubscriptionCore<TestSpec[], TestEvent>({
          client,
          subscriptions: spec,
        }),
      {
        initialProps: {
          spec: [{ topic: 'market', tokenIds: ['a'] }] as TestSpec[],
        },
      },
    );

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });

    rerender({
      spec: [{ tokenIds: ['a'], topic: 'market' }],
    });
    await act(async () => {
      await Promise.resolve();
    });

    expect(client.subscribe).toHaveBeenCalledTimes(1);
  });

  it('closes the handle on unmount', async () => {
    const handle = createHandle([{ id: 1 }]);
    const client = {
      subscribe: vi.fn(
        async (): Promise<SubscriptionHandle<unknown>> => handle,
      ),
    };

    const { result, unmount } = renderHook(() =>
      useSubscriptionCore<TestSpec[], TestEvent>({
        client,
        subscriptions: [{ topic: 'market' }],
      }),
    );

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });

    unmount();

    await waitFor(() => {
      expect(handle.close).toHaveBeenCalled();
    });
  });

  it('stays idle when disabled or the spec is empty', () => {
    const client = {
      subscribe: vi.fn(
        async (): Promise<SubscriptionHandle<unknown>> => createHandle([]),
      ),
    };

    const { result: disabled } = renderHook(() =>
      useSubscriptionCore<TestSpec[], TestEvent>({
        client,
        subscriptions: [{ topic: 'market' }],
        enabled: false,
      }),
    );
    const { result: empty } = renderHook(() =>
      useSubscriptionCore<TestSpec[], TestEvent>({
        client,
        subscriptions: [],
      }),
    );

    expect(disabled.current.status).toBe('idle');
    expect(empty.current.status).toBe('idle');
    expect(client.subscribe).not.toHaveBeenCalled();
  });
});
