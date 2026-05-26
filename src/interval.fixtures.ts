import { createInterval, testInterval } from './interval';
import type { IntervalParams } from './types.types';

export const callback = vi.fn(() => {});

export const createIntervalTest = (
  params: Omit<IntervalParams, 'callback'>,
) => {
  const interval2 = createInterval({
    ...params,
    callback,
  });

  return testInterval(interval2, vi);
};
