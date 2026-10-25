# AI Testing Agent — Current Handoff

## Current Milestone

Milestone 1 — Project Foundation + GitHub-Hosted iOS Test Runner.

Milestone 1 establishes dynamic target loading. The runner is not tied to one app. The scenario engine is later work.

Eventual milestone gate, after the GitHub Actions workflow: `npm run test:ios -- --target <path>` loads that target config, connects to the iOS Simulator on a standard GitHub-hosted macOS runner through Appium/XCUITest, launches the selected app, performs at least one UI action, captures a screenshot, closes the session, and returns an obvious PASS or FAIL. Local Xcode is not required for the MVP.

Milestone 1 stack: Node.js, TypeScript, Appium, Appium XCUITest Driver, Vitest, Zod, dotenv.

Task 1 is approved. The local Xcode environment task is superseded. The GitHub Actions environment workflow is implemented and APPROVED_FOR_INTEGRATION. It has not run on GitHub. Milestone 2 and later stay out.

## Current Task

Set up GitHub Actions macOS iOS execution environment.

## Status

APPROVED_FOR_INTEGRATION

Task 1 remains accepted. The environment workflow is accepted for integration. Milestone 1 stays in progress. The hosted workflow has not run. Do not mark CI PASS.

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

Task 1 has no Simulator smoke test. No iOS Simulator session, app launch, or iOS screenshot exists yet. Local Xcode is not an MVP blocker.

## Known Limitations / Blockers

Setup requirements recorded during Architect bootstrap. Nothing was installed or upgraded.

- Node is available: `v24.18.0`.
- npm is available: `11.16.0`.
- Xcode.app is not installed. It is not an unselected install. `/Applications/Xcode.app`, `/Applications/Xcode-beta.app`, and `~/Applications/Xcode.app` are absent, and `ls /Applications | grep -i Xcode` printed nothing.
- `xcode-select -p` is `/Library/Developer/CommandLineTools`.
- `xcodebuild -version` failed: `xcode-select: error: tool 'xcodebuild' requires Xcode, but active developer directory '/Library/Developer/CommandLineTools' is a command line tools instance`.
- iOS Simulator tooling is missing. `xcrun simctl list devices` failed: `xcrun: error: unable to find utility "simctl", not a developer tool or in PATH`.
- Appium `3.8.0` and XCUITest driver `12.20.0` are declared in `package.json` and `package-lock.json`. That is not a verified iOS run.
- The local Xcode/Simulator setup is superseded, not done. It was blocked because Xcode was not installed, Simulator was unavailable, and disk space was insufficient (about 10 GiB free). Local Xcode is not required for the MVP.
- These gaps do not undo approved Task 1. The replacement is a standard GitHub-hosted macOS runner.
- Known risk, not a blocker: 15 npm advisories in the Appium/XCUITest tree, 14 critical and 1 high. Do not downgrade major versions to silence the audit. For the MVP, Appium binds only to `127.0.0.1` on ephemeral GitHub-hosted runners. Reassess before a stable release.

## Analyst Review

### Result

APPROVED

The focused re-review of the environment workflow, including the SIGPIPE fix, is APPROVED. Task 1 remains APPROVED.

### Findings

none

## Architect Decision

ACCEPTED

The GitHub Actions environment workflow is accepted for integration. Milestone 1 is not complete. Hosted execution has not run. The smoke-session task has not started.

## Integration Status

Awaiting human approval to commit, push, and execute `ios-smoke.yml`. This reconciliation does not create a commit, push, or workflow run. HEAD stays `3228e542c196d01e1acda4799da945c720cba4d9`. The working tree stays dirty. Do not mark CI PASS.

- Initial commit: `3fd2f52c7e5cd02725d5e3afa0c74d260e6a55e0` `feat: bootstrap ai testing agent`
- Documentation commit already on the remote: `3228e542c196d01e1acda4799da945c720cba4d9` `docs: record initial repository publication`
- Repository: `yurahavrylyuk-lab/ai-testing-agent`
- Visibility: public
- Remote: `origin` `https://github.com/yurahavrylyuk-lab/ai-testing-agent.git` (fetch and push)
- `main` tracks `origin/main`

This architect step does not commit, push, or run the workflow. The proposed commit waits for human approval. Keep the Appium dependency edits.

## Superseded Task

Set up and verify the local iOS automation environment.

### Status

SUPERSEDED — local Xcode is not required for MVP.

Not the next task. The Builder started it and stopped on the local Xcode blocker. Do not resume the local Xcode install.

Blocked because Xcode was not installed, Simulator was unavailable, and disk space was insufficient. The decision that replaces it: GitHub Actions standard macOS runners are the primary iOS backend. Local Xcode is not required for the MVP. Local Xcode/Simulator may be an optional backend later.

Appium `3.8.0` and XCUITest driver `12.20.0` remain declared. Keep those dependency lines. They are not a verified simulator run.

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

Leave any commit for human approval. The local resume steps in Builder Results are historical. Do not install local Xcode as the next step.

### Builder Results

Base: `main` at `3228e54` `docs: record initial repository publication`, clean tree, `origin` = `https://github.com/yurahavrylyuk-lab/ai-testing-agent.git`.

Completed:

- Appium installed as a project-local dev dependency: `npm install -D appium` → `appium@3.8.0`. `npx appium --version` → `3.8.0`. npm skipped Appium's `postinstall` (`autoinstall-extensions.js`) under its script policy; that script only installs extensions named in an env var, so nothing was lost.
- Appium autodetects the project as Appium home (local mode), so drivers install into this project, not `~/.appium`. `npm ci` reproduces both.
- XCUITest driver: `npx appium driver install xcuitest` → `xcuitest@12.20.0`, added to `devDependencies` as `appium-xcuitest-driver`. `npx appium driver list --installed` → `xcuitest@12.20.0 [installed (npm)]`. No other drivers or plugins installed.
- The driver install must run outside the Cursor sandbox: inside it, Appium's write check on the repo root fails with `EPERM`.
- Appium startup smoke test: `npx appium --address 127.0.0.1 --port 4723`. Log: `XCUITestDriver has been successfully loaded`, `Appium REST http interface listener started on http://127.0.0.1:4723`. `GET /status` → `{"ready":true,"message":"The server is ready to accept new connections",...,"version":"3.8.0"}`. SIGINT → `There are no active sessions for cleanup`, `Appium HTTP server has been successfully closed`, exit 0. Port 4723 free afterwards. No session was created.
- `npm test` → 2 files, 18 tests passed. `npm run typecheck` → exit 0.

Environment facts (re-verified):

- Node `v24.18.0`, npm `11.16.0`, macOS `26.6.2` (`25G83`).
- `xcode-select -p` → `/Library/Developer/CommandLineTools`. No `Xcode*.app` in `/Applications`; Spotlight finds no `com.apple.dt.Xcode` bundle.
- `xcodebuild -version` → `xcode-select: error: tool 'xcodebuild' requires Xcode, but active developer directory '/Library/Developer/CommandLineTools' is a command line tools instance`.
- `xcrun simctl list runtimes` and `xcrun simctl list devices` → `xcrun: error: unable to find utility "simctl", not a developer tool or in PATH` (exit 72).
- No `mas` or `xcodes` CLI is installed, so there is no authenticated non-interactive Xcode install path.
- `npx appium driver doctor xcuitest` → 2 required fixes (install Xcode; `xcodebuild` unusable) and 3 optional (`applesimutils`, `ffmpeg`, Simulator SDK). Not installed; optional items are out of scope.
- Free disk: `df -h /System/Volumes/Data` → 228Gi size, 183Gi used, 10Gi available (95%).

Historical blocker record. Do not follow these local Xcode steps. The task is superseded.

Blocked (manual human action required, in order):

1. Free disk space. 10 GiB available is not enough for Xcode plus an iOS Simulator runtime; Apple's Xcode download expands to tens of GB during install.
2. Install Xcode from the Mac App Store (Apple ID sign-in), to `/Applications/Xcode.app`.
3. `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`
4. `sudo xcodebuild -license accept` and `sudo xcodebuild -runFirstLaunch`
5. Install an iOS Simulator runtime if Xcode did not: Xcode → Settings → Components, or `xcodebuild -downloadPlatform iOS`.

Builder resumes after these with: `xcode-select -p`, `xcodebuild -version`, `xcrun simctl list runtimes`, `xcrun simctl list devices`, create one iPhone device only if none exists, `npx appium driver doctor xcuitest`, the Appium startup smoke test, `npm test`, `npm run typecheck`.

For Architect:

- `npm audit` reports 15 advisories (14 critical, 1 high), all transitive in the Appium 3.8.0 / XCUITest 12.20.0 dependency tree. Root advisories: `shell-quote` (`quote()` command injection via a line terminator) and `body-parser` (DoS via trailing bytes after a compressed body). npm's only offered fix downgrades to `appium@2.19.0` / `appium-xcuitest-driver@9.10.5` (semver-major). Not applied. The server is started bound to `127.0.0.1` only.
- No `npm run appium` script was added; PLAN.md assigns it to Task 2.

Files modified: `package.json` (devDependencies `appium`, `appium-xcuitest-driver`), `package-lock.json`, `docs/HANDOFF.md` (this section and its Status).

## Next Task

Set up GitHub Actions macOS iOS execution environment.

### Status

APPROVED_FOR_INTEGRATION

Implemented and reviewed. Analyst approved the workflow, including the SIGPIPE fix. CI status: NOT YET RUN. Not committed or pushed. Do not mark CI PASS.

### Scope

The future task creates `.github/workflows/ios-smoke.yml` on a standard GitHub-hosted macOS runner, not a larger runner. The workflow only verifies environment readiness:

- checkout
- set up and use Node
- `npm ci`
- print Node and npm versions
- print the Xcode version
- print the active developer directory
- list iOS Simulator runtimes
- list Simulator devices
- verify the Appium version
- verify the XCUITest driver
- start Appium on `127.0.0.1`
- verify `/status`
- stop Appium
- run tests
- run typecheck

Use Appium 3.8.0 and XCUITest driver 12.20.0 already in `package.json`. Keep dynamic `--target` available for the following task.

Acceptance: the standard hosted macOS workflow completes successfully and proves Xcode, simctl, Appium, and the XCUITest driver are available for the next task.

### Out of scope

- Create a real Appium iOS session.
- Build or install the target app.
- Capture an iOS screenshot.
- Implement scenarios, Slack delivery, or AI exploration.
- Paid clouds and larger runners.
- Installing local Xcode.

### Builder Results

Base: `main` at `3228e54`. The pre-existing uncommitted replan and Appium dependency changes (`AGENTS.md`, `BACKLOG.md`, `PLAN.md`, `README.md`, `docs/HANDOFF.md`, `package.json`, `package-lock.json`) were preserved untouched apart from this section and the Status above.

Created: `.github/workflows/ios-smoke.yml`.

Runner: `macos-26`. Rationale: from the `actions/runner-images` README (image `20261013.0424.1`), `macos-26` is the explicit standard arm64 label and is what `macos-latest` currently points to; the `-large`/`-xlarge` labels are larger (paid) runners and are not used. An explicit label avoids silent image moves of `macos-latest`. That image documents Node 24.21.0, default Xcode 26.6 (`/Applications/Xcode.app`), iOS Simulator runtimes 26.2, 26.4, 26.5, and iPhone 17 / 17 Pro / 17 Pro Max / 17e / Air / 16e Simulators. No Xcode or runtime download is performed.

Workflow responsibilities, in order:

- Trigger: `workflow_dispatch` only. PLAN.md specifies no other trigger, so pushing the file does not run it; it must be started manually from the Actions tab or `gh workflow run ios-smoke.yml`.
- `permissions: contents: read`, `timeout-minutes: 20`, no secrets, no `SLACK_WEBHOOK_URL`.
- `actions/checkout@v7`, `actions/setup-node@v7` with Node 24 and npm cache (latest releases checked: v7.0.1, v7.1.0).
- Print `node --version`, `npm --version`; `npm ci`.
- `xcode-select -p`, `xcodebuild -version`.
- `xcrun simctl list runtimes`, `xcrun simctl list devices available`; fail if no available `iOS` runtime or no available `iPhone` device.
- `npx appium --version`; `npx appium driver list --installed`; fail unless `xcuitest@` is listed.
- Start `npx appium --address 127.0.0.1 --port 4723` in the background with output to `$RUNNER_TEMP/appium.log`, save the PID, `trap` on EXIT sends SIGINT and waits. Poll `http://127.0.0.1:4723/status` once per second up to 60 s; fail early if the process dies; fail if no response; fail unless `value.ready === true`. Start, check, and stop are one step, so Appium cannot outlive it.
- On failure only: print the Appium log. No artifact upload.
- `npm test`, `npm run typecheck`.

Local verification:

- YAML parsed with the `yaml` package already in `node_modules`: `on: workflow_dispatch`, `runs-on: macos-26`, 11 steps in the order above. `actionlint` is not installed; none added.
- Dry run: copied the repo (tracked and untracked, non-ignored files) to a temp directory, ran `npm ci`, then executed each non-Xcode step's exact `run:` script with `bash --noprofile --norc -eo pipefail` and `RUNNER_TEMP` set. All exited 0: `v24.18.0`/`11.16.0`; `npm ci` added 337 packages; `3.8.0`; `xcuitest@12.20.0 [installed (npm)]` after a fresh `npm ci` with no separate driver install; `/status` → `{"value":{"ready":true,...,"version":"3.8.0"}}`, `Appium ready: 3.8.0`; 18 tests passed; typecheck passed. Afterwards port 4723 was free and no Appium process remained.
- Failure path: the Appium step with its readiness check forced to fail exited 1 with `::error::Appium /status did not report ready`; the trap still shut Appium down (`Appium HTTP server has been successfully closed`), port 4723 free, no process left.
- The Xcode and Simulator steps cannot run on this Mac (no Xcode); they are verified only on GitHub.
- In the repo: `npm test` → 2 files, 18 tests passed. `npm run typecheck` → exit 0.

CI status: NOT YET RUN — requires approved integration first.

Known risks:

- The hosted image can change. The Simulator check accepts any available iOS runtime and iPhone, so it does not pin device names.
- The example targets name `iPhone 16` and `iPhone 16 Pro`; the `macos-26` image lists iPhone 17-family and `iPhone 16e` Simulators, not those names. Irrelevant to this workflow, but the following session task must pick a device present on the image.
- npm audit: 15 known advisories in the Appium/XCUITest tree remain; `npm ci` prints them. Not changed. Appium binds to `127.0.0.1` only.
- Standard macOS runner minutes are free only while the repository stays public.

Dependencies: unchanged. No `npm install`, no `npm audit fix`.

Files created: `.github/workflows/ios-smoke.yml`. Files modified by Builder: `docs/HANDOFF.md` (this section and Status).

#### Correction after Analyst CHANGES_REQUIRED

Analyst finding: the Simulator checks used `xcrun simctl list ... | grep -q ...`. Under the Actions shell's `pipefail`, `grep -q` can exit on the first match and `simctl` can then die of SIGPIPE, failing the step on a healthy runner.

Fix, `iOS Simulator runtimes and devices` step only: `xcrun simctl list runtimes available` and `xcrun simctl list devices available` each write their full output to `$RUNNER_TEMP/ios-runtimes.txt` / `$RUNNER_TEMP/ios-devices.txt` under their own exit-code check (`::error::Failed to list iOS Simulator runtimes` / `Failed to list Simulator devices`). The file is printed, then grepped for `^iOS ` / `iPhone` (`::error::No available iOS Simulator runtime` / `No available iPhone Simulator device`). No `simctl` pipeline remains in the workflow. No other step changed.

Verification (local, no Xcode; a stand-in `xcrun` on `PATH` printed a matching line first and then 200,000 more lines; the exact step script was extracted from the YAML and run with `bash --noprofile --norc -eo pipefail`):

- Healthy output → exit 0.
- No iOS runtime → exit 1, `No available iOS Simulator runtime`.
- No iPhone → exit 1, `No available iPhone Simulator device`.
- `simctl list runtimes` exits 72 → exit 1, `Failed to list iOS Simulator runtimes`.
- `simctl list devices` exits 72 → exit 1, `Failed to list Simulator devices`.
- Old pattern with the same healthy output under `pipefail` → false failure for both runtimes and devices; `PIPESTATUS` `141 0` (producer killed by SIGPIPE). Reproduces the finding; the new step does not pipe `simctl` into `grep`.
- YAML parses with the existing `yaml` package in `node_modules`: `workflow_dispatch`, `macos-26`, 11 steps. `bash -n` passes for all 9 `run:` blocks.
- Appium step regression: exact script → `/status` `ready: true`, `Appium ready: 3.8.0`, exit 0; port 4723 free and no Appium process afterwards.
- `npm test` → 2 files, 18 tests passed. `npm run typecheck` → exit 0.

Workflow scope unchanged. CI status: NOT YET RUN. Status is APPROVED_FOR_INTEGRATION. Do not mark CI PASS.

### Following task

Create first GitHub-hosted Appium iOS smoke session.

Not started. That later task selects or builds a source-controlled iOS test app, boots the Simulator, starts Appium, creates an XCUITest session, installs and launches the app, interacts once, captures a screenshot, uploads the artifact, and returns PASS or FAIL.
