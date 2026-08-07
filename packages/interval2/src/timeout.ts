import { Timer2 } from './timer';
import type {
  RenewTimeoutParams,
  TimeoutListener,
  TimeoutParams,
} from './types.types';

/**
 * Class representing a cancellable timeout timer with pause, resume, and subscription capabilities.
 * Inherits from abstract class {@linkcode Timer2}.
 */
class Timeout2 extends Timer2<TimeoutListener> {
  /**
   * Timeout duration in milliseconds.
   */
  private __timeout: number;

  /**
   * Private constructor initializing a new instance of class {@linkcode Timeout2}.
   *
   * @param params - Timeout parameters of type {@linkcode TimeoutParams}.
   * @param params.callback - Callback function of type {@linkcode Cb}.
   * @param params.id - Unique timeout string identifier.
   * @param params.timeout - Timeout duration in milliseconds.
   */
  private constructor({ callback, id, timeout = 1000 }: TimeoutParams) {
    super(callback, id);
    this.__timeout = timeout;
  }

  /**
   * Static factory method to instantiate a new class {@linkcode Timeout2} instance.
   *
   * @param config - Timeout parameters of type {@linkcode TimeoutParams}.
   * @returns A new instance of class {@linkcode Timeout2}.
   */
  static create = (config: TimeoutParams) => new Timeout2(config);

  /**
   * Gets the timeout duration in milliseconds.
   *
   * @returns Timeout duration in milliseconds.
   */
  get timeout() {
    return this.__timeout;
  }

  /**
   * Notifies registered subscribers of state changes.
   */
  protected __notifySubscribers = () => {
    this.__subscribers.forEach(listener => listener(this.state));
  };

  /**
   * Renews the timeout instance with updated parameters.
   *
   * @param params - Renew parameters of type {@linkcode RenewTimeoutParams}.
   * @returns A new instance of class {@linkcode Timeout2}.
   */
  renew = ({
    id,
    callback = this.callback,
    timeout = this.__timeout,
  }: RenewTimeoutParams) => new Timeout2({ id, callback, timeout });

  /**
   * Starts or resumes the timeout timer.
   *
   * @returns Current timer state of type {@linkcode TimerState}.
   */
  start = () => {
    if (this.__canStart) {
      const check = this.state === 'paused';

      if (check) {
        // When resuming from pause, use remaining time
        this.__build();
        return (this.state = 'active');
      } else {
        // When starting fresh, use full timeout
        this.__remaining = this.__timeout;
        this.__build();
        return (this.state = 'active');
      }
    }
    return this.state;
  };

  /**
   * Internal helper to schedule timeout execution.
   */
  private __build = () => {
    const callback = async () => {
      this.callback();
      this.state = 'disposed';
      this.__timerId = undefined;
    };

    this.__timerId = setTimeout(callback, this.__remaining);

    this.__startTime = Date.now();
  };

  /**
   * Pauses the currently running timeout timer.
   *
   * @returns Current timer state of type {@linkcode TimerState}.
   */
  pause = () => {
    clearTimeout(this.__timerId);
    if (this.state !== 'active') return this.state;
    this.__remaining = this.__remaining - (Date.now() - this.__startTime);
    return (this.state = 'paused');
  };
}

/**
 * Type alias for class {@linkcode Timeout2}.
 */
export type { Timeout2 };

/**
 * Creates a new instance of class {@linkcode Timeout2}.
 *
 * @param config - Configuration object of type {@linkcode TimeoutParams}.
 * @returns A new instance of class {@linkcode Timeout2}.
 */
export const createTimeout = Timeout2.create;

/**
 * Alias for {@linkcode createTimeout}.
 */
export const createTimeout2 = createTimeout;

/**
 * Alias for {@linkcode createTimeout}.
 */
export const create = Timeout2.create;
