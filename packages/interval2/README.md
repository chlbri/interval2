# Interval2 & Timeout2

<br/>

A cancellable interval and timeout library for Node.js that allows you to
create intervals and timeouts that can be easily started, paused, and
renewed. This library provides enhanced control over timing execution,
making it suitable for various timing-related tasks in your applications.

<br/>

## Installation

```bash
# Using npm
npm install @bemedev/interval2
```

```bash
# Using bun
bun add @bemedev/interval2
```

```bash
# Using pnpm
pnpm add @bemedev/interval2
```

```bash
# Using yarn
yarn add @bemedev/interval2
```

<br/>

## Package Exports

This package provides multiple export subpaths configured in
`package.json`:

| Export Subpath | Import Path                   | Description                                                                     |
| -------------- | ----------------------------- | ------------------------------------------------------------------------------- |
| `.`            | `@bemedev/interval2`          | Main entry point re-exporting core `createInterval` & `createTimeout` utilities |
| `./interval`   | `@bemedev/interval2/interval` | Interval exports (`createInterval`, `createInterval2`, `Interval2`)             |
| `./timeout`    | `@bemedev/interval2/timeout`  | Timeout exports (`createTimeout`, `createTimeout2`, `Timeout2`)                 |
| `./timer`      | `@bemedev/interval2/timer`    | Abstract base class `Timer2`                                                    |
| `./types`      | `@bemedev/interval2/types`    | All TypeScript type definitions                                                 |
| `./helpers`    | `@bemedev/interval2/helpers`  | Re-exports sleep utilities from `@bemedev/sleep`                                |

<br/>

## Usage

### Interval2

```typescript
import { createInterval } from '@bemedev/interval2';

const interval = createInterval({
  id: 'my-interval',
  interval: 1000,
  callback: () => {
    console.log('Interval executed');
  },
});

// Start the interval
interval.start();

// Pause the interval
interval.pause();

// Renew the interval with new settings
const renewed = interval.renew({ interval: 2000 });

// Dispose the interval
interval.dispose();
```

### Timeout2

```typescript
import { createTimeout } from '@bemedev/interval2';

const timeout = createTimeout({
  id: 'my-timeout',
  callback: () => {
    console.log('Timeout executed');
  },
  timeout: 2000, // 2 seconds
});

// Start the timeout
timeout.start();

// Pause the timeout (preserves remaining time)
timeout.pause();

// Resume the timeout with remaining duration
timeout.resume();

// Dispose the timeout completely
timeout.dispose();
```

<br/>

## Detailed API Reference

### 1. `Interval2` (`createInterval` / `createInterval2` / `create`)

Factory function `createInterval(options: IntervalParams)` instantiates a
cancellable interval timer instance.

#### Configuration Options (`IntervalParams`)

- **`id`** (`string`, mandatory): Unique string identifier for the interval
  instance.
- **`callback`** (`Cb`, mandatory): Execution callback function
  (`() => void`).
- **`interval`** (`number`, optional): Duration in milliseconds between
  ticks (defaults to `100`).
- **`exact`** (`boolean`, optional): Flag for exact timing calculation
  (defaults to `false`).
- **`maxTicks`** (`number`, optional): Maximum tick count limit before
  automatic pause (defaults to `10000`).
- **`pauser`** (`PauserListener`, optional): Custom predicate function
  `(state, ticks) => boolean` returning `true` to pause.

#### Instance Methods & Properties

- **`start()`**: Starts or resumes the interval timer. Transitions `state`
  to `'active'`. Returns current `TimerState`.
- **`pause()`**: Pauses the active interval timer. Transitions `state` to
  `'paused'`. Returns current `TimerState`.
- **`resume()`**: Alias for `start()`. Resumes the paused interval. Returns
  current `TimerState`.
- **`renew(params: RenewIntervalParams)`**: Returns a new `Interval2`
  instance with updated/merged configuration options (`id` is required,
  remaining options default to existing instance parameters).
- **`subscribe(listener: IntervalListener)`**: Registers a state/tick
  listener `(state: TimerState, ticks: number) => any`. Returns an
  unsubscribe cleanup function `() => boolean`.
- **`dispose()` / `[Symbol.dispose]()` / `[Symbol.asyncDispose]()`: Clears
  active timer handles, resets timing state, sets `state = 'disposed'`, and
  removes all subscribers.
- **`get state()`**: Returns current lifecycle state
  (`'idle' | 'active' | 'paused' | 'disposed'`).
- **`get interval()`**: Returns configured interval duration in
  milliseconds.
- **`get exact()`**: Returns `true` if exact timing calculation is enabled.
- **`get ticks()`**: Returns total executed tick count.
- **`get maxTicks()`**: Returns maximum allowed tick limit before
  auto-pausing.
- **`get pauser()`**: Returns custom pauser predicate listener if defined.
- **`get subscribed()`**: Returns `true` if active subscribers exist.

---

### 2. `Timeout2` (`createTimeout` / `createTimeout2` / `create`)

Factory function `createTimeout(options: TimeoutParams)` instantiates a
cancellable timeout timer instance.

#### Configuration Options (`TimeoutParams`)

- **`id`** (`string`, mandatory): Unique string identifier for the timeout
  instance.
- **`callback`** (`Cb`, mandatory): Execution callback function
  (`() => void`).
- **`timeout`** (`number`, optional): Duration in milliseconds before
  timeout triggers (defaults to `1000`).

#### Instance Methods & Properties

- **`start()`**: Starts fresh or resumes the timeout timer. Uses remaining
  time if resuming from pause. Transitions `state` to `'active'`. Returns
  current `TimerState`.
- **`pause()`**: Pauses the active timeout timer and calculates remaining
  time. Transitions `state` to `'paused'`. Returns current `TimerState`.
- **`resume()`**: Resumes the paused timeout using remaining time (calls
  `start()`). Returns current `TimerState`.
- **`renew(params: RenewTimeoutParams)`**: Returns a new `Timeout2`
  instance with updated/merged configuration options (`id` is required,
  remaining options default to existing instance parameters).
- **`subscribe(listener: TimeoutListener)`**: Registers a state listener
  `(state: TimerState) => any`. Returns an unsubscribe cleanup function
  `() => boolean`.
- **`dispose()` / `[Symbol.dispose]()` / `[Symbol.asyncDispose]()`: Clears
  active timeout handle, resets remaining duration, sets
  `state = 'disposed'`, and removes all subscribers.
- **`get state()`**: Returns current lifecycle state
  (`'idle' | 'active' | 'paused' | 'disposed'`).
- **`get timeout()`**: Returns configured timeout duration in milliseconds.
- **`get subscribed()`**: Returns `true` if active subscribers exist.

## Features

- **Interval2**: Repeating execution with start, pause, and dispose
  capabilities
- **Timeout2**: Single execution with pause, resume, and stop capabilities
- Start, pause and dispose intervals and timeouts
- Renew intervals and timeouts with new settings
- State management ('idle', 'active', 'paused', 'disposed')
- Resource management with Symbol.dispose support
- 100% test coverage
- Integration with CI/CD pipeline
- TypeScript support
- Improved performance for timing execution

<br/>

## Licence

MIT

<br/>

## CHANGE_LOG

<details>

<summary>
View changes log
</summary>

### Version [1.2.1] - 07/08/2026 --> _01:08_

- Add Detailed API Reference section and Package Exports table to
  `README.md`
- Update dependencies including `rolldown` `^1.2.3`

### Version [1.2.0] - 07/08/2026 --> _00:35_

- Update JSDoc documentation across all TypeScript modules following
  standard guidelines
- Update test scripts in package.json for monorepo workspace compatibility

### Version [1.1.4] - 30/07/2026 --> _14:41_

- refactor: Extract `testInterval` helper from `interval.ts` into
  `interval.fixtures.ts`

### Version [1.1.3] - 30/07/2026 --> _14:37_

- refactor(tsconfig): Standardize tsconfig configuration across monorepo
  packages

### Version [1.1.2] - 30/07/2026 --> _14:34_

- fix(package): Exclude lib/node_modules directory from published package
  files

### Version [1.1.1] - 30/07/2026 --> _14:30_

- chore(deps): Add tslib dependency

### Version [1.1.0] - 30/07/2026 --> _14:02_

- refactor: Reorganize codebase into a pnpm monorepo structure
- feat(workspace): Add pnpm monorepo workspace configuration
- update(deps): Add `@bemedev/sleep` dependency to `@bemedev/interval2`
- update(ci): Update GitHub Actions workflow for NPM publishing from
  monorepo package

### Version [1.0.1] - 26/05/2026 --> _15:08_

- Clean up rolldown configuration by removing empty plugins array

### Version [1.0.0] - 26/05/2026 --> _14:57_

- Replace Rollup with Rolldown for improved build performance
- Migrate from ESLint + Prettier to OxLint + OxFmt for faster linting
- Add Node.js library development container configuration
- Enhance CI process with improved timing and reporting

### Version [0.1.3] --> _02:20_

- fix: Remove all console.log

### Version [0.1.2] --> _01:50_

- feat(timeout): Add new Timeout2 class with pause and stop capabilities
- feat(types): Add TimeoutParams type for timeout configuration

### Version [0.1.1] --> _15:10_

- Remove console.log

### Version [0.1.0] --> _15:00_

- ✨ First version of library
- Added basic interval functionality
- Implemented start and stop methods
- Included error handling for invalid intervals
- Provided documentation for usage
- Added unit tests for core features
- Integrated with CI/CD pipeline
- Improved performance for interval execution
- Fixed bugs related to interval overlap
- Enhanced logging for debugging purposes
- Updated dependencies to latest versions

<br/>

</details>

<br/>

## Author

chlbri (bri_lvi@icloud.com)

[My github](https://github.com/chlbri?tab=repositories)

[<svg width="98" height="96" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#24292f"/></svg>](https://github.com/chlbri?tab=repositories)

<br/>

## Links

- [Documentation](https://github.com/chlbri/interval2)
