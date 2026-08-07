import {
  createInterval,
  createInterval2,
  createTimeout,
  createTimeout2,
} from '@bemedev/interval2';

describe('Import from main "@bemedev/interval2"', () => {
  describe('#01 => createInterval', () => {
    test('#01 => is defined', () => expect(createInterval).toBeDefined());

    test('#02 => is a function', () =>
      expect(typeof createInterval).toBe('function'));
  });
  test('#02 => createInterval2 should equal createInterval', () =>
    expect(createInterval2).toBe(createInterval));
  describe('#03 => createTimeout', () => {
    test('#01 => is defined', () => expect(createTimeout).toBeDefined());

    test('#02 => is a function', () =>
      expect(typeof createTimeout).toBe('function'));
  });
  test('#04 => createTimeout2 should equal createTimeout', () =>
    expect(createTimeout2).toBe(createTimeout));
});
