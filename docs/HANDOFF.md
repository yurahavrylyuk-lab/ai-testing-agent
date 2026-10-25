# AI Testing Agent — Current Handoff

## Current Milestone

Milestone 1 — Project Foundation + Local iOS Test Runner.

Milestone 1 establishes dynamic target loading. The runner is not tied to one app. The scenario engine is later work.

Eventual milestone gate, assigned later as Task 2: `npm run test:ios -- --target <path>` loads that target config, connects to the local iOS Simulator through Appium/XCUITest, launches the selected app, performs at least one UI action, captures a screenshot under `artifacts/`, closes the session, and returns an obvious PASS or FAIL.

Milestone 1 stack: Node.js, TypeScript, Appium, Appium XCUITest Driver, Vitest, Zod, dotenv.

Task 1 is approved. The next Builder task is recorded below as PLANNED and has not started. Milestone 2 and later stay out of both.

## Current Task

Task 1 — Bootstrap the TypeScript project and implement dynamic target configuration.

## Status

APPROVED

Task 1 is accepted and published. Milestone 1 stays in progress. The next task below is PLANNED and has not started.

## Branch

`main` tracks `origin/main`.

Origin: `https://github.com/yurahavrylyuk-lab/ai-testing-agent.git`

## Base Commit

`3fd2f52c7e5cd02725d5e3afa0c74d260e6a55e0`

`feat: bootstrap ai testing agent`

## Builder Scope

**Goal.** Bootstrap the local TypeScript project and implement dynamic target configuration. Produce `loadTargetConfig(path: string): TargetConfig`, where `TargetConfig` contains the target name, platform, mode, app identifier or path, device configuration, and capabilities. The selected app comes only from the `--target <path>` file. Loading target A and target B uses the same source code. Missing or invalid configuration fails clearly at load time. This task does not open an Appium session, run scenarios, or create a GitHub repo.

**Expected files.**

- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.env.example`
- Create: `.gitignore`
- Create: `src/config.ts`
- Create: `src/cli.ts`
- Create: `targets/example.target.json`
- Create: `targets/example-second.target.json`
- Create: `tests/config.test.ts`

Use a second target file, `targets/example-second.target.json`, rather than test fixtures alone. The two files name different apps. Tests load both files.

`package.json` dependencies for this slice: TypeScript, Vitest, Zod, and dotenv. Scripts: a test script that runs Vitest, and a typecheck script that runs `tsc --noEmit`. Leave Appium, the XCUITest driver, and `npm run test:ios` for a later task.

`.env.example` contains `SLACK_WEBHOOK_URL=` and no real credential. `.gitignore` ignores `node_modules/`, build output, and `.env`. `.env.example` may be committed. Ignore `artifacts/` except intentional placeholders. Do not require a Slack webhook for a valid target.

`src/cli.ts` accepts `--target <path>`, loads that file with `loadTargetConfig`, exits 0 for a valid target, and exits non-zero with a clear validation error for a missing or invalid file.

**Acceptance criteria.**

1. A valid target config loads into `TargetConfig` with name, platform, mode, app identifier or path, device configuration, and capabilities.
2. An invalid target config fails clearly inside `loadTargetConfig`, before any device session exists.
3. Target A, `targets/example.target.json`, loads.
4. Target B, `targets/example-second.target.json`, loads.
5. Changing the selected app requires no source-code modification. App identity comes from the selected file.
6. The CLI accepts `--target <path>` and returns an obvious success or failure exit code.
7. `tests/config.test.ts` passes, and typecheck passes.
8. Leave all Task 1 changes uncommitted for the Analyst. Do not commit, push, or merge. A commit happens only after human approval.

**Required tests.** `tests/config.test.ts` covers valid target loading, invalid or missing required fields, target A, and target B. Write those tests first, run them, and confirm they fail before implementing the loader. Then implement the smallest Zod-backed loader and confirm the same tests pass. The tests must show both targets load through one code path.

**Required commands.**

- `npm install` for the dependencies declared by this task.
- Run the config tests and record the expected initial failure.
- Run the config tests again after the loader exists and record the pass.
- Run the TypeScript typecheck and record the result.
- Run the CLI against `targets/example.target.json`, `targets/example-second.target.json`, and one invalid target, and record the exit codes.
- Leave all Task 1 changes uncommitted for the Analyst. Do not commit, push, or merge. A commit happens only after human approval.

**Out of scope.**

- Appium, XCUITest, Simulator launch, screenshots, `npm run appium`, and `npm run test:ios`.
- Scenario execution and the scenario engine, including generic and app-specific scenarios.
- Slack delivery. `.env.example` may contain an empty `SLACK_WEBHOOK_URL=` and no real credential.
- GitHub repo creation, `gh repo create`, adding a remote, commit, push, and merge.
- Installing or upgrading Xcode, Simulator runtimes, Appium, or the XCUITest driver.
- Edits to `BACKLOG.md`, `PLAN.md`, `AGENTS.md`, or `docs/HANDOFF.md`.
- Leave all Task 1 changes uncommitted for the Analyst. A commit happens only after human approval.

## Files Expected To Change

- `package.json`
- `tsconfig.json`
- `.env.example`
- `.gitignore`
- `src/config.ts`
- `src/cli.ts`
- `targets/example.target.json`
- `targets/example-second.target.json`
- `tests/config.test.ts`

## Acceptance Criteria

1. A valid target config loads.
2. An invalid target config fails clearly.
3. Target A, `targets/example.target.json`, loads.
4. Target B, `targets/example-second.target.json`, loads.
5. Changing the selected app requires no source-code modification.
6. The CLI accepts `--target <path>`.
7. Config tests pass after the loader exists, and they failed before it existed.
8. Typecheck passes.
9. Leave all Task 1 changes uncommitted for the Analyst. Do not commit, push, or merge. A commit happens only after human approval.

## Builder Verification

### Implementation

Files created:

- `package.json` — dependencies `zod`, `dotenv`; dev dependencies `typescript` (7.x), `vitest`, `@types/node`. Scripts: `test` (`vitest run`), `typecheck` (`tsc --noEmit`), `target:check` (`node src/cli.ts`). No `test:ios`, no `appium`, no build script.
- `package-lock.json` — generated by `npm install`.
- `tsconfig.json` — strict, `noEmit`, Node native type stripping (`allowImportingTsExtensions`, `erasableSyntaxOnly`).
- `.env.example` — `SLACK_WEBHOOK_URL=` only.
- `.gitignore` — `.env`, `.env.*`, `!.env.example`, `node_modules/`, `dist/`, `coverage/`, `artifacts/*`, `!artifacts/.gitkeep`, `.DS_Store`, `*.log`.
- `src/config.ts` — Zod schema, `TargetConfig`, `TargetConfigError`, `loadTargetConfig(path: string): TargetConfig`. Fields: `name`, `platform` (`ios`), `mode` (`white-box` | `black-box`), `app.bundleId` and/or `app.appPath` (at least one required), `device.name`, optional `device.platformVersion`, `capabilities` (record of booleans, default `{}`).
- `src/cli.ts` — `parseTargetArg(argv)`, `runCli(argv)`; parses `--target <path>` with `node:util` `parseArgs`, loads dotenv quietly, prints the target, exits 0 or 1.
- `targets/example.target.json` — "Example App", black-box, `com.example.app`, iPhone 16.
- `targets/example-second.target.json` — "Example Second App", white-box, `com.example.second` + `builds/ExampleSecond.app`, iPhone 16 Pro.
- `tests/config.test.ts` — 11 tests.
- `tests/cli.test.ts` — 7 tests for argument parsing and CLI exit codes. Added beyond the expected file list to test CLI parsing separately.

Files modified: `docs/HANDOFF.md` to record verification and, after Analyst approval, this reconciliation. Architect accepted this verification.

### Tests

Before implementation: `npm test` exited 1. Both suites failed with `Cannot find module '../src/config.ts'` and `Cannot find module '../src/cli.ts'`.

After implementation: `npm test` exited 0. `Test Files 2 passed (2)`, `Tests 18 passed (18)`.

### Typecheck

`npm run typecheck` (`tsc --noEmit`) exited 0, no errors.

### Build

Not applicable. No build script; the CLI runs through Node 24 native type stripping.

### Manual CLI

- `npm run target:check -- --target targets/example.target.json` → exit 0. `Target loaded: Example App`, `Platform: ios`, `Mode: black-box`, `Bundle ID: com.example.app`, `Device: iPhone 16`.
- `npm run target:check -- --target targets/example-second.target.json` → exit 0. `Target loaded: Example Second App`, `Platform: ios`, `Mode: white-box`, `Bundle ID: com.example.second`, `App path: builds/ExampleSecond.app`, `Device: iPhone 16 Pro`.
- `--target targets/nope.target.json` → exit 1, `Target config not found: <absolute path>`.
- `--target package-lock.json` (wrong schema) → exit 1, `Invalid target config` listing `platform`, `mode`, `app`, `device` issues.
- No `--target` → exit 1, `Missing required argument: --target <path>`.
- Malformed JSON file → exit 1, `Target config is not valid JSON: ...`.

Switching targets changed only the `--target` path. No source change.

### Public-repo safety

Secret scan of created files (excluding `node_modules`, lockfile, docs) for Slack webhooks, tokens, keys, passwords, and `/Users/` paths found nothing. `git check-ignore` confirmed `.env`, `.env.local`, `node_modules`, and `artifacts/*` are ignored and `.env.example` is not.

### Deferred

Appium, XCUITest driver, Simulator, `npm run test:ios`, `npm run appium`, scenarios, Slack delivery, AI explorer, `artifacts/.gitkeep` placeholder.

### iOS/Appium Smoke Test

not run

Task 1 has no Simulator smoke test. The Milestone 1 smoke test belongs to a later task. Missing Xcode, Simulator, Appium, and the XCUITest driver block that later work. They do not block this Builder task.

## Known Limitations / Blockers

Setup requirements recorded during Architect bootstrap. Nothing was installed or upgraded.

- Node is available: `v24.18.0`.
- npm is available: `11.16.0`.
- Xcode.app is not installed. It is not an unselected install. `/Applications/Xcode.app`, `/Applications/Xcode-beta.app`, and `~/Applications/Xcode.app` are absent, and `ls /Applications | grep -i Xcode` printed nothing.
- `xcode-select -p` is `/Library/Developer/CommandLineTools`.
- `xcodebuild -version` failed: `xcode-select: error: tool 'xcodebuild' requires Xcode, but active developer directory '/Library/Developer/CommandLineTools' is a command line tools instance`.
- iOS Simulator tooling is missing. `xcrun simctl list devices` failed: `xcrun: error: unable to find utility "simctl", not a developer tool or in PATH`.
- Appium is missing. `command -v appium` found nothing.
- The Appium XCUITest driver is missing because Appium is not installed.
- These gaps belong to the planned environment task. They do not undo approved Task 1.
- The initial commit and public repository are done. Xcode, Simulator, Appium, and the XCUITest driver are not.

## Analyst Review

### Result

APPROVED

### Findings

none

## Architect Decision

Task 1 is accepted and the approved repository is public. Milestone 1 is not complete. The environment-setup task is planned and has not started.

## Integration Status

Published and verified.

- Initial commit: `3fd2f52c7e5cd02725d5e3afa0c74d260e6a55e0` `feat: bootstrap ai testing agent`
- Repository: `yurahavrylyuk-lab/ai-testing-agent`
- Visibility: public
- Remote: `origin` `https://github.com/yurahavrylyuk-lab/ai-testing-agent.git` (fetch and push)
- `main` tracks `origin/main`
- Remote HEAD matches the initial commit

The environment-setup task is still PLANNED and has not started.

## Next Task

Set up and verify the local iOS automation environment.

### Status

PLANNED

Not started.

### Scope

Environment readiness only:

- Verify or install full Xcode.
- Activate the correct developer directory.
- Verify `xcodebuild`.
- Verify `xcrun simctl`.
- Verify at least one iOS Simulator runtime and device.
- Install Appium.
- Install the XCUITest driver.
- Verify Appium can start.
- Record the Xcode, Simulator, Appium, and driver versions.

Xcode.app is not installed. See Known Limitations. Do not treat it as an install that only needs `xcode-select -s`.

### Out of scope

- Implementing launch, tap, screenshot, or `npm run test:ios`.
- The Appium application-control runner. That remains PLAN.md Task 2.
- Slack delivery.
- The scenario engine.
- Commit, push, adding a remote, and `gh repo create`.

Leave any commit for human approval.
