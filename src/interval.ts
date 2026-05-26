import { type VitestUtils, it, expect } from 'vitest';
import type { IntervalParams, TimerState } from './types.types';

class Interval2 {
  // #region Variables
  #timerId: NodeJS.Timeout | undefined = undefined;
  readonly #interval: number;
  #state: TimerState = 'idle';
  #remaining!: number;
  #startTime!: number;
  #ticks = 0;
  readonly #exact: boolean;
  readonly callback: () => void;
  readonly #id: string;
  // #endregion

  private constructor({
    callback,
    id,
    interval = 100,
    exact,
  }: IntervalParams) {
    this.callback = callback;
    this.#interval = interval;
    this.#id = id;
    this.#exact = exact || false;
  }

  /**
   *
   * @param config
   * @returns
   */
  static create = (config: IntervalParams) => new Interval2(config);

  // #region Getters
  get id(): string {
    return this.#id;
  }

  get exact() {
    return this.#exact;
  }

  get ticks() {
    return this.#ticks;
  }

  get #canStart() {
    return this.#state === 'idle' || this.#state === 'paused';
  }

  get state() {
    return this.#state;
  }

  get interval() {
    return this.#interval;
  }
  // #endregion

  renew = (config?: Partial<Omit<IntervalParams, 'callback'>>) => {
    const id = config?.id || this.#id;
    const callback = this.callback;
    const interval = config?.interval || this.#interval;
    const exact = config?.exact || this.#exact;

    const out = new Interval2({
      id,
      callback,
      interval,
      exact,
    });

    return out;
  };

  start = () => {
    if (this.#canStart) {
      const check = this.#state === 'paused' && this.#exact === false;

      if (check) {
        setTimeout(this.#build, this.#remaining);
      } else this.#build();
    }
  };

  resume = this.start;

  #build = () => {
    const callback = () => {
      this.callback();
      this.#ticks = this.#ticks + 1;
    };

    this.#timerId = setInterval(callback, this.#interval);

    this.#startTime = Date.now();
    this.#state = 'active';
  };

  pause = () => {
    if (this.#state !== 'active') return;
    clearInterval(this.#timerId);
    this.#remaining =
      Date.now() - this.#ticks * this.#interval - this.#startTime;

    this.#state = 'paused';
  };

  dispose = () => {
    clearInterval(this.#timerId);
    this.#startTime = 0;
    this.#remaining = 0;
    this.#state = 'disposed';
    this.#timerId = undefined;
  };

  [Symbol.dispose] = this.dispose;

  [Symbol.asyncDispose] = async () => {
    return this[Symbol.dispose]();
  };
}

export type { Interval2 };

/**
 * @param exact
 * * For value = false means that the interval will wait for the remaining time before the next tick.
 * * For value = true means that the interval will start immediately after the
 *
 */

export const createInterval = Interval2.create;

export const testInterval = (interval2: Interval2, vi: VitestUtils) => {
  let _index = 0;
  const callback = vi.spyOn(interval2, 'callback');

  const formatN = () => {
    const index = _index;
    _index++;
    return index >= 10 ? index : '0' + index;
  };

  const start = () => {
    const invite = `#${formatN()} => Start the Interval`;
    return [invite, interval2.start] as const;
  };

  const resume = start;

  const pause = () => {
    const invite = `#${formatN()} => Pause the Interval`;
    return [invite, interval2.pause] as const;
  };

  const ticks = (times = 1) => {
    const invite = `#${formatN()} => Ticks the Interval ${times} time${
      times > 1 ? 's' : ''
    }`;

    const callback = () => {
      expect(interval2.ticks).toBe(times);
    };

    return [invite, callback] as const;
  };

  type ParamTests = {
    id?: string;
    state?: TimerState;
    interval?: number;
    exact?: boolean;
    callTimes?: number;
  };

  const checkInterval = ({
    id,
    state,
    interval,
    exact,
    callTimes,
  }: ParamTests) => {
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

      it.runIf(callTimes)('#05 => check callback', () => {
        expect(callback).toHaveBeenCalledTimes(callTimes!);
      });
    };

    return [invite, out] as const;
  };

  const advanceTimes = (times = 1) => {
    const invite = `#${formatN()} => Wait for ${times} tick${
      times > 1 ? 's' : ''
    }`;
    const callback = () => {
      return vi.advanceTimersByTime(interval2.interval * times);
    };

    return [invite, callback] as const;
  };

  const advanceIndex = () => {
    const invite = `## => Advance index`;
    formatN();
    const callback = () => {};
    return [invite, callback] as const;
  };

  const advance = (ms: number) => {
    const invite = `#${formatN()} => Wait for ${ms} ms`;
    const callback = () => {
      return vi.advanceTimersByTime(ms);
    };

    return [invite, callback] as const;
  };

  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    callback.mockClear();
    interval2.pause();
  });

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
  };
};
