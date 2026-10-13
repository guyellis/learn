# AGENTS.md

## What this is
learn.headvert.com — a React + TypeScript single-page app with math exercises for
kids aged 5 to 12, hosted on Cloudflare Pages. Merges to the production branch
deploy automatically.

## Repo facts
- Public repo. Default branch: `master`. Package manager: npm (package-lock.json).
- Node is pinned in `.nvmrc` (Node 24); `engines` in package.json matches.
- Build: Vite (ESM, `"type": "module"`). Tests: Vitest with jsdom and the v8
  coverage provider. UI: MUI + Emotion. Routing: react-router. Dates use the
  Temporal API; the polyfill loads only on browsers without native support.

## Commands
- `npm run dev` — Vite dev server
- `npm run build` — typecheck + production build
- `npm test` — the full gate: lint, typecheck, Vitest with coverage, build
- `npm run lint` — ESLint, zero warnings allowed

## Working rules
- One issue per PR. Branch per issue. The PR body links its issue (`Fixes #N`).
- Tests: files are named `<name>.test.ts(x)`; use `test()` not `it()`. No visible
  output to stdout/stderr during a test run — output from code under test is
  captured by spies and asserted, never printed. The coverage table prints at
  the end of the run.
- Coverage thresholds are enforced in the Vitest config. New code ships with
  tests; never lower a threshold or widen an exclusion to make a run pass.
- Code style: Prettier — printWidth 100, singleQuote, semi, tabWidth 2,
  trailingComma 'all', arrowParens 'always', useTabs false. ESLint flat config
  with typescript-eslint; curly always; eqeqeq; comma-dangle always-multiline;
  no-console (warn/error allowed). Alphabetize JSX props, style-object keys and
  object literal keys where the configured rules require it.
- TypeScript strict mode stays on. TypeScript stays on the 6.x line.
- The exercise content, its difficulty progression, and how answers are scored
  are the product: tooling or refactor changes must not alter what a student
  sees or how answers are judged unless an issue explicitly says so.
- Cloudflare Pages serves a top-level `404.html` for unknown paths — keep one in
  the build output.
- No secrets in code or config — environment variables only.
