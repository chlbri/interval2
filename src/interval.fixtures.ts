import { createInterval } from './interval';
import type { IntervalParams, TimerState } from './types.types';

type ParamTests = {
  id?: string;
  state?: TimerState;
  interval?: number;
  exact?: boolean;
  callTimes?: number;
};

export const callback = vi.fn();

export const createIntervalTest = (
  params: Omit<IntervalParams, 'callback'>,
) => {
  const interval2 = createInterval({ ...params, callback });

  const start = (index = 0, waiter = 0) => {
    const invite = `#${index >= 10 ? index : '0' + index} => Start the Interval`;
    const callback = async () => {
      if (vi.isFakeTimers()) vi.advanceTimersByTimeAsync(waiter);
      await interval2.start();
    };
    return [invite, callback] as const;
  };

  const pause = (index = 0) => {
    const invite = `#${index >= 10 ? index : '0' + index} => Pause the Interval`;
    const callback = () => interval2.pause();
    return [invite, callback] as const;
  };

  const checkInterval = (
    {
      id = 'test',
      state = 'idle',
      interval = 100,
      exact = false,
      callTimes = 0,
    }: ParamTests,
    index = 0,
  ) => {
    const invite = `#${index >= 10 ? index : '0' + index} => Check the Interval`;
    const out = () => {
      it('#01 => check id', () => {
        expect(interval2.id).toBe(id);
      });

      it('#02 => check state', () => {
        expect(interval2.state).toBe(state);
      });

      it('#03 => check interval', () => {
        expect(interval2.interval).toBe(interval);
      });

      it('#04 => check exact option', () => {
        expect(interval2.exact).toBe(exact);
      });

      it('#05 => check callback', () => {
        expect(callback).toHaveBeenCalledTimes(callTimes);
      });
    };

    return [invite, out] as const;
  };

  const advance = (times: number, index: number) => {
    const invite = `#${index >= 10 ? index : '0' + index} => Wait for ${times} tick${
      times > 1 ? 's' : ''
    }`;
    const callback = () => {
      return vi.advanceTimersByTime(interval2.interval * times);
    };

    return [invite, callback] as const;
  };

  afterAll(() => {
    callback.mockClear();
    interval2.pause();
  });

  beforeAll(() => {
    vi.useFakeTimers();
  });

  return {
    interval: interval2,
    start,
    pause,
    checkInterval,
    advance,
  };
};
