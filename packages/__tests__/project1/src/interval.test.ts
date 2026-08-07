import { createInterval } from '@bemedev/interval2';
import { createIntervalTests } from '@bemedev/interval2-vitest';
import { sleep } from '@bemedev/interval2/helpers';
import type { PauserListener } from '@bemedev/interval2/types';
import { typeMock } from './fixtures';

describe('IntervalTimer', () => {
  describe('#01 => default values, with exact "true"', () => {
    const { start, checkInterval, advanceTimes, pause } =
      createIntervalTests(
        createInterval({ id: 'test', exact: true, callback: () => {} }),
      );

    describe(...checkInterval({ exact: true }));
    test(...advanceTimes(10));
    describe(...checkInterval({ interval: 100, state: 'idle' }));
    test(...start());
    test(...advanceTimes(1));
    describe(
      ...checkInterval({ exact: true, state: 'active', callTimes: 1 }),
    );
    test(...advanceTimes(4));
    describe(...checkInterval({ callTimes: 5 }));
    test(...pause());
    describe(...checkInterval({ state: 'paused', callTimes: 5 }));
    test(...advanceTimes(10));
    describe(...checkInterval({ state: 'paused', callTimes: 5 }));
    test(...start());
    describe(...checkInterval({ state: 'active', callTimes: 5 }));
    test(...advanceTimes(5));
    describe(...checkInterval({ callTimes: 10 }));
  });

  describe('#02 => custom values, exact = true', () => {
    const { checkInterval, advanceTimes, start, pause, advance } =
      createIntervalTests(
        createInterval({
          id: 'custom',
          interval: 2000,
          exact: true,
          callback: () => {},
        }),
      );

    describe(...checkInterval({ id: 'custom' }));
    test(...advanceTimes(10));
    describe(
      ...checkInterval({ interval: 2000, exact: true, state: 'idle' }),
    );
    test(...start());
    describe(...checkInterval({ state: 'active', callTimes: 0 }));
    test(...advanceTimes());
    describe(...checkInterval({ callTimes: 1 }));
    test(...advance(1000));
    describe(...checkInterval({ callTimes: 1 }));
    test(...pause());
    describe(...checkInterval({ state: 'paused', callTimes: 1 }));
    test(...pause());
    describe(...checkInterval({ state: 'paused', callTimes: 1 }));
    test(...advanceTimes(10));
    describe(...checkInterval({ callTimes: 1 }));
    test(...start());
    describe(...checkInterval({ state: 'active', callTimes: 1 }));
    test(...advanceTimes(4.5));
    describe(...checkInterval({ state: 'active', callTimes: 5 }));
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
    describe(...checkInterval({ state: 'active', callTimes: 7 }));
    test(...advance(1000));
    describe(...checkInterval({ state: 'active', callTimes: 7 }));
    test(...advance(500));
    describe(...checkInterval({ state: 'active', callTimes: 7 }));
    test(...advance(500));
    describe(...checkInterval({ callTimes: 8 }));
  });

  describe('#03 => custom values, exact = false', () => {
    const { checkInterval, advanceTimes, advance, start, pause } =
      createIntervalTests(
        createInterval({
          id: 'custom',
          interval: 2000,
          exact: false,
          callback: () => {},
        }),
      );

    describe(
      ...checkInterval({ interval: 2000, exact: false, id: 'custom' }),
    );
    test(...advanceTimes(10));
    describe(...checkInterval({ state: 'idle' }));
    test(...start());
    describe(...checkInterval({ state: 'active', callTimes: 0 }));
    test(...advanceTimes(1));
    describe(...checkInterval({ callTimes: 1 }));
    test(...advance(1000));
    describe(...checkInterval({ callTimes: 1 }));
    test(...pause());
    describe(...checkInterval({ state: 'paused', callTimes: 1 }));
    test(...pause());
    describe(...checkInterval({ state: 'paused', callTimes: 1 }));
    test(...advanceTimes(10));
    describe(...checkInterval({ state: 'paused', callTimes: 1 }));
    test(...start());
    describe(...checkInterval({ state: 'active', callTimes: 1 }));
    test(...advanceTimes(0.5));
    describe(...checkInterval({ state: 'active', callTimes: 1 }));
    test(...advanceTimes(4));
    describe(...checkInterval({ state: 'active', callTimes: 5 }));
    test(...pause());
    describe(...checkInterval({ state: 'paused' }));
    test(...start());
    describe(...checkInterval({ state: 'active', callTimes: 5 }));
    test(...advance(0));
    describe(...checkInterval({ state: 'active', callTimes: 5 }));
    test(...advanceTimes(2));
    describe(...checkInterval({ callTimes: 7 }));
  });

  describe('#04 => renew', () => {
    const interval1 = createInterval({ id: 'renew', callback: vi.fn() });

    describe('#01 => for id', () => {
      test('#01 => Change', () =>
        expect(interval1.renew({ id: 'renew1' }).id).toBe('renew1'));

      test('#02 => Keep', () =>
        expect(interval1.renew({ id: 'renew' }).id).toBe('renew'));
    });

    describe('#02 => for interval', () => {
      test('#01 => Change', () =>
        expect(
          interval1.renew({ id: 'renew', interval: 2000 }).interval,
        ).toBe(2000));

      test('#02 => Keep', () =>
        expect(interval1.renew({ id: 'renew' }).interval).toBe(100));
    });

    describe('#03 => for exact', () => {
      test('#01 => Change', () =>
        expect(interval1.renew({ id: 'renew', exact: true }).exact).toBe(
          true,
        ));

      test('#02 => Keep', () =>
        expect(interval1.renew({ id: 'renew' }).exact).toBe(false));
    });

    describe('#04 => for maxTicks', () => {
      test('#01 => Change', () =>
        expect(
          interval1.renew({ id: 'renew', maxTicks: 50 }).maxTicks,
        ).toBe(50));

      test('#02 => Keep', () =>
        expect(interval1.renew({ id: 'renew' }).maxTicks).toBe(10_000));
    });

    describe('#05 => for pauser', () => {
      test('#01 => Change', () => {
        const pauser = vi.fn(() => false);
        expect(interval1.renew({ id: 'renew', pauser }).pauser).toBe(
          pauser,
        );
      });

      test('#02 => Keep', () =>
        expect(interval1.renew({ id: 'renew' }).pauser).toBeUndefined());
    });
  });

  describe('#05 => maxTicks and pauser options', () => {
    describe('#01 => maxTicks option', () => {
      const callback = vi.fn();
      const interval = createInterval({
        id: 'maxticks-test',
        callback,
        interval: 100,
        maxTicks: 3,
      });

      const { start, advance, checkInterval, ticks } =
        createIntervalTests(interval);

      test(...start());
      test(...advance(300));
      describe(...checkInterval({ callTimes: 3, state: 'paused' }));
      test(...ticks(3));
      test(...advance(7_00));
      test(...ticks(3));
      describe(...checkInterval({ state: 'paused' }));
    });

    describe('#02 => pauser option', () => {
      describe('#01 => sync callback', () => {
        const callback = vi.fn();
        const pauser = vi.fn((_state, ticks) => ticks >= 2);

        const interval = createInterval({
          id: 'pauser-test',
          callback,
          interval: 100,
          pauser,
        });

        const { start, advance, checkInterval, ticks } =
          createIntervalTests(interval);

        test(...start());
        test(...advance(200));
        describe(...checkInterval({ state: 'paused' }));
        test(...ticks(2));
        test(...advance(200));
        test(...ticks(2));
        describe(...checkInterval({ state: 'paused' }));
      });

      describe('#02 => async callback', () => {
        let count = 0;
        const callback = async () => {
          await sleep(100);
          count++;
        };
        const pauser = vi.fn();

        const interval = createInterval({
          id: 'pauser-async-test',
          callback,
          interval: 100,
          pauser: typeMock<PauserListener>(
            pauser,
            (_, ticks) => ticks >= 2,
          ),
        });

        const { start, advance, checkInterval, ticks, resume } =
          createIntervalTests(interval);

        test(...start());
        test(...advance(200));
        test('#01 => count is 1', () => expect(count).toBe(1));
        test(...ticks(2));
        describe(...checkInterval({ state: 'paused' }));
        test(...advance(100));
        test('#02 => count is 2', () => expect(count).toBe(2));
        test(...ticks(2));
        test(...advance(200));
        test('#03 => count is 2', () => expect(count).toBe(2));
        test(...ticks(2));
        test(...resume());
        describe(...checkInterval({ state: 'active' }));
        test(...advance(200));
        test('#04 => count is 3', () => expect(count).toBe(3));
        test(...ticks(3));
        describe(...checkInterval({ state: 'paused' }));
        test(...resume());
        describe(...checkInterval({ state: 'active' }));
        test(...advance(200));
        test('#05 => count is 4', () => expect(count).toBe(4));
        test(...ticks(4));
        describe(...checkInterval({ state: 'paused' }));
      });
    });
  });

  describe('#06 => dispose', () => {
    const {
      start,
      resume,
      interval2,
      checkInterval,
      advanceTimes,
      pause,
      ticks,
      advanceIndex,
    } = createIntervalTests(
      createInterval({ id: 'dispose', callback: () => {} }),
    );

    const disposedConfig = {
      interval: 100,
      id: 'dispose',
      state: 'disposed',
      callTimes: 20,
    } as const;

    test(...start());
    describe(
      ...checkInterval({ interval: 100, id: 'dispose', state: 'active' }),
    );
    test(...advanceTimes(1));
    test(...ticks(1));
    test(...advanceTimes(9));
    describe(...checkInterval({ state: 'active', callTimes: 10 }));
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

  describe('#07 => Subscriptions flow', () => {
    const {
      start,
      pause,
      resume,
      advanceTimes,
      subscribe,
      unSubscribe,
      subscribed,
      checkInterval,
      ticks,
    } = createIntervalTests(
      createInterval({
        id: 'sub-interval',
        interval: 100,
        exact: true,
        callback: () => {},
      }),
    );

    const listener1 = vi.fn();
    const listener2 = vi.fn();

    test(...subscribed(false));
    test(...subscribe(listener1, 'sub1'));
    test(...subscribe(listener2, 'sub2'));
    test(...subscribed(true));
    describe(...checkInterval({ state: 'idle' }));
    test(...start());
    describe(...checkInterval({ state: 'active' }));

    describe('#01 => notify subscribers on start', () => {
      test('#01 => listener1', () =>
        expect(listener1).toHaveBeenLastCalledWith('active', 0));

      test('#02 => listener2', () =>
        expect(listener2).toHaveBeenLastCalledWith('active', 0));
    });
    test(...advanceTimes(1));
    test(...ticks(1));

    describe('#02 => notify subscribers on tick', () => {
      test('#01 => listener1', () =>
        expect(listener1).toHaveBeenLastCalledWith('active', 1));

      test('#02 => listener2', () =>
        expect(listener2).toHaveBeenLastCalledWith('active', 1));
    });
    test(...pause());
    describe(...checkInterval({ state: 'paused' }));

    describe('#03 => notify subscribers on pause', () => {
      test('#01 => listener1', () =>
        expect(listener1).toHaveBeenLastCalledWith('paused', 1));

      test('#02 => listener2', () =>
        expect(listener2).toHaveBeenLastCalledWith('paused', 1));
    });
    test(...resume());
    describe(...checkInterval({ state: 'active' }));

    describe('#04 => notify subscribers on resume', () => {
      test('#01 => listener1', () =>
        expect(listener1).toHaveBeenLastCalledWith('active', 1));

      test('#02 => listener2', () =>
        expect(listener2).toHaveBeenLastCalledWith('active', 1));
    });
    test(...unSubscribe('sub1'));
    test(...advanceTimes(2));
    test(...ticks(3));

    describe('#05 => notify sub2 on tick but not unsubscribed sub1', () => {
      test('#01 => listener2 notified', () =>
        expect(listener2).toHaveBeenLastCalledWith('active', 3));

      test('#02 => listener1 not notified', () =>
        expect(listener1).not.toHaveBeenLastCalledWith('active', 3));
    });
    test(...unSubscribe('sub2'));
    test(...subscribed(false));
  });
});
