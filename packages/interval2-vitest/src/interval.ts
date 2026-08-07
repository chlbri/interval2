import type { Interval2 } from '@bemedev/interval2';
import type {
  Cb,
  IntervalListener,
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
 * Options for checking interval state in test cases.
 */
export type IntervalParamTests = {
  /** Optional ID of the interval. */
  id?: string;
  /** Optional state of the interval of type {@linkcode TimerState}. */
  state?: TimerState;
  /** Optional interval duration in milliseconds. */
  interval?: number;
  /** Optional exact timing boolean flag. */
  exact?: boolean;
  /** Optional number of callback invocations. */
  callTimes?: number;
};

/**
 * Creates test fixture helpers for an instance of class {@linkcode Interval2}.
 *
 * @param interval2 - The interval instance to test of type class {@linkcode Interval2}.
 * @param vitest - The Vitest utils instance of type {@linkcode VitestUtils}.
 *
 * @returns An object containing step helper functions for Vitest tests.
 */
const testInterval = (_interval2: Interval2, vitest: VitestUtils) => {
  let _index = 0;
  const callback = vi.fn(_interval2.callback);
  const interval2 = _interval2.renew({ ..._interval2, callback });

  const formatN = () => {
    const index = _index;
    _index++;
    return index.toLocaleString().padStart(2, '0');
  };

  /**
   * Helper step to start the interval.
   *
   * @returns Tuple containing test description title and start function.
   */
  const start = () => {
    const invite = `#${formatN()} => Start the Interval`;
    return [invite, interval2.start] as [string, () => any];
  };

  /**
   * Helper step to resume the interval (alias for {@linkcode testInterval}.start).
   *
   * @returns Tuple containing test description title and start function.
   */
  const resume = start;

  /**
   * Helper step to pause the interval.
   *
   * @returns Tuple containing test description title and pause function.
   */
  const pause = () => {
    const invite = `#${formatN()} => Pause the Interval`;
    return [invite, interval2.pause] as [string, () => any];
  };

  /**
   * Helper step to verify the ticks counter.
   *
   * @param times - Expected ticks count.
   * @returns Tuple containing test description title and test runner function.
   */
  const ticks = (times = 1) => {
    const invite = `#${formatN()} => Ticks the Interval ${times} time${
      times > 1 ? 's' : ''
    }`;

    const cb = () => {
      expect(interval2.ticks).toBe(times);
    };

    return [invite, cb] as const;
  };

  /**
   * Helper step to verify interval properties and state.
   *
   * @param params - Test assertion options of type {@linkcode IntervalParamTests}.
   * @returns Tuple containing test description title and test execution block.
   */
  const checkInterval = ({
    id,
    state,
    interval,
    exact,
    callTimes,
  }: IntervalParamTests) => {
    const invite = `#${formatN()} => Check the Interval`;
    const out = () => {
      it.runIf(id)('#01 => check id', () => {
        expect(interval2.id).toBe(id);
      });

      it.runIf(state)('#02 => check state', () => {
        expect(interval2.state).toBe(state);
      });

      it.runIf(interval)('#03 => check interval', () => {
        expect(interval2.interval).toBe(interval);
      });

      it.runIf(exact)('#04 => check exact option', () => {
        expect(interval2.exact).toBe(exact);
      });

      it.runIf(callTimes !== undefined)('#05 => check callback', () => {
        expect(callback).toHaveBeenCalledTimes(callTimes!);
      });
    };

    return [invite, out] as const;
  };

  /**
   * Helper step to advance timer by tick multiples.
   *
   * @param times - Number of ticks to advance.
   * @returns Tuple containing test description title and advance action.
   */
  const advanceTimes = (times = 1) => {
    const invite = `#${formatN()} => Wait for ${times} tick${
      times > 1 ? 's' : ''
    }`;
    const cb = () => {
      return vitest.advanceTimersByTime(interval2.interval * times);
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

  /**
   * Helper step to advance timer by exact milliseconds.
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

  beforeAll(() => {
    vitest.useFakeTimers();
  });

  afterAll(() => {
    callback.mockClear();
    interval2.pause();
  });

  /**
   * Map storing active test subscriptions by string key.
   */
  const __subs = new Map<string, Cb>();

  /**
   * Helper step to subscribe a listener to interval state changes.
   *
   * @param listener - Interval listener callback of type {@linkcode IntervalListener}.
   * @param id - Unique subscription identifier string.
   * @returns Tuple containing test description title and subscribe action.
   */
  const subscribe = (listener: IntervalListener, id: string) => {
    const invite = `#${formatN()} => Subscribe to interval::${interval2.id}`;

    const cb = () => {
      const unsub = interval2.subscribe(listener);
      __subs.set(id, unsub);
    };

    return [invite, cb] as const;
  };

  /**
   * Helper step to unsubscribe a listener from interval state changes by ID.
   *
   * @param id - Unique subscription identifier string.
   * @returns Tuple containing test description title and unsubscribe action.
   */
  const unSubscribe = (id: string) => {
    const invite = `#${formatN()} => Unsubscribe id::${id} from interval::${interval2.id}`;

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
    const cb = () => expect(interval2.subscribed).toBe(value);
    return [invite, cb] as const;
  };

  return {
    interval2,
    start,
    pause,
    checkInterval,
    advanceTimes,
    advanceIndex,
    advance,
    resume,
    ticks,
    subscribe,
    unSubscribe,
    subscribed,
    callback,
  };
};

/**
 * Creates test fixture helpers for an instance of class {@linkcode Interval2}.
 *
 * @param interval2 - Source interval instance of type class {@linkcode Interval2}.
 * @returns Interval test fixture helpers object.
 */
export const createIntervalTests = (interval2: Interval2) => {
  return testInterval(interval2, vi);
};

/**
 * Alias for {@linkcode createIntervalTests}.
 */
export const createTests = createIntervalTests;
