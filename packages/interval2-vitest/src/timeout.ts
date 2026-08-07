import type { Timeout2 } from '@bemedev/interval2';
import type {
  Cb,
  TimeoutListener,
  TimerState,
} from '@bemedev/interval2/types';
import {
  afterAll,
  beforeAll,
  expect,
  it,
  vi,
  type VitestUtils,
} from 'vitest';

/**
 * Options for checking timeout state in test cases.
 */
export type TimeoutParamTests = {
  /** Optional ID of the timeout. */
  id?: string;
  /** Optional state of the timeout of type {@linkcode TimerState}. */
  state?: TimerState;
  /** Optional timeout duration in milliseconds. */
  timeout?: number;
};

/**
 * Creates test fixture helpers for an instance of class {@linkcode Timeout2}.
 *
 * @param timeout - The timeout instance to test of type class {@linkcode Timeout2}.
 * @param vitest - The Vitest utils instance of type {@linkcode VitestUtils}.
 *
 * @returns An object containing step helper functions for Vitest tests.
 */
const testTimeout = (_timeout: Timeout2, vitest: VitestUtils) => {
  let _index = 0;
  const callback = vi.fn(_timeout.callback);
  const timeout = _timeout.renew({ ..._timeout, callback });

  const formatN = () => {
    const index = _index;
    _index++;
    return index.toLocaleString().padStart(2, '0');
  };

  /**
   * Helper step to start the timeout.
   *
   * @returns Tuple containing test description title and start function.
   */
  const start = () => {
    const invite = `#${formatN()} => Start the Timeout`;
    return [invite, timeout.start] as [string, () => any];
  };

  /**
   * Helper step to resume the timeout.
   *
   * @returns Tuple containing test description title and resume function.
   */
  const resume = () => {
    const invite = `#${formatN()} => Resume the Timeout`;
    return [invite, timeout.resume] as [string, () => any];
  };

  /**
   * Helper step to pause the timeout.
   *
   * @returns Tuple containing test description title and pause function.
   */
  const pause = () => {
    const invite = `#${formatN()} => Pause the Timeout`;
    return [invite, timeout.pause] as [string, () => any];
  };

  /**
   * Helper step to dispose the timeout.
   *
   * @returns Tuple containing test description title and dispose function.
   */
  const dispose = () => {
    const invite = `#${formatN()} => Dispose the Timeout`;
    return [invite, timeout.dispose] as [string, () => any];
  };

  /**
   * Helper step to verify timeout properties and state.
   *
   * @param params - Test assertion options of type {@linkcode TimeoutParamTests}.
   * @returns Tuple containing test description title and test execution block.
   */
  const checkTimeout = ({
    id,
    state,
    timeout: timeoutVal,
  }: TimeoutParamTests) => {
    const invite = `#${formatN()} => Check the Timeout`;
    const out = () => {
      it.runIf(id)('#01 => check id', () => {
        expect(timeout.id).toBe(id);
      });

      it.runIf(state)('#02 => check state', () => {
        expect(timeout.state).toBe(state);
      });

      it.runIf(timeoutVal)('#03 => check timeout', () => {
        expect(timeout.timeout).toBe(timeoutVal);
      });
    };

    return [invite, out] as const;
  };

  /**
   * Helper step to advance timer by milliseconds.
   *
   * @param ms - Milliseconds to advance.
   * @returns Tuple containing test description title and advance action.
   */
  const advance = (ms: number) => {
    const invite = `#${formatN()} => Wait for ${ms} ms`;
    const cb = () => {
      return vitest.advanceTimersByTime(ms);
    };

    return [invite, cb] as [string, () => any];
  };

  /**
   * Helper step to run all pending timers.
   *
   * @returns Tuple containing test description title and runAllTimers action.
   */
  const runAllTimers = () => {
    const invite = `#${formatN()} => Advance to timeout ms`;
    const cb = () => {
      return vitest.runAllTimers();
    };

    return [invite, cb] as [string, () => any];
  };

  /**
   * Helper step to advance test step index formatting.
   *
   * @returns Tuple containing step title and empty callback.
   */
  const advanceIndex = () => {
    const invite = `## => Advance index`;
    formatN();
    const cb = () => {};
    return [invite, cb] as const;
  };

  beforeAll(() => {
    vitest.useFakeTimers();
  });

  afterAll(() => {
    callback.mockClear();
    timeout.dispose();
  });

  /**
   * Map storing active test subscriptions by string key.
   */
  const __subs = new Map<string, Cb>();

  /**
   * Helper step to subscribe a listener to timeout state changes.
   *
   * @param listener - Timeout listener callback of type {@linkcode TimeoutListener}.
   * @param id - Unique subscription identifier string.
   * @returns Tuple containing test description title and subscribe action.
   */
  const subscribe = (listener: TimeoutListener, id: string) => {
    const invite = `#${formatN()} => Subscribe to timeout::${timeout.id}`;

    const cb = () => {
      const unsub = timeout.subscribe(listener);
      __subs.set(id, unsub);
    };

    return [invite, cb] as const;
  };

  /**
   * Helper step to unsubscribe a listener from timeout state changes by ID.
   *
   * @param id - Unique subscription identifier string.
   * @returns Tuple containing test description title and unsubscribe action.
   */
  const unSubscribe = (id: string) => {
    const invite = `#${formatN()} => Unsubscribe id::${id} from timeout::${timeout.id}`;

    const cb = () => {
      const unsub = __subs.get(id);
      unsub?.();
      __subs.delete(id);
    };

    return [invite, cb] as const;
  };

  /**
   * Helper step to verify subscription presence state.
   *
   * @param value - Expected boolean subscription status.
   * @returns Tuple containing test description title and assertion action.
   */
  const subscribed = (value: boolean) => {
    const invite = `#${formatN()} => Check subscriptions`;
    const cb = () => expect(timeout.subscribed).toBe(value);
    return [invite, cb] as const;
  };

  return {
    timeout,
    start,
    pause,
    resume,
    dispose,
    checkTimeout,
    advance,
    runAllTimers,
    advanceIndex,
    subscribe,
    unSubscribe,
    subscribed,
  };
};

/**
 * Creates test fixture helpers for an instance of class {@linkcode Timeout2}.
 *
 * @param timeout - Source timeout instance of type class {@linkcode Timeout2}.
 * @returns Timeout test fixture helpers object.
 */
export const createTimeoutTests = (timeout: Timeout2) => {
  return testTimeout(timeout, vi);
};

export const createTests = createTimeoutTests;
