# `@bemedev/interval2-vitest`

Vitest testing utilities and fixtures for `@bemedev/interval2`.

## Installation

```bash
pnpm add -D @bemedev/interval2-vitest
```

## Package Exports

This package provides multiple export subpaths configured in
`package.json`:

| Export Subpath | Import Path                          | Description                                                                               |
| -------------- | ------------------------------------ | ----------------------------------------------------------------------------------------- |
| `.`            | `@bemedev/interval2-vitest`          | Main entry point exporting all interval & timeout test helpers                            |
| `./interval`   | `@bemedev/interval2-vitest/interval` | Vitest test utilities specifically for `Interval2` (`createIntervalTests`, `createTests`) |
| `./timeout`    | `@bemedev/interval2-vitest/timeout`  | Vitest test utilities specifically for `Timeout2` (`createTimeoutTests`, `createTests`)   |

<br/>

## Detailed Function Reference

### 1. Interval Testing (`createIntervalTests` / `createTests`)

Imported from `@bemedev/interval2-vitest/interval` or
`@bemedev/interval2-vitest`.

```ts
const {
  interval2,
  start,
  pause,
  resume,
  ticks,
  checkInterval,
  advanceTimes,
  advance,
  advanceIndex,
  subscribe,
  unSubscribe,
  subscribed,
  callback,
} = createIntervalTests(intervalInstance);
```

#### Functions Explained

- **`start()`**: Returns `[title, startFn]` tuple. Starts the interval
  execution. Spread directly into a Vitest step: `test(...start())`.
- **`pause()`**: Returns `[title, pauseFn]` tuple. Pauses the running
  interval. Spread directly into a Vitest step: `test(...pause())`.
- **`resume()`**: Returns `[title, resumeFn]` tuple. Alias for `start()`,
  resumes a paused interval. Spread into `test(...resume())`.
- **`ticks(times = 1)`**: Returns `[title, assertionFn]` tuple. Asserts
  that `interval2.ticks` equals `times`. Usage: `test(...ticks(3))`.
- **`checkInterval(options: IntervalParamTests)`**: Returns
  `[title, suiteFn]` tuple. Executes a group of Vitest assertions checking:
  - `id`: Unique identifier string match (`expect(interval2.id).toBe(id)`)
  - `state`: Current timer state (`expect(interval2.state).toBe(state)`)
  - `interval`: Milliseconds interval
    (`expect(interval2.interval).toBe(interval)`)
  - `exact`: Exact timing boolean flag
    (`expect(interval2.exact).toBe(exact)`)
  - `callTimes`: Total callback invocations count
    (`expect(callback).toHaveBeenCalledTimes(callTimes)`) Spread into
    `describe(...checkInterval({ state: 'active', callTimes: 2 }))`.
- **`advanceTimes(times = 1)`**: Returns `[title, advanceFn]` tuple.
  Advances Vitest fake timers by `interval2.interval * times`. Usage:
  `test(...advanceTimes(2))`.
- **`advance(ms: number)`**: Returns `[title, advanceFn]` tuple. Advances
  Vitest fake timers by `ms` milliseconds. Usage: `test(...advance(500))`.
- **`advanceIndex()`**: Returns `[title, emptyFn]` tuple. Increments the
  step description index number without running any assertion.
- **`subscribe(listener: IntervalListener, id: string)`**: Returns
  `[title, subFn]` tuple. Attaches a state listener with identifier `id`.
  Usage: `test(...subscribe(fn, 'listener-1'))`.
- **`unSubscribe(id: string)`**: Returns `[title, unsubFn]` tuple. Removes
  the state listener associated with identifier `id`. Usage:
  `test(...unSubscribe('listener-1'))`.
- **`subscribed(value: boolean)`**: Returns `[title, assertionFn]` tuple.
  Asserts subscription status (`expect(interval2.subscribed).toBe(value)`).
  Usage: `test(...subscribed(true))`.
- **`callback`**: A Vitest mock function `vi.fn()` wrapping the original
  interval callback, allowing custom assertion queries
  (`expect(callback)...`).
- **`interval2`**: The active renewed instance of `Interval2`.

---

### 2. Timeout Testing (`createTimeoutTests` / `createTests`)

Imported from `@bemedev/interval2-vitest/timeout` or
`@bemedev/interval2-vitest`.

```ts
const {
  timeout,
  start,
  pause,
  resume,
  dispose,
  checkTimeout,
  advance,
  runAllTimers,
  advanceIndex,
  subscribe,
  unSubscribe,
  subscribed,
} = createTimeoutTests(timeoutInstance);
```

#### Functions Explained

- **`start()`**: Returns `[title, startFn]` tuple. Starts the timeout
  timer. Spread directly into a Vitest step: `test(...start())`.
- **`pause()`**: Returns `[title, pauseFn]` tuple. Pauses the active
  timeout while preserving remaining execution time. Spread into
  `test(...pause())`.
- **`resume()`**: Returns `[title, resumeFn]` tuple. Resumes the paused
  timeout using remaining duration. Spread into `test(...resume())`.
- **`dispose()`**: Returns `[title, disposeFn]` tuple. Disposes the timeout
  instance and clears timers/subscribers. Spread into `test(...dispose())`.
- **`checkTimeout(options: TimeoutParamTests)`**: Returns
  `[title, suiteFn]` tuple. Executes a group of Vitest assertions checking:
  - `id`: Unique identifier string match (`expect(timeout.id).toBe(id)`)
  - `state`: Current timer state (`expect(timeout.state).toBe(state)`)
  - `timeout`: Timeout duration in milliseconds
    (`expect(timeout.timeout).toBe(timeoutVal)`) Spread into
    `describe(...checkTimeout({ state: 'idle', timeout: 1000 }))`.
- **`advance(ms: number)`**: Returns `[title, advanceFn]` tuple. Advances
  Vitest fake timers by `ms` milliseconds. Usage: `test(...advance(1000))`.
- **`runAllTimers()`**: Returns `[title, runFn]` tuple. Runs all pending
  fake timers via `vitest.runAllTimers()`. Usage:
  `test(...runAllTimers())`.
- **`advanceIndex()`**: Returns `[title, emptyFn]` tuple. Increments step
  index formatting without executing assertions.
- **`subscribe(listener: TimeoutListener, id: string)`**: Returns
  `[title, subFn]` tuple. Attaches a timeout state listener with identifier
  `id`. Usage: `test(...subscribe(fn, 'sub-1'))`.
- **`unSubscribe(id: string)`**: Returns `[title, unsubFn]` tuple. Removes
  the timeout state listener associated with identifier `id`. Usage:
  `test(...unSubscribe('sub-1'))`.
- **`subscribed(value: boolean)`**: Returns `[title, assertionFn]` tuple.
  Asserts subscription presence (`expect(timeout.subscribed).toBe(value)`).
  Usage: `test(...subscribed(false))`.
- **`timeout`**: The active renewed instance of `Timeout2`.

<br/>

## Usage Examples

### 1. Main Entry Point (`@bemedev/interval2-vitest`)

```ts
import { createInterval, createTimeout } from '@bemedev/interval2';
import {
  createIntervalTests,
  createTimeoutTests,
} from '@bemedev/interval2-vitest';
import { describe, test } from 'vitest';

describe('Interval Test', () => {
  const { start, checkInterval, advanceTimes, pause } =
    createIntervalTests(
      createInterval({ id: 'test-interval', interval: 100, exact: true }),
    );

  describe(...checkInterval({ exact: true }));
  test(...start());
  test(...advanceTimes(1));
  test(...pause());
});

describe('Timeout Test', () => {
  const { start, checkTimeout, advance, pause } = createTimeoutTests(
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
  createIntervalTests, // or createTests (same function)
  type IntervalParamTests,
} from '@bemedev/interval2-vitest/interval';
import { describe, test } from 'vitest';

const interval = createInterval({ id: 'interval-1', interval: 100 });
const { start, checkInterval, advanceTimes, pause } =
  createIntervalTests(interval);

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
  createTimeoutTests, // or createTests (same function)
  type TimeoutParamTests,
} from '@bemedev/interval2-vitest/timeout';
import { describe, test } from 'vitest';

const timeout = createTimeout({ id: 'timeout-1', timeout: 500 });
const { start, checkTimeout, advance, pause } =
  createTimeoutTests(timeout);

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
