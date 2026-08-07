import {
  create,
  createTimeout,
  createTimeout2,
  type Timeout2,
} from '@bemedev/interval2/timeout';
import { expectTypeOf } from 'vitest';

describe('Import from "@bemedev/interval2/timeout"', () => {
  describe('#01 => createTimeout', () => {
    test('#01 => is defined', () => expect(createTimeout).toBeDefined());

    test('#02 => is a function', () =>
      expect(typeof createTimeout).toBe('function'));
  });
  test('#02 => createTimeout2 should equal createTimeout', () =>
    expect(createTimeout2).toBe(createTimeout));

  test('#03 => create should equal createTimeout', () =>
    expect(create).toBe(createTimeout));

  test('#04 => type exports should be valid', () =>
    expectTypeOf({} as Timeout2).toBeObject());
});
