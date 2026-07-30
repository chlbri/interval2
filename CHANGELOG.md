## CHANGELOG

This changelog provides a detailed overview of the updates and improvements made to the interval2 library. Each version includes a summary of new features, bug fixes, and other changes to help users understand the evolution of the library.

<br/>

<details>
<summary>

## **[1.1.4] - 30/07/2026** => _14:41_

</summary>

- Refactor: Extract `testInterval` helper from `interval.ts` into `interval.fixtures.ts` to trim production bundle dependencies

</details>

<br/>

<details>
<summary>

## **[1.1.3] - 30/07/2026** => _14:37_

</summary>

- Refactor: Standardize package tsconfig configurations by inlining compiler options

</details>

<br/>

<details>
<summary>

## **[1.1.2] - 30/07/2026** => _14:34_

</summary>

- Fix: Exclude `lib/node_modules` directory from published package files

</details>

<br/>

<details>
<summary>

## **[1.1.1] - 30/07/2026** => _14:30_

</summary>

- Dependencies: Add `tslib` dependency

</details>

<br/>

<details>
<summary>

## **[1.1.0] - 30/07/2026** => _14:02_

</summary>

- Refactor: Reorganize codebase into a pnpm monorepo structure
- Features: Add pnpm monorepo workspace configuration
- Dependencies: Add `@bemedev/sleep` dependency to `@bemedev/interval2`

</details>

<br/>

<details>
<summary>

## **[1.0.1] - 26/05/2026** => _15:08_

</summary>

- Refactor: Clean up rolldown configuration by removing empty plugins array

</details>

<br/>

<details>
<summary>

## **[1.0.0] - 26/05/2026** => _14:57_

</summary>

- Features: Replace Rollup with Rolldown for improved build performance
- Features: Migrate from ESLint + Prettier to OxLint + OxFmt for faster linting
- Features: Add Node.js library development container configuration
- Features: Enhance CI process with improved timing and reporting
- Features: Add new test configuration options with type checking
- Fixes: Standardize import quotes and formatting across the codebase
- Refactor: Standardize quote style to single quotes across all files
- Dependencies: Update dependencies including Vite and @types/node

</details>

<br/>
