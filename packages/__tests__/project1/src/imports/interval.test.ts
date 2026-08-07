import {
  create,
  createInterval,
  createInterval2,
} from '@bemedev/interval2/interval';

describe('Import from "@bemedev/interval2/interval"', () => {
  describe('#01 => createInterval', () => {
    test('#01 => is defined', () => expect(createInterval).toBeDefined());

    test('#02 => is a function', () =>
      expect(typeof createInterval).toBe('function'));
  });
  test('#02 => createInterval2 should equal createInterval', () =>
    expect(createInterval2).toBe(createInterval));

  test('#03 => create should equal createInterval', () =>
    expect(create).toBe(createInterval));
});
