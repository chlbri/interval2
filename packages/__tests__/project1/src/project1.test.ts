import { createInterval, createTimeout } from '@bemedev/interval2';

describe('project1 integration test', () => {
  test('exports createInterval and createTimeout functions', () => {
    expect(createInterval).toBeDefined();
    expect(typeof createInterval).toBe('function');
    expect(createTimeout).toBeDefined();
    expect(typeof createTimeout).toBe('function');
  });
});
