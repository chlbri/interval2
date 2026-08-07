import { Timer2 } from './timer';
import type {
  IntervalListener,
  IntervalParams,
  PauserListener,
  RenewIntervalParams,
} from './types.types';

/**
 * Class representing a cancellable interval timer with exact timing, max ticks, and subscription capabilities.
 * Inherits from abstract class {@linkcode Timer2}.
 */
class Interval2 extends Timer2<IntervalListener> {
  /**
   * Interval duration in milliseconds.
   */
  private __interval: number;

  /**
   * Counter tracking executed tick count.
   */
  private __ticks = 0;

  /**
   * Boolean flag indicating whether exact timing is enabled.
   */
  private __exact: boolean;

  /**
   * Maximum tick count allowed before auto-pausing.
   */
  private __maxTicks: number;

  /**
   * Optional custom pauser listener of type {@linkcode PauserListener}.
   */
  private __pauser?: PauserListener;

  /**
   * Private constructor initializing a new instance of class {@linkcode Interval2}.
   *
   * @param params - Interval parameters of type {@linkcode IntervalParams}.
   * @param params.callback - Callback function of type {@linkcode Cb}.
   * @param params.id - Unique string identifier.
   * @param params.interval - Duration in milliseconds.
   * @param params.exact - Exact timing boolean flag.
   * @param params.maxTicks - Maximum tick limit before pausing.
   * @param params.pauser - Custom pauser predicate function.
   */
  private constructor({
    callback,
    id,
    interval = 100,
    exact,
    maxTicks = 10_000,
    pauser,
  }: IntervalParams) {
    super(callback, id);
    this.__interval = interval;
    this.__exact = exact || false;
    this.__maxTicks = Math.max(1, maxTicks);
    this.__pauser = pauser;
  }

  /**
   * Static factory method to instantiate a new class {@linkcode Interval2} instance.
   *
   * @param config - Interval parameters of type {@linkcode IntervalParams}.
   * @returns A new instance of class {@linkcode Interval2}.
   */
  static create = (config: IntervalParams) => new Interval2(config);

  /**
   * Gets the exact timing setting.
   *
   * @returns `true` if exact timing is enabled, otherwise `false`.
   */
  get exact() {
    return this.__exact;
  }

  /**
   * Gets the current tick count.
   *
   * @returns Current tick count.
   */
  get ticks() {
    return this.__ticks;
  }

  /**
   * Gets the interval duration in milliseconds.
   *
   * @returns Interval duration in milliseconds.
   */
  get interval() {
    return this.__interval;
  }

  /**
   * Gets the maximum ticks configuration value.
   *
   * @returns Maximum tick count allowed before auto-pausing.
   */
  get maxTicks() {
    return this.__maxTicks;
  }

  /**
   * Gets the custom pauser listener function if defined.
   *
   * @returns Custom pauser function of type {@linkcode PauserListener} or `undefined`.
   */
  get pauser() {
    return this.__pauser;
  }

  /**
   * Renews the interval instance with updated parameters.
   *
   * @param params - Renew parameters of type {@linkcode RenewIntervalParams}.
   * @returns A new instance of class {@linkcode Interval2}.
   */
  renew = ({
    id,
    callback = this.callback,
    interval = this.__interval,
    exact = this.__exact,
    maxTicks = this.__maxTicks,
    pauser = this.__pauser,
  }: RenewIntervalParams) =>
    new Interval2({ id, callback, interval, exact, maxTicks, pauser });

  /**
   * Notifies subscribers of state changes and current ticks.
   */
  protected __notifySubscribers = () => {
    return this.__subscribers.forEach(listener =>
      listener(this.state, this.__ticks),
    );
  };

  /**
   * Starts or resumes the interval timer.
   *
   * @returns Current timer state of type {@linkcode TimerState}.
   */
  start = () => {
    if (this.__canStart) {
      const check = this.state === 'paused' && this.__exact === false;
      this.state = 'active';
      if (check) {
        this.__timerId = setTimeout(this.__build, this.__remaining);
      } else this.__build();

      return this.state;
    }
    return this.state;
  };

  /**
   * Internal helper to schedule repeated interval execution.
   */
  private __build = () => {
    const callback = () => {
      this.callback();
      this.__ticks++;
      const paused = this.__pauser?.(this.state, this.__ticks);
      if (paused === true) return this.pause();
      if (this.__ticks >= this.__maxTicks) this.pause();
      return this.__notifySubscribers();
    };

    this.__timerId = setInterval(callback, this.__interval);

    this.__startTime = Date.now();
  };

  /**
   * Pauses the currently running interval timer.
   *
   * @returns Current timer state of type {@linkcode TimerState}.
   */
  pause = () => {
    if (this.state !== 'active') return this.state;
    clearInterval(this.__timerId);
    this.__remaining =
      Date.now() - this.__ticks * this.__interval - this.__startTime;

    return (this.state = 'paused');
  };
}

/**
 * Type alias for class {@linkcode Interval2}.
 */
export type { Interval2 };

/**
 * Creates a new instance of class {@linkcode Interval2}.
 *
 * @param config - Configuration parameters of type {@linkcode IntervalParams}.
 * @returns A new instance of class {@linkcode Interval2}.
 */
export const createInterval = Interval2.create;

/**
 * Alias for {@linkcode createInterval}.
 */
export const createInterval2 = createInterval;

/**
 * Alias for {@linkcode createInterval}.
 */
export const create = createInterval;
