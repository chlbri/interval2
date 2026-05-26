import { createInterval } from './interval';
import { createIntervalTest } from './interval.fixtures';

describe('IntervalTimer', () => {
  describe('#01 => default values, with exact "true"', () => {
    const { start, checkInterval, advanceTimes, pause } =
      createIntervalTest({
        id: 'test',
        exact: true,
      });

    describe(...checkInterval({ exact: true }));

    test(...advanceTimes(10));

    describe(...checkInterval({ interval: 100, state: 'idle' }));

    test(...start());

    test(...advanceTimes(1));

    describe(
      ...checkInterval({
        exact: true,
        state: 'active',
        callTimes: 1,
      }),
    );

    test(...advanceTimes(4));

    describe(
      ...checkInterval({
        callTimes: 5,
      }),
    );

    test(...pause());

    describe(
      ...checkInterval({
        state: 'paused',
        callTimes: 5,
      }),
    );

    test(...advanceTimes(10));

    describe(
      ...checkInterval({
        state: 'paused',
        callTimes: 5,
      }),
    );

    test(...start());

    describe(
      ...checkInterval({
        state: 'active',
        callTimes: 5,
      }),
    );

    test(...advanceTimes(5));

    describe(
      ...checkInterval({
        callTimes: 10,
      }),
    );
  });

  describe('#02 => custom values, exact = true', () => {
    const { checkInterval, advanceTimes, start, pause, advance } =
      createIntervalTest({
        id: 'custom',
        interval: 2000,
        exact: true,
      });

    describe(...checkInterval({ id: 'custom' }));

    test(...advanceTimes(10));

    describe(
      ...checkInterval({ interval: 2000, exact: true, state: 'idle' }),
    );

    test(...start());

    describe(
      ...checkInterval({
        state: 'active',
        callTimes: 0,
      }),
    );

    test(...advanceTimes());

    describe(
      ...checkInterval({
        callTimes: 1,
      }),
    );

    test(...advance(1000));

    describe(
      ...checkInterval({
        callTimes: 1,
      }),
    );

    test(...pause());

    describe(
      ...checkInterval({
        state: 'paused',
        callTimes: 1,
      }),
    );

    test(...pause());

    describe(
      ...checkInterval({
        state: 'paused',
        callTimes: 1,
      }),
    );

    test(...advanceTimes(10));

    describe(
      ...checkInterval({
        callTimes: 1,
      }),
    );

    test(...start());

    describe(
      ...checkInterval({
        state: 'active',
        callTimes: 1,
      }),
    );

    test(...advanceTimes(4.5));

    describe(
      ...checkInterval({
        state: 'active',
        callTimes: 5,
      }),
    );

    //Pause
    test(...pause());

    describe(
      ...checkInterval({
        interval: 2000,
        exact: true,
        id: 'custom',
        state: 'paused',
        callTimes: 5,
      }),
    );

    test(...start());

    test(...advanceTimes(2));

    describe(
      ...checkInterval({
        state: 'active',
        callTimes: 7,
      }),
    );

    test(...advance(1000));

    describe(
      ...checkInterval({
        state: 'active',
        callTimes: 7,
      }),
    );

    test(...advance(500));

    describe(
      ...checkInterval({
        state: 'active',
        callTimes: 7,
      }),
    );

    test(...advance(500));

    describe(
      ...checkInterval({
        callTimes: 8,
      }),
    );
  });

  describe('#03 => custom values, exact = false', () => {
    const { checkInterval, advanceTimes, advance, start, pause } =
      createIntervalTest({
        id: 'custom',
        interval: 2000,
        exact: false,
      });

    describe(
      ...checkInterval({ interval: 2000, exact: false, id: 'custom' }),
    );

    test(...advanceTimes(10));

    describe(...checkInterval({ state: 'idle' }));

    test(...start());

    describe(
      ...checkInterval({
        state: 'active',
        callTimes: 0,
      }),
    );

    test(...advanceTimes(1));

    describe(
      ...checkInterval({
        callTimes: 1,
      }),
    );

    test(...advance(1000));

    describe(
      ...checkInterval({
        callTimes: 1,
      }),
    );

    test(...pause());

    describe(
      ...checkInterval({
        state: 'paused',
        callTimes: 1,
      }),
    );

    test(...pause());

    describe(
      ...checkInterval({
        state: 'paused',
        callTimes: 1,
      }),
    );

    test(...advanceTimes(10));

    describe(
      ...checkInterval({
        state: 'paused',
        callTimes: 1,
      }),
    );

    test(...start());

    describe(
      ...checkInterval({
        state: 'paused',
        callTimes: 1,
      }),
    );

    test(...advanceTimes(0.5));

    describe(
      ...checkInterval({
        state: 'active',
        callTimes: 1,
      }),
    );

    test(...advanceTimes(4));

    describe(
      ...checkInterval({
        state: 'active',
        callTimes: 5,
      }),
    );

    test(...pause());

    describe(
      ...checkInterval({
        state: 'paused',
      }),
    );

    test(...start());

    describe(
      ...checkInterval({
        state: 'paused',
        callTimes: 5,
      }),
    );

    test(...advance(0));

    describe(
      ...checkInterval({
        state: 'active',
        callTimes: 5,
      }),
    );

    test(...advanceTimes(2));

    describe(
      ...checkInterval({
        callTimes: 7,
      }),
    );
  });

  describe('#04 => renew', () => {
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

  describe('#05 => dispose', () => {
    const {
      start,
      resume,
      interval2,
      checkInterval,
      advanceTimes,
      pause,
      ticks,
      advanceIndex,
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
      ...checkInterval({
        interval: 100,
        id: 'dispose',
        state: 'active',
      }),
    );

    test(...advanceTimes(1));

    test(...ticks(1));

    test(...advanceTimes(9));

    describe(
      ...checkInterval({
        state: 'active',
        callTimes: 10,
      }),
    );

    test(...ticks(10));

    test(...pause());

    test(...advanceTimes(10));

    test(...ticks(10));

    test(...resume());

    test(...advanceTimes(10));

    test('#12 => dispose', interval2[Symbol.asyncDispose]);

    test(...advanceIndex());

    describe(...checkInterval(disposedConfig));

    test(...pause());

    test(...advanceTimes(10));

    describe(...checkInterval(disposedConfig));

    test(...resume());

    describe(...checkInterval(disposedConfig));

    test(...advanceTimes(10));

    describe(...checkInterval(disposedConfig));

    test(...ticks(20));
  });
});
