import {
  createIntervalTests,
  createTests,
} from '@bemedev/interval2-vitest/interval';

test('"createIntervalTests" and "createTests" are equals', () => {
  expect(createIntervalTests).toBe(createTests);
});
