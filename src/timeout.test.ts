import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createTimeout } from './timeout';

describe('#01 => Timeout2', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  describe('0#1 => timeout creation', () => {
    const callback = vi.fn();
    const timeout = createTimeout({
      id: 'test-timeout',
      callback,
    });
    it('#01 => should create a timeout with correct id', () => {
      expect(timeout.id).toBe('test-timeout');
    });

    it('#02 => should create a timeout with default timeout value', () => {
      expect(timeout.timeout).toBe(1000);
    });

    it('#03 => should create a timeout with idle state', () => {
      expect(timeout.state).toBe('idle');
    });
  });

  describe('#02 => timeout execution', () => {
    const callback = vi.fn();
    const timeout = createTimeout({
      id: 'test-timeout',
      callback,
      timeout: 500,
    });

    describe('#01 => should not execute callback before starting', () => {
      it('#01 => should have idle state initially', () => {
        return expect(timeout.state).toBe('idle');
      });

      it('#02 => should not call callback before starting', () => {
        expect(callback).not.toHaveBeenCalled();
      });
    });

    it('#02 => start the machine', () => {
      timeout.start();
    });

    it('#03 => should change state to active after starting', () => {
      expect(timeout.state).toBe('active');
    });

    it('#04 => Advance to timeout ms', () => {
      vi.advanceTimersByTime(500);
    });

    it('#05 => should call callback one times after timeout', () => {
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('#06 => should change state to disposed after execution', () => {
      expect(timeout.state).toBe('disposed');
    });
  });

  describe('#03 => timeout pause and resume', () => {
    const callback = vi.fn();
    const timeout = createTimeout({
      id: 'test-timeout',
      callback,
      timeout: 1000,
    });

    it('#01 => should start the timeout', () => {
      timeout.start();
    });

    it('#02 => should have active state after starting', () => {
      expect(timeout.state).toBe('active');
    });

    it('#03 => should advance time by 300ms', () => {
      vi.advanceTimersByTime(300);
    });

    it('#04 => should still be active after partial time', () => {
      expect(timeout.state).toBe('active');
    });

    it('#05 => callback should not be called yet', () => {
      expect(callback).not.toHaveBeenCalled();
    });

    it('#06 => pause the timeout', timeout.pause);

    it('#07 => should have paused state after pausing', () => {
      expect(timeout.state).toBe('paused');
    });

    it('#08 => should advance time by full timeout duration while paused', () => {
      vi.advanceTimersByTime(1000);
    });

    it('#09 => should not call callback while paused', () => {
      expect(callback).not.toHaveBeenCalled();
    });

    it('#10 => should still be paused after full timeout duration', () => {
      expect(timeout.state).toBe('paused');
    });

    it('#11 => should resume the timeout', timeout.resume);

    it('#12 => should have active state after resuming', () => {
      expect(timeout.state).toBe('active');
    });

    it('#13 => should advance remaining time (700ms)', () => {
      vi.advanceTimersByTime(700);
    });

    it('#14 => should call callback after remaining time', () => {
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('#15 => should change state to disposed after execution', () => {
      expect(timeout.state).toBe('disposed');
    });
  });

  describe('#04 => All tests', () => {
    const callback = vi.fn();
    const timeout = createTimeout({
      id: 'test-timeout',
      callback,
      timeout: 1000,
    });

    it('#01 => should start the timeout', timeout.start);

    it('#02 => should have active state after starting', () => {
      expect(timeout.state).toBe('active');
    });

    it('#03 => should stop the timeout', timeout.stop);

    it('#04 => should have disposed state after stopping', () => {
      expect(timeout.state).toBe('disposed');
    });

    it('#05 => should advance time by full timeout duration', () => {
      vi.advanceTimersByTime(1000);
    });

    it('#06 => should not call callback after stopping', () => {
      expect(callback).not.toHaveBeenCalled();
    });

    it('#07 => should advance time by full timeout duration', () => {
      vi.advanceTimersByTime(1000);
    });

    it('#06 => should not call callback, after all of this waiting', () => {
      expect(callback).not.toHaveBeenCalled();
    });

    describe('#07 => should renew', () => {
      const timeout2 = timeout.renew();

      describe('#01 => creation tests', () => {
        it('#01 => should create a new timeout with same id', () => {
          expect(timeout2.id).toBe('test-timeout');
        });

        describe('#03 => should create a new timeout with default timeout value', () => {
          it('#01 => should have timeout of 1000ms', () => {
            expect(timeout2.timeout).toBe(1000);
          });

          it('#02 => should have same timeout like previous one', () => {
            expect(timeout2.timeout).toBe(timeout.timeout);
          });
        });

        it('#04 => should have idle state after renewal', () => {
          expect(timeout2.state).toBe('idle');
        });
      });

      describe('#02 => execution tests', () => {
        it('#01 => should start the renewed timeout', timeout2.start);

        it('#02 => should have active state after starting', () => {
          expect(timeout2.state).toBe('active');
        });

        it('#03 => should not call callback before timeout', () => {
          expect(callback).not.toHaveBeenCalled();
        });

        it('#04 => start again', timeout2.start);

        it('#05 => should not start when already started', () => {
          expect(timeout2.state).toBe('active');
        });

        it('#06 => should advance time by full timeout duration', () => {
          vi.advanceTimersByTime(1000);
        });

        it('#07 => should call callback one time after renewed timeout', () => {
          expect(callback).toHaveBeenCalledTimes(1);
        });

        it('#08 => should change state to disposed after execution', () => {
          expect(timeout2.state).toBe('disposed');
        });
      });
    });
  });

  describe('#05 => Symbol.asyncDispose', () => {
    const callback = vi.fn();
    const timeout = createTimeout({
      id: 'test-timeout',
      callback,
      timeout: 1000,
    });

    it('#01 => should start the timeout', timeout.start);

    it('#02 => should have active state after starting', () => {
      expect(timeout.state).toBe('active');
    });

    it('#03 => should dispose the timeout', timeout[Symbol.asyncDispose]);

    it('#04 => should have disposed state after disposal', () => {
      expect(timeout.state).toBe('disposed');
    });

    it('#05 => should advance time by full timeout duration', () => {
      vi.advanceTimersByTime(1000);
    });

    it('#06 => should not call callback after disposal', () => {
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('#06 => pause behavior', () => {
    const callback = vi.fn();
    const timeout = createTimeout({
      id: 'test-timeout',
      callback,
      timeout: 1000,
    });

    it('#01 => should start with idle state', () => {
      expect(timeout.state).toBe('idle');
    });

    it('#02 => try to pause', timeout.pause);

    it('#02 => should not pause when idle', () => {
      expect(timeout.state).toBe('idle');
    });

    it('#03 => should stop the timeout', timeout.stop);

    it('#04 => should have disposed state after stopping', () => {
      expect(timeout.state).toBe('disposed');
    });

    it('#05 => try to pause when disposed', timeout.pause);

    it('#06 => should not pause when disposed', () => {
      expect(timeout.state).toBe('disposed');
    });
  });

  describe('#07 => Renew with new properties', () => {
    const callback = vi.fn();
    const timeout = createTimeout({
      id: 'test-timeout',
      callback,
      timeout: 1000,
    });

    describe('#01 => for id', () => {
      it('#01 => Change', () => {
        const renewedTimeout = timeout.renew({ id: 'new-id' });
        expect(renewedTimeout.id).toBe('new-id');
      });

      it('#02 => Keep', () => {
        const renewedTimeout = timeout.renew();
        expect(renewedTimeout.id).toBe('test-timeout');
      });
    });

    describe('#02 => for timeout', () => {
      it('#01 => Change', () => {
        const renewedTimeout = timeout.renew({ timeout: 2000 });
        expect(renewedTimeout.timeout).toBe(2000);
      });

      it('#02 => Keep', () => {
        const renewedTimeout = timeout.renew();
        expect(renewedTimeout.timeout).toBe(1000);
      });
    });
  });
});
