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
interval.renew({ interval: 2000 });

//dispose the interval
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
await timeout.start();

// Pause the timeout (preserves remaining time)
timeout.pause();

// Resume the timeout
await timeout.start();

// Stop the timeout completely
timeout.stop();
```

<br/>

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

<br/>

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
- 100% coverage
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
