import sleep from '@bemedev/sleep';
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
  readonly #callback: () => void;
  readonly #id: string;
  // #endregion

  private constructor({
    callback,
    id,
    interval = 100,
    exact,
  }: IntervalParams) {
    this.#callback = callback;
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
    const callback = this.#callback;
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

  start = async () => {
    if (this.#canStart) {
      const check = this.#state === 'paused' && this.#exact === false;
      console.log('exact', this.#exact);
      console.log('check', check);

      if (check) await sleep(this.#remaining);
      this.#build();
    }
  };

  resume = this.start;

  #build = () => {
    const callback = () => {
      this.#callback();
      this.#ticks = this.#ticks + 1;
    };

    this.#timerId = setInterval(callback, this.#interval);

    this.#startTime = Date.now();
    this.#state = 'active';
  };

  pause = () => {
    if (this.#state !== 'active') return;
    if (this.#timerId) clearInterval(this.#timerId);
    this.#remaining =
      Date.now() - this.#ticks * this.#interval - this.#startTime;

    this.#state = 'paused';
  };

  dispose = () => {
    if (this.#timerId) clearInterval(this.#timerId);
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
