import type { VitestUtils } from 'vitest';
import { createInterval, type Interval2 } from './interval';
import type { IntervalParams, TimerState } from './types.types';

const testInterval = (interval2: Interval2, vi: VitestUtils) => {
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

export const callback = vi.fn(() => {});

export const createIntervalTest = (
  params: Omit<IntervalParams, 'callback'>,
) => {
  const interval2 = createInterval({ ...params, callback });

  return testInterval(interval2, vi);
};
