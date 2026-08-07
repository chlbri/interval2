import type { Fn } from '#bemedev/globals/types';
export type { Fn, NotUndefined } from '#bemedev/globals/types';

/**
 * Callback function type with no arguments returning any result.
 */
export type Cb = Fn<[], void>;

/**
 * Common parameters shared by all timers.
 */
export type CommonTimerParams = {
  /** Unique string identifier for the timer. */
  id: string;
  /** Execution callback function of type {@linkcode Cb}. */
  callback: Cb;
};

/**
 * Listener function to determine if interval should pause based on state and tick count.
 *
 * @param state - Current timer state of type {@linkcode TimerState}.
 * @param ticks - Current tick count.
 *
 * @returns Boolean indicating whether timer should pause.
 */
export type PauserListener = (state: TimerState, ticks: number) => boolean;

/**
 * Configuration parameters for creating an interval timer.
 */
export type IntervalParams = CommonTimerParams & {
  /** Interval duration in milliseconds, defaults to 100. */
  interval?: number;
  /** Boolean flag for exact interval calculation, defaults to false. */
  exact?: boolean;
  /** Maximum tick count before automatic pause, defaults to 10000. */
  maxTicks?: number;
  /** Custom pauser predicate function of type {@linkcode PauserListener}. */
  pauser?: PauserListener;
};

/**
 * Configuration parameters for creating a timeout timer.
 */
export type TimeoutParams = CommonTimerParams & {
  /** Timeout duration in milliseconds, defaults to 1000. */
  timeout?: number;
};

/**
 * Represents the lifecycle state of a timer instance.
 */
export type TimerState = 'idle' | 'active' | 'paused' | 'disposed';

/**
 * Listener callback signature for timeout state changes.
 *
 * @param state - Current timeout state of type {@linkcode TimerState}.
 */
export type TimeoutListener = (state: TimerState) => any;

/**
 * Listener callback signature for interval state changes.
 *
 * @param state - Current interval state of type {@linkcode TimerState}.
 * @param ticks - Current tick count of interval execution.
 */
export type IntervalListener = (state: TimerState, ticks: number) => any;

/**
 * Generic subscriber state listener for timers of type {@linkcode TimeoutListener} or {@linkcode IntervalListener}.
 */
export type StateListener = TimeoutListener | IntervalListener;

/**
 * Configuration parameters for renewing a timeout instance based on type {@linkcode TimeoutParams}.
 */
export type RenewTimeoutParams = Pick<TimeoutParams, 'id'> &
  Partial<Omit<TimeoutParams, 'id'>>;

/**
 * Configuration parameters for renewing an interval instance based on type {@linkcode IntervalParams}.
 */
export type RenewIntervalParams = Pick<IntervalParams, 'id'> &
  Partial<Omit<IntervalParams, 'id'>>;
