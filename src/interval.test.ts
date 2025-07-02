import { createInterval } from './interval';
import { createIntervalTest } from './interval.fixtures';

describe('IntervalTimer', () => {
  describe('#1 => default values, with exact "true"', () => {
    const { start, checkInterval, advance, pause } = createIntervalTest({
      id: 'test',
      exact: true,
    });

    describe(...checkInterval({ interval: 100, exact: true }));

    test(...advance(10, 1));

    describe(...checkInterval({ interval: 100, exact: true }), 2);

    test(...start(3));

    test(...advance(1, 4));

    describe(
      ...checkInterval({
        interval: 100,
        exact: true,
        state: 'active',
        callTimes: 1,
      }),
      5,
    );

    test(...advance(4, 6));

    describe(
      ...checkInterval({
        interval: 100,
        exact: true,
        state: 'active',
        callTimes: 5,
      }),
      7,
    );

    test(...pause(8));

    describe(
      ...checkInterval({
        interval: 100,
        exact: true,
        state: 'paused',
        callTimes: 5,
      }),
      9,
    );

    test(...advance(10, 10));

    describe(
      ...checkInterval({
        interval: 100,
        exact: true,
        state: 'paused',
        callTimes: 5,
      }),
      11,
    );

    test(...start(12));

    describe(
      ...checkInterval({
        interval: 100,
        exact: true,
        state: 'active',
        callTimes: 5,
      }),
      12,
    );

    test(...advance(5, 13));

    describe(
      ...checkInterval({
        interval: 100,
        exact: true,
        state: 'active',
        callTimes: 10,
      }),
      14,
    );
  });

  describe('#2 => custom values, exact = true', () => {
    const { checkInterval, advance, start, pause } = createIntervalTest({
      id: 'custom',
      interval: 2000,
      exact: true,
    });

    describe(
      ...checkInterval({ interval: 2000, exact: true, id: 'custom' }),
    );

    test(...advance(10, 1));

    describe(
      ...checkInterval({ interval: 2000, exact: true, id: 'custom' }, 2),
    );

    test(...start(3));

    describe(
      ...checkInterval(
        {
          interval: 2000,
          exact: true,
          id: 'custom',
          state: 'active',
        },
        4,
      ),
    );

    test(...advance(1, 5));

    describe(
      ...checkInterval(
        {
          interval: 2000,
          exact: true,
          id: 'custom',
          state: 'active',
          callTimes: 1,
        },
        6,
      ),
    );

    test('#07 => Wait 1000', () => {
      return vi.advanceTimersByTime(1000);
    });

    describe(
      ...checkInterval(
        {
          interval: 2000,
          exact: true,
          id: 'custom',
          state: 'active',
          callTimes: 1,
        },
        8,
      ),
    );

    test(...pause(9));

    describe(
      ...checkInterval(
        {
          interval: 2000,
          exact: true,
          id: 'custom',
          state: 'paused',
          callTimes: 1,
        },
        10,
      ),
    );

    test(...pause(10.1));

    describe(
      ...checkInterval(
        {
          interval: 2000,
          exact: true,
          id: 'custom',
          state: 'paused',
          callTimes: 1,
        },
        10.2,
      ),
    );

    test(...advance(10, 11));

    describe(
      ...checkInterval(
        {
          interval: 2000,
          exact: true,
          id: 'custom',
          state: 'paused',
          callTimes: 1,
        },
        12,
      ),
    );

    test(...start(13, 1000));

    describe(
      ...checkInterval(
        {
          interval: 2000,
          exact: true,
          id: 'custom',
          state: 'active',
          callTimes: 1,
        },
        14,
      ),
    );

    test(...advance(4.5, 15));

    describe(
      ...checkInterval(
        {
          interval: 2000,
          exact: true,
          id: 'custom',
          state: 'active',
          callTimes: 5,
        },
        16,
      ),
    );

    //Pause
    test(...pause(17));

    describe(
      ...checkInterval(
        {
          interval: 2000,
          exact: true,
          id: 'custom',
          state: 'paused',
          callTimes: 5,
        },
        18,
      ),
    );

    test(...start(19));

    test(...advance(2, 20));

    describe(
      ...checkInterval(
        {
          interval: 2000,
          exact: true,
          id: 'custom',
          state: 'active',
          callTimes: 7,
        },
        21,
      ),
    );
  });

  describe('#2 => custom values, exact = false', () => {
    const { checkInterval, advance, start, pause } = createIntervalTest({
      id: 'custom',
      interval: 2000,
      exact: false,
    });

    describe(
      ...checkInterval({ interval: 2000, exact: false, id: 'custom' }),
    );

    test(...advance(10, 1));

    describe(
      ...checkInterval({ interval: 2000, exact: false, id: 'custom' }, 2),
    );

    test(...start(3));

    describe(
      ...checkInterval(
        {
          interval: 2000,
          exact: false,
          id: 'custom',
          state: 'active',
        },
        4,
      ),
    );

    test(...advance(1, 5));

    describe(
      ...checkInterval(
        {
          interval: 2000,
          exact: false,
          id: 'custom',
          state: 'active',
          callTimes: 1,
        },
        6,
      ),
    );

    test('#07 => Wait 1000', () => {
      return vi.advanceTimersByTime(1000);
    });

    describe(
      ...checkInterval(
        {
          interval: 2000,
          exact: false,
          id: 'custom',
          state: 'active',
          callTimes: 1,
        },
        8,
      ),
    );

    test(...pause(9));

    describe(
      ...checkInterval(
        {
          interval: 2000,
          exact: false,
          id: 'custom',
          state: 'paused',
          callTimes: 1,
        },
        10,
      ),
    );

    test(...pause(10.1));

    describe(
      ...checkInterval(
        {
          interval: 2000,
          exact: false,
          id: 'custom',
          state: 'paused',
          callTimes: 1,
        },
        10.2,
      ),
    );

    test(...advance(10, 11));

    describe(
      ...checkInterval(
        {
          interval: 2000,
          exact: false,
          id: 'custom',
          state: 'paused',
          callTimes: 1,
        },
        12,
      ),
    );

    test(...start(13, 1000));

    describe(
      ...checkInterval(
        {
          interval: 2000,
          exact: false,
          id: 'custom',
          state: 'active',
          callTimes: 1,
        },
        14,
      ),
    );

    test(...advance(4.5, 15));

    describe(
      ...checkInterval(
        {
          interval: 2000,
          exact: false,
          id: 'custom',
          state: 'active',
          callTimes: 5,
        },
        16,
      ),
    );

    //Pause
    test(...pause(17));

    describe(
      ...checkInterval(
        {
          interval: 2000,
          exact: false,
          id: 'custom',
          state: 'paused',
          callTimes: 5,
        },
        18,
      ),
    );

    test(...start(19));

    test(...advance(2, 20));

    describe(
      ...checkInterval(
        {
          interval: 2000,
          exact: false,
          id: 'custom',
          state: 'active',
          callTimes: 7,
        },
        21,
      ),
    );
  });

  describe('#3 => renew', () => {
    const callback1 = vi.fn();
    callback1.mockName('callback1');

    const interval1 = createInterval({ id: 'renew', callback: vi.fn() });

    describe('#01 => for id', () => {
      test('#01 => Change', () => {
        const interval = interval1.renew({ id: 'renew1' });
        expect(interval.id).toBe('renew1');
      });

      test('#02 => Keep', () => {
        const interval = interval1.renew();
        expect(interval.id).toBe('renew');
      });
    });

    describe('#02 => for interval', () => {
      test('#01 => Change', () => {
        const interval = interval1.renew({ interval: 2000 });
        expect(interval.interval).toBe(2000);
      });

      test('#02 => Keep', () => {
        const interval = interval1.renew();
        expect(interval.interval).toBe(100);
      });
    });

    describe('#03 => for exact', () => {
      test('#01 => Change', () => {
        const interval = interval1.renew({ exact: true });
        expect(interval.exact).toBe(true);
      });

      test('#02 => Keep', () => {
        const interval = interval1.renew();
        expect(interval.exact).toBe(false);
      });
    });
  });

  describe('#4 => dispose', () => {
    const {
      start,
      resume,
      interval,
      checkInterval,
      advance,
      pause,
      ticks,
    } = createIntervalTest({
      id: 'dispose',
    });

    const disposedConfig = {
      interval: 100,
      id: 'dispose',
      state: 'disposed',
      callTimes: 20,
    } as const;

    test(...start());

    describe(
      ...checkInterval(
        {
          interval: 100,
          id: 'dispose',
          state: 'active',
        },
        1,
      ),
    );

    test(...advance(1, 2));

    test(...ticks(1, 3));

    test(...advance(9, 4));

    describe(
      ...checkInterval(
        {
          interval: 100,
          id: 'dispose',
          state: 'active',
          callTimes: 10,
        },
        5,
      ),
    );

    test(...ticks(10, 6));

    test(...pause(7));

    test(...advance(10, 8));

    test(...ticks(10, 9));

    test(...resume(10));

    test(...advance(10, 11));

    test('#12 => dispose', interval[Symbol.asyncDispose]);

    describe(...checkInterval(disposedConfig, 13));

    test(...pause(14));

    test(...advance(10, 15));

    describe(...checkInterval(disposedConfig, 16));

    test(...resume(17));

    describe(...checkInterval(disposedConfig, 18));

    test(...advance(10, 19));

    describe(...checkInterval(disposedConfig, 20));

    test(...ticks(20, 21));
  });
});
