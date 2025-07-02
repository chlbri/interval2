import type { TimeoutParams, TimerState } from './types.types';

class Timeout2 {
  // #region Variables
  #timerId: NodeJS.Timeout | undefined = undefined;
  readonly #timeout: number;
  #state: TimerState = 'idle';
  #remaining!: number;
  #startTime!: number;
  readonly #callback: () => void;
  readonly #id: string;
  // #endregion

  private constructor({ callback, id, timeout = 1000 }: TimeoutParams) {
    this.#callback = callback;
    this.#timeout = timeout;
    this.#id = id;
  }

  /**
   *
   * @param config
   * @returns
   */
  static create = (config: TimeoutParams) => new Timeout2(config);

  // #region Getters
  get id(): string {
    return this.#id;
  }

  get #canStart() {
    return this.#state === 'idle' || this.#state === 'paused';
  }

  get state() {
    return this.#state;
  }

  get timeout() {
    return this.#timeout;
  }
  // #endregion

  renew = (config?: Partial<Omit<TimeoutParams, 'callback'>>) => {
    const id = config?.id || this.#id;
    const callback = this.#callback;
    const timeout = config?.timeout || this.#timeout;

    const out = new Timeout2({
      id,
      callback,
      timeout,
    });

    return out;
  };

  start = () => {
    if (this.#canStart) {
      const check = this.#state === 'paused';

      if (check) {
        // When resuming from pause, use remaining time
        this.#build();
      } else {
        // When starting fresh, use full timeout
        this.#remaining = this.#timeout;
        this.#build();
      }
    }
  };

  resume = this.start;

  #build = () => {
    const callback = () => {
      this.#callback();
      this.#state = 'disposed';
      this.#timerId = undefined;
    };

    this.#timerId = setTimeout(callback, this.#remaining);

    this.#startTime = Date.now();
    this.#state = 'active';
  };

  pause = () => {
    if (this.#state !== 'active') return;
    clearTimeout(this.#timerId);

    this.#remaining = this.#remaining - (Date.now() - this.#startTime);
    this.#state = 'paused';
  };

  stop = () => {
    if (this.#timerId) clearTimeout(this.#timerId);

    this.#startTime = 0;
    this.#remaining = 0;
    this.#state = 'disposed';
    this.#timerId = undefined;
  };

  dispose = () => {
    this.stop();
  };

  [Symbol.dispose] = this.dispose;

  [Symbol.asyncDispose] = async () => {
    return this[Symbol.dispose]();
  };
}

export type { Timeout2 };

/**
 * Creates a new Timeout2 instance
 * @param config Configuration object for the timeout
 * @returns A new Timeout2 instance
 */
export const createTimeout = Timeout2.create;
