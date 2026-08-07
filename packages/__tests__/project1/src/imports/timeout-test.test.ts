import {
  createTimeoutTests,
  createTests,
} from '@bemedev/interval2-vitest/timeout';

test('"createIntervalTests" and "createTests" are equals', () => {
  expect(createTimeoutTests).toBe(createTests);
});
