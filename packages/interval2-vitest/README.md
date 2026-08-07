# `@bemedev/interval2-vitest`

Vitest testing utilities and fixtures for `@bemedev/interval2`.

## Installation

```bash
pnpm add -D @bemedev/interval2-vitest
```

## Package Exports

This package provides multiple export subpaths configured in
`package.json`:

| Export Subpath | Import Path                          | Description                                                    |
| -------------- | ------------------------------------ | -------------------------------------------------------------- |
| `.`            | `@bemedev/interval2-vitest`          | Main entry point exporting all interval & timeout test helpers |
| `./interval`   | `@bemedev/interval2-vitest/interval` | Vitest test utilities specifically for `Interval2`             |
| `./timeout`    | `@bemedev/interval2-vitest/timeout`  | Vitest test utilities specifically for `Timeout2`              |

<br/>

## Usage Examples

### 1. Main Entry Point (`@bemedev/interval2-vitest`)

```ts
import { createInterval, createTimeout } from '@bemedev/interval2';
import {
  createIntervalTest,
  createTimeoutTest,
} from '@bemedev/interval2-vitest';
import { describe, test } from 'vitest';

describe('Interval Test', () => {
  const { start, checkInterval, advanceTimes, pause } = createIntervalTest(
    createInterval({ id: 'test-interval', interval: 100, exact: true }),
  );

  describe(...checkInterval({ exact: true }));
  test(...start());
  test(...advanceTimes(1));
  test(...pause());
});

describe('Timeout Test', () => {
  const { start, checkTimeout, advance, pause } = createTimeoutTest(
    createTimeout({ id: 'test-timeout', timeout: 1000 }),
  );

  describe(...checkTimeout({ timeout: 1000, state: 'idle' }));
  test(...start());
  test(...advance(1000));
  test(...pause());
});
```

### 2. Interval Subpath (`@bemedev/interval2-vitest/interval`)

```ts
import { createInterval } from '@bemedev/interval2';
import {
  createIntervalTest,
  type IntervalParamTests,
} from '@bemedev/interval2-vitest/interval';
import { describe, test } from 'vitest';

const interval = createInterval({ id: 'interval-1', interval: 100 });
const { start, checkInterval, advanceTimes, pause } =
  createIntervalTest(interval);

const params: IntervalParamTests = {
  id: 'interval-1',
  state: 'idle',
  interval: 100,
};
describe(...checkInterval(params));
test(...start());
test(...advanceTimes(2));
test(...pause());
```

### 3. Timeout Subpath (`@bemedev/interval2-vitest/timeout`)

```ts
import { createTimeout } from '@bemedev/interval2';
import {
  createTimeoutTest,
  type TimeoutParamTests,
} from '@bemedev/interval2-vitest/timeout';
import { describe, test } from 'vitest';

const timeout = createTimeout({ id: 'timeout-1', timeout: 500 });
const { start, checkTimeout, advance, pause } = createTimeoutTest(timeout);

const params: TimeoutParamTests = {
  id: 'timeout-1',
  state: 'idle',
  timeout: 500,
};
describe(...checkTimeout(params));
test(...start());
test(...advance(500));
test(...pause());
```

## License

MIT
