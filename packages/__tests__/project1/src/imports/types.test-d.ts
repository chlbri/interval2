import type {
  IntervalParams,
  TimeoutParams,
  TimerState,
} from '@bemedev/interval2/types';
import { expectTypeOf } from 'vitest';

describe('Type import tests for "@bemedev/interval2/types"', () => {
  test('#01 => IntervalParams type assertions', () => {
    expectTypeOf<IntervalParams>().toExtend<{
      id: string;
      callback: () => void;
    }>();
  });

  test('#02 => TimeoutParams type assertions', () => {
    expectTypeOf<TimeoutParams>().toExtend<{
      id: string;
      callback: () => void;
    }>();
  });

  test('#03 => TimerState type assertions', () => {
    expectTypeOf<TimerState>().toEqualTypeOf<
      'idle' | 'active' | 'paused' | 'disposed'
    >();
  });
});
