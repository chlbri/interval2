import { createTimeout } from '@bemedev/interval2';
import { createTimeoutTests } from '@bemedev/interval2-vitest';
import { beforeAll, describe, expect, test, vi } from 'vitest';

describe('#01 => Timeout2', () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  describe('#01 => timeout creation', () => {
    const { checkTimeout } = createTimeoutTests(
      createTimeout({ id: 'test-timeout', callback: () => {} }),
    );

    describe(
      ...checkTimeout({
        id: 'test-timeout',
        timeout: 1000,
        state: 'idle',
      }),
    );
  });

  describe('#02 => timeout execution', () => {
    const { start, checkTimeout, runAllTimers } = createTimeoutTests(
      createTimeout({
        id: 'test-timeout',
        callback: () => {},
        timeout: 500,
      }),
    );

    describe(...checkTimeout({ state: 'idle' }));
    test(...start());
    describe(...checkTimeout({ state: 'active' }));
    test(...runAllTimers());
    describe(...checkTimeout({ state: 'disposed' }));
  });

  describe('#03 => timeout pause and resume', () => {
    const { start, pause, resume, advance, checkTimeout } =
      createTimeoutTests(
        createTimeout({
          id: 'test-timeout',
          callback: () => {},
          timeout: 1000,
        }),
      );

    test(...start());
    describe(...checkTimeout({ state: 'active' }));
    test(...advance(300));
    describe(...checkTimeout({ state: 'active' }));
    test(...pause());
    describe(...checkTimeout({ state: 'paused' }));
    test(...advance(1000));
    describe(...checkTimeout({ state: 'paused' }));
    test(...resume());
    describe(...checkTimeout({ state: 'active' }));
    test(...advance(700));
    describe(...checkTimeout({ state: 'disposed' }));
  });

  describe('#04 => All tests', () => {
    const { start, advanceIndex, advance, checkTimeout, timeout } =
      createTimeoutTests(
        createTimeout({
          id: 'test-timeout',
          callback: () => {},
          timeout: 1000,
        }),
      );

    test(...start());
    describe(...checkTimeout({ state: 'active' }));
    test('#02 => async dispose', timeout[Symbol.asyncDispose]);
    test(...advanceIndex());
    describe(...checkTimeout({ state: 'disposed' }));
    test(...advance(1000));
    describe(...checkTimeout({ state: 'disposed' }));
    test(...advance(1000));
    describe(...checkTimeout({ state: 'disposed' }));

    describe('#07 => should renew', () => {
      const {
        start,
        advance,
        checkTimeout,
        timeout: timeout2,
      } = createTimeoutTests(timeout.renew({ id: 'test-timeout' }));

      describe('#01 => creation tests', () => {
        describe(
          ...checkTimeout({
            id: 'test-timeout',
            timeout: 1000,
            state: 'idle',
          }),
        );
        test('#02 => same timeout as previous', () =>
          expect(timeout2.timeout).toBe(timeout.timeout));
      });

      describe('#02 => execution tests', () => {
        test(...start());
        describe(...checkTimeout({ state: 'active' }));
        test(...start());
        describe(...checkTimeout({ state: 'active' }));
        test(...advance(1000));
        describe(...checkTimeout({ state: 'disposed' }));
      });
    });
  });

  describe('#05 => Symbol.asyncDispose', () => {
    const { start, checkTimeout, advance, timeout } = createTimeoutTests(
      createTimeout({
        id: 'test-timeout',
        callback: () => {},
        timeout: 1000,
      }),
    );

    test(...start());
    describe(...checkTimeout({ state: 'active' }));
    test('#03 => dispose the timeout', timeout[Symbol.asyncDispose]);
    describe(...checkTimeout({ state: 'disposed' }));
    test(...advance(1000));
    describe(...checkTimeout({ state: 'disposed' }));
  });

  describe('#06 => pause behavior', () => {
    const { pause, dispose, checkTimeout } = createTimeoutTests(
      createTimeout({
        id: 'test-timeout',
        callback: () => {},
        timeout: 1000,
      }),
    );

    describe(...checkTimeout({ state: 'idle' }));
    test(...pause());
    describe(...checkTimeout({ state: 'idle' }));
    test(...dispose());
    describe(...checkTimeout({ state: 'disposed' }));
    test(...pause());
    describe(...checkTimeout({ state: 'disposed' }));
  });

  describe('#07 => Renew with new properties', () => {
    const baseTimeout = createTimeout({
      id: 'test-timeout',
      callback: () => {},
      timeout: 1000,
    });

    describe('#01 => for id', () => {
      describe('#01 => Change', () => {
        const { checkTimeout } = createTimeoutTests(
          baseTimeout.renew({ id: 'new-id' }),
        );

        describe(...checkTimeout({ id: 'new-id' }));
      });

      describe('#02 => Keep', () => {
        const { checkTimeout } = createTimeoutTests(
          baseTimeout.renew({ id: 'test-timeout' }),
        );

        describe(...checkTimeout({ id: 'test-timeout' }));
      });
    });

    describe('#02 => for timeout', () => {
      describe('#01 => Change', () => {
        const { checkTimeout } = createTimeoutTests(
          baseTimeout.renew({ id: 'test-timeout', timeout: 2000 }),
        );

        describe(...checkTimeout({ timeout: 2000 }));
      });

      describe('#02 => Keep', () => {
        const { checkTimeout } = createTimeoutTests(
          baseTimeout.renew({ id: 'test-timeout' }),
        );

        describe(...checkTimeout({ timeout: 1000 }));
      });
    });
  });

  describe('#08 => Subscriptions flow', () => {
    const {
      start,
      pause,
      resume,
      advance,
      subscribe,
      unSubscribe,
      subscribed,
      checkTimeout,
    } = createTimeoutTests(
      createTimeout({
        id: 'sub-timeout',
        callback: () => {},
        timeout: 1000,
      }),
    );

    const listener1 = vi.fn();
    const listener2 = vi.fn();

    test(...subscribed(false));
    test(...subscribe(listener1, 'sub1'));
    test(...subscribe(listener2, 'sub2'));
    test(...subscribed(true));
    describe(...checkTimeout({ state: 'idle' }));
    test(...start());
    describe(...checkTimeout({ state: 'active' }));

    describe('#01 => notify subscribers on start', () => {
      test('#01 => listener1', () => {
        expect(listener1).toHaveBeenLastCalledWith('active');
      });

      test('#02 => listener2', () => {
        expect(listener2).toHaveBeenLastCalledWith('active');
      });
    });
    test(...pause());
    describe(...checkTimeout({ state: 'paused' }));

    describe('#02 => notify subscribers on pause', () => {
      test('#01 => listener1', () => {
        expect(listener1).toHaveBeenLastCalledWith('paused');
      });

      test('#02 => listener2', () => {
        expect(listener2).toHaveBeenLastCalledWith('paused');
      });
    });

    test(...resume());
    describe(...checkTimeout({ state: 'active' }));

    describe('#03 => notify subscribers on resume', () => {
      test('#01 => listener1', () => {
        expect(listener1).toHaveBeenLastCalledWith('active');
      });

      test('#02 => listener2', () => {
        expect(listener2).toHaveBeenLastCalledWith('active');
      });
    });

    test(...unSubscribe('sub1'));
    test(...advance(1000));
    describe(...checkTimeout({ state: 'disposed' }));

    describe('#04 => notify subscribers on dispose', () => {
      test('#01 => listener2 notified', () =>
        expect(listener2).toHaveBeenLastCalledWith('disposed'));

      test('#02 => listener1 not notified', () =>
        expect(listener1).not.toHaveBeenLastCalledWith('disposed'));
    });
    test(...unSubscribe('sub2'));
    test(...subscribed(false));
  });
});
