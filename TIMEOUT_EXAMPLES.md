# Timeout2 - Example Usage

## Basic Usage

```typescript
import { createTimeout } from '@bemedev/interval2';

// Create a simple timeout
const timeout = createTimeout({
  id: 'my-timeout',
  callback: () => console.log('Timeout executed!'),
  timeout: 2000, // 2 seconds
});

// Start the timeout
await timeout.start();
```

## Pause and Resume

```typescript
import { createTimeout } from '@bemedev/interval2';

const timeout = createTimeout({
  id: 'pausable-timeout',
  callback: () => console.log('Finally executed!'),
  timeout: 5000, // 5 seconds
});

// Start the timeout
await timeout.start();

// Pause after 2 seconds
setTimeout(() => {
  timeout.pause();
  console.log('Timeout paused');
}, 2000);

// Resume after another 3 seconds
setTimeout(async () => {
  await timeout.start();
  console.log('Timeout resumed');
}, 5000);
```

## Stop a Timeout

```typescript
import { createTimeout } from '@bemedev/interval2';

const timeout = createTimeout({
  id: 'stoppable-timeout',
  callback: () => console.log('This will not execute'),
  timeout: 3000,
});

await timeout.start();

// Stop the timeout before it executes
setTimeout(() => {
  timeout.stop();
  console.log('Timeout stopped');
}, 1000);
```

## Renew with Different Configuration

```typescript
import { createTimeout } from '@bemedev/interval2';

const originalTimeout = createTimeout({
  id: 'original',
  callback: () => console.log('Original callback'),
  timeout: 1000,
});

// Create a new timeout with different configuration
const newTimeout = originalTimeout.renew({
  id: 'renewed',
  callback: () => console.log('New callback'),
  timeout: 3000,
});

await newTimeout.start();
```

## Using with Symbol.dispose (Resource Management)

```typescript
import { createTimeout } from '@bemedev/interval2';

{
  using timeout = createTimeout({
    id: 'auto-dispose',
    callback: () => console.log('Callback executed'),
    timeout: 1000,
  });

  await timeout.start();

  // timeout will be automatically disposed when leaving this scope
}
```

## State Management

```typescript
import { createTimeout } from '@bemedev/interval2';

const timeout = createTimeout({
  id: 'state-example',
  callback: () => console.log('Done!'),
  timeout: 2000,
});

console.log(timeout.state); // 'idle'

await timeout.start();
console.log(timeout.state); // 'active'

timeout.pause();
console.log(timeout.state); // 'paused'

await timeout.start();
console.log(timeout.state); // 'active'

// After execution or stop/dispose
console.log(timeout.state); // 'disposed'
```

## API Reference

### Constructor Parameters

- `id`: string - Unique identifier for the timeout
- `callback`: () => void - Function to execute when timeout completes
- `timeout?`: number - Delay in milliseconds (default: 1000)

### Methods

- `start()`: Promise<void> - Start or resume the timeout
- `pause()`: void - Pause the timeout (preserves remaining time)
- `stop()`: void - Stop and dispose the timeout
- `dispose()`: void - Alias for stop()
- `renew(config?)`: Timeout2 - Create a new timeout with updated
  configuration

### Properties

- `id`: string - The timeout's identifier
- `state`: TimerState - Current state ('idle' | 'active' | 'paused' |
  'disposed')
- `timeout`: number - The timeout duration in milliseconds

### Symbols

- `[Symbol.dispose]()`: void - Automatic cleanup (using statement)
- `[Symbol.asyncDispose]()`: Promise<void> - Async automatic cleanup
