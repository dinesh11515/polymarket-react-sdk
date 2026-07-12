import { describe, expect, it, vi } from 'vitest';
import { runSubscriptionLoop } from './runSubscriptionLoop.js';

describe('runSubscriptionLoop', () => {
  it('delivers events until the stream ends', async () => {
    const events = [{ id: 1 }, { id: 2 }];
    const received: Array<{ id: number }> = [];
    const abortController = new AbortController();

    await runSubscriptionLoop({
      signal: abortController.signal,
      subscribe: async () => ({
        async *[Symbol.asyncIterator]() {
          for (const event of events) {
            yield event;
          }
        },
        close: vi.fn(async () => undefined),
      }),
      onEvent: (event: { id: number }) => {
        received.push(event);
      },
    });

    expect(received).toEqual(events);
  });

  it('closes the handle when aborted', async () => {
    let resume: (() => void) | undefined;
    const close = vi.fn(async () => {
      resume?.();
    });
    const abortController = new AbortController();

    const loop = runSubscriptionLoop({
      signal: abortController.signal,
      subscribe: async () => ({
        async *[Symbol.asyncIterator]() {
          yield { id: 1 };
          await new Promise<void>((resolve) => {
            resume = resolve;
          });
        },
        close,
      }),
      onEvent: () => undefined,
    });

    await Promise.resolve();
    abortController.abort();
    await loop;

    expect(close).toHaveBeenCalledOnce();
  });
});
