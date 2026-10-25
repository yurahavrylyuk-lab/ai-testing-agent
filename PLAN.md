# AI Testing Agent MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local iOS testing agent that runs deterministic white-box and black-box test scenarios, collects evidence, produces reports, sends results to Slack Notifier, and later adds bounded AI exploration.

**Architecture:** A small TypeScript/Node.js orchestrator controls iOS through Appium using the XCUITest driver. The app under test is selected by target configuration, so the same runner tests different apps without core source changes. Tests are represented as reusable scenarios executed by one shared runner; target capabilities determine whether steps are available for white-box or black-box apps. Evidence, result classification, reporting, and Slack delivery are shared across both modes.

**Tech Stack:** Node.js, TypeScript, Appium, Appium XCUITest Driver, Vitest, Zod, dotenv, native `fetch`, iOS Simulator/Xcode tooling.

**Spec:** `BACKLOG.md`

## Global Constraints

- Run locally on the developer Mac and be usable from Cursor.
- iOS first.
- Optimize for the fastest usable MVP.
- Do not build cloud infrastructure, a dashboard, distributed workers, queues, or a device farm.
- Use one shared runner for white-box and black-box testing.
- Deterministic scenarios come before AI-driven exploration.
- Unsupported operations must produce `NOT_SUPPORTED`; they must never be simulated as successful.
- Slack delivery uses the existing Notifier webhook.
- Secrets must come from environment variables and must not be committed.
- Keep modules small and avoid speculative abstractions.
- The runner is not tied to one app. Select the target with configuration. A new app normally needs only a new target config and, where appropriate, app-specific scenarios.
- Milestone 1 establishes dynamic target loading. Do not build the scenario engine in Milestone 1.

## Dynamic Targets

Future usage, after `npm run test:ios` exists:

```bash
npm run test:ios -- --target targets/dime.target.json
npm run test:ios -- --target targets/another-app.target.json
```

The same runner tests different apps without core source changes.

Future scope, not current work:

- Generic scenarios: launch, relaunch, background/foreground, rapid taps, rapid text input, navigation smoke, freeze detection.
- App-specific scenarios: login, logout, create transaction, CSV import, app-specific flows.

## Review Focus

1. Missing/invalid target configuration must fail before Appium launches.
2. Missing Slack webhook must not destroy an otherwise valid local test run; reporting should clearly state delivery failure.
3. An unavailable capability in black-box mode must become `NOT_SUPPORTED`, not `FAIL`.
4. A UI element timeout must end the affected step cleanly and preserve screenshot/error evidence.
5. Unexpected Appium/device disconnection must terminate the run cleanly and still attempt to write the local report.

---

# Repository Structure

```text
ai-testing-agent/
├── README.md
├── BACKLOG.md
├── PLAN.md
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
│
├── src/
│   ├── cli.ts
│   ├── config.ts
│   │
│   ├── runner/
│   │   ├── run-test-suite.ts
│   │   ├── run-scenario.ts
│   │   └── result-types.ts
│   │
│   ├── device/
│   │   ├── appium-session.ts
│   │   └── ios-actions.ts
│   │
│   ├── scenarios/
│   │   ├── types.ts
│   │   ├── standard.ts
│   │   └── login.ts
│   │
│   ├── capabilities/
│   │   └── target-capabilities.ts
│   │
│   ├── evidence/
│   │   └── evidence-store.ts
│   │
│   ├── reporting/
│   │   ├── build-report.ts
│   │   └── slack-notifier.ts
│   │
│   └── explorer/
│       └── explore.ts
│
├── targets/
│   ├── example.target.json
│   └── example-second.target.json
│
├── tests/
│   ├── config.test.ts
│   ├── scenario-runner.test.ts
│   ├── capabilities.test.ts
│   ├── evidence-store.test.ts
│   ├── report.test.ts
│   └── slack-notifier.test.ts
│
└── artifacts/
    └── .gitkeep
```

Keep this structure unless implementation reveals a concrete reason to change it.

---

# Milestone 1 — Project Foundation + Local iOS Test Runner

## Task 1: Bootstrap the TypeScript project and implement dynamic target configuration

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.env.example`
- Create: `.gitignore`
- Create: `src/config.ts`
- Create: `src/cli.ts`
- Create: `targets/example.target.json`
- Create: `targets/example-second.target.json`
- Create: `tests/config.test.ts`
- Create: `tests/cli.test.ts`

Use a second target file, `targets/example-second.target.json`, for a different app. Test fixtures alone do not replace that file. CLI checks live in `tests/cli.test.ts`.

**Interfaces:**
- Produces: `loadTargetConfig(path: string): TargetConfig`
- Produces: `TargetConfig` containing target name, platform, mode, app identifier/path, device configuration, and capabilities.
- The selected app comes only from the target file passed to the loader and CLI.

- [x] Write tests for valid target loading, invalid/missing required fields, target A, and target B.
- [x] Run the config tests and verify they fail.
- [x] Implement the smallest Zod-backed configuration loader.
- [x] Add `.env.example` with `SLACK_WEBHOOK_URL=` and no real credentials.
- [x] Ignore `.env`. `.env.example` may be committed. Ignore `artifacts/` except intentional placeholders.
- [x] Add CLI argument `--target <path>`.
- [x] Prove that changing the selected app requires no source-code modification.
- [x] Run tests and typecheck.
- [x] Leave the changes uncommitted for the Analyst. A commit happens only after human approval. Do not push, merge, or add a remote.

**Verified.** Analyst approved Task 1. The CLI uses `--target <path>`. Dynamic loading is verified with `targets/example.target.json` and `targets/example-second.target.json`. Node 24 built-in TypeScript type stripping runs the CLI with `node src/cli.ts`. Task 1 has no separate build step. `npm test`: 18 passing. `npm run typecheck`: passing.

## Later Milestone 1 task: Publish public GitHub repo `ai-testing-agent`

Completed after human approval and a safety check.

- Initial commit: `3fd2f52c7e5cd02725d5e3afa0c74d260e6a55e0` `feat: bootstrap ai testing agent`
- Repository: `yurahavrylyuk-lab/ai-testing-agent`, public
- Origin: `https://github.com/yurahavrylyuk-lab/ai-testing-agent.git`
- `main` tracks `origin/main`, and that commit is on the remote

The environment task below remains PLANNED and has not started.

## Next task: Set up and verify the local iOS automation environment

Status: PLANNED. Not started. This is environment readiness only. Task 2 remains the application-control runner.

- [ ] Verify or install full Xcode and activate the correct developer directory.
- [ ] Verify `xcodebuild` and `xcrun simctl`.
- [ ] Verify at least one iOS Simulator runtime and device.
- [ ] Install Appium and the XCUITest driver.
- [ ] Verify Appium can start, and record the Xcode, Simulator, Appium, and driver versions.

Xcode.app is not installed. `xcode-select -p` is `/Library/Developer/CommandLineTools`. Appium is not installed.

Out of scope: app launch, tap, screenshot, `npm run test:ios`, Slack, the scenario engine, commit, push, and `gh repo create`.

## Task 2: Create and close an Appium iOS session

**Files:**
- Create: `src/device/appium-session.ts`
- Create: `src/device/ios-actions.ts`
- Create: `tests/appium-session.test.ts`

**Interfaces:**
- Produces: `createIosSession(target: TargetConfig): Promise<Browser>`
- Produces: `closeIosSession(session: Browser): Promise<void>`
- Produces: action wrappers `tap`, `typeText`, `clearText`, `swipe`, `waitForElement`, `launchApp`, `terminateApp`.

- [ ] Write unit tests around capability construction and lifecycle behavior with the Appium client mocked.
- [ ] Verify tests fail.
- [ ] Implement minimal Appium/XCUITest session creation.
- [ ] Implement the required action wrappers only.
- [ ] Add `npm run appium` and `npm run test:ios` scripts.
- [ ] Manually run a smoke interaction against an iOS Simulator.
- [ ] Save one screenshot under `artifacts/`.
- [ ] Run unit tests and typecheck.
- [ ] Commit: `feat: add local ios appium runner`

**Milestone 1 gate:** `npm run test:ios -- --target <path>` launches the app selected by that target file, performs one UI action, takes a screenshot, and closes cleanly.

---

# Milestone 2 — Scenario Engine + Standard Test Pack

Milestone 2 is future scope. Milestone 1 does not build the scenario engine.

Generic scenarios apply across apps: launch, relaunch, background/foreground, rapid taps, rapid text input, navigation smoke, freeze detection. App-specific scenarios belong to one app: login, logout, create transaction, CSV import, and other app-specific flows. A new app normally adds a target config and, where appropriate, app-specific scenarios, without core source changes.

## Task 3: Define scenario and result contracts

**Files:**
- Create: `src/scenarios/types.ts`
- Create: `src/runner/result-types.ts`
- Create: `src/runner/run-scenario.ts`
- Create: `tests/scenario-runner.test.ts`

**Interfaces:**
- Produces: `Scenario`, `ScenarioStep`, `ScenarioResult`, `StepResult`
- Result status enum: `PASS | FAIL | WARNING | BLOCKED | NOT_SUPPORTED`
- Produces: `runScenario(context, scenario): Promise<ScenarioResult>`

- [ ] Write tests for pass, fail, timeout, blocked, and unsupported outcomes.
- [ ] Verify tests fail.
- [ ] Implement sequential scenario execution.
- [ ] Stop a scenario on hard failure while preserving completed step results.
- [ ] Run tests and typecheck.
- [ ] Commit: `feat: add reusable scenario engine`

## Task 4: Implement the first standard scenarios

**Files:**
- Create: `src/scenarios/standard.ts`
- Create: `src/scenarios/login.ts`
- Modify: `src/cli.ts`
- Modify: `tests/scenario-runner.test.ts`

**Interfaces:**
- Produces reusable scenario factories for:
  - clean launch
  - logged-out launch
  - valid login
  - invalid login
  - logout
  - kill/relaunch
  - background/foreground
  - empty/invalid input
  - rapid taps
  - rapid text entry
  - navigation smoke

- [ ] Add tests verifying generated scenario step order and required configuration.
- [ ] Verify tests fail.
- [ ] Implement only the scenarios that the first target can actually exercise.
- [ ] Add scenario selection to the CLI.
- [ ] Run unit tests.
- [ ] Run at least three scenarios against the Simulator.
- [ ] Commit: `feat: add initial ios scenario pack`

---

# Milestone 3 — Evidence + Slack Notifier Report

## Task 5: Persist evidence for every run

**Files:**
- Create: `src/evidence/evidence-store.ts`
- Create: `tests/evidence-store.test.ts`
- Modify: `src/runner/run-scenario.ts`

**Interfaces:**
- Produces: `createRunArtifacts(runId: string): Promise<RunArtifacts>`
- Produces: `saveScreenshot(...)`
- Produces: `saveTextArtifact(...)`
- Artifacts use `artifacts/<run-id>/`.

- [ ] Write tests for directory creation, filenames, and failure screenshot persistence.
- [ ] Verify tests fail.
- [ ] Implement local artifact storage.
- [ ] Capture screenshots at configured checkpoints and automatically on failed UI steps.
- [ ] Run tests and typecheck.
- [ ] Commit: `feat: persist test evidence`

## Task 6: Generate JSON and Markdown reports

**Files:**
- Create: `src/reporting/build-report.ts`
- Create: `tests/report.test.ts`
- Modify: `src/runner/run-test-suite.ts`

**Interfaces:**
- Produces: `buildJsonReport(run): RunReport`
- Produces: `buildMarkdownReport(report): string`

- [ ] Write tests for totals, status counts, failure details, and artifact references.
- [ ] Verify tests fail.
- [ ] Implement JSON report generation.
- [ ] Implement compact Markdown report generation.
- [ ] Write `results.json` and `report.md` into the run artifact directory.
- [ ] Run tests and typecheck.
- [ ] Commit: `feat: generate local test reports`

## Task 7: Send final report to Slack Notifier

**Files:**
- Create: `src/reporting/slack-notifier.ts`
- Create: `tests/slack-notifier.test.ts`
- Modify: `src/config.ts`
- Modify: `src/runner/run-test-suite.ts`

**Interfaces:**
- Produces: `sendSlackReport(report: RunReport, webhookUrl: string): Promise<SlackDeliveryResult>`

- [ ] Write tests for payload format, successful response, missing webhook, and Slack HTTP failure.
- [ ] Verify tests fail.
- [ ] Implement webhook delivery with native `fetch`.
- [ ] Keep webhook secrets out of logs and reports.
- [ ] Make Slack failure non-destructive: local report remains complete and CLI exits with a distinct delivery warning.
- [ ] Perform one end-to-end test against Notifier.
- [ ] Commit: `feat: send test summaries to slack notifier`

**Milestone 3 gate:** A local run executes scenarios, saves evidence/report files, then sends one final summary to Notifier.

---

# Milestone 4 — White-Box + Black-Box Capability Layer

## Task 8: Add capability-aware execution

**Files:**
- Create: `src/capabilities/target-capabilities.ts`
- Create: `tests/capabilities.test.ts`
- Modify: `src/config.ts`
- Modify: `src/runner/run-scenario.ts`
- Modify: `targets/example.target.json`

**Interfaces:**
- Produces: `supportsCapability(target, capability): boolean`
- Scenario steps may declare `requiresCapability`.

- [ ] Write tests proving unsupported operations become `NOT_SUPPORTED`.
- [ ] Verify tests fail.
- [ ] Implement capability checks before step execution.
- [ ] Add white-box and black-box example target configs.
- [ ] Run tests and typecheck.
- [ ] Commit: `feat: add white box and black box capabilities`

## Task 9: Add minimal white-box test hooks

**Files:**
- Modify only the selected source-controlled target app as necessary.
- Add integration notes to `README.md`.

**Interfaces:**
Expose only what the first real white-box test requires, initially:
- reset state
- force test-only crash

- [ ] Add a test-build-only reset mechanism to the selected target.
- [ ] Verify it is unavailable in production/release configuration.
- [ ] Add a test-build-only intentional crash trigger.
- [ ] Add one scenario using each hook.
- [ ] Verify crash observation/relaunch evidence is captured.
- [ ] Commit target changes separately from runner changes.

Do not implement a generic plugin SDK at this stage.

## Task 10: Validate a black-box target

**Files:**
- Create: `targets/<black-box-target>.target.json`
- Modify: `README.md` only if setup differs.

- [ ] Configure one black-box target.
- [ ] Run launch/navigation/input/stress/relaunch scenarios.
- [ ] Verify unavailable internal operations are `NOT_SUPPORTED`.
- [ ] Verify screenshots and final report are generated.
- [ ] Record concrete iOS automation restrictions discovered during the run.
- [ ] Commit: `test: validate black box ios target`

**Milestone 4 gate:** One white-box target and one black-box target use the same runner and reporting pipeline.

---

# Milestone 5 — AI Explorer MVP

## Task 11: Add bounded exploratory decision loop

**Files:**
- Create: `src/explorer/explore.ts`
- Create: `src/explorer/types.ts`
- Create: `tests/explorer.test.ts`
- Modify: `src/config.ts`
- Modify: `src/runner/run-test-suite.ts`

**Interfaces:**
- Produces: `explore(context, options): Promise<ExplorationResult>`
- Options include `maxActions`.
- Explorer input includes screenshot reference, UI hierarchy, visited actions, and allowed capabilities.
- Explorer output is one structured next action or `STOP`.

- [ ] Write tests for max-action termination, unsupported action rejection, malformed AI output, and STOP.
- [ ] Verify tests fail.
- [ ] Implement UI hierarchy capture.
- [ ] Define the smallest structured action schema required for tap/type/swipe/back/wait/STOP.
- [ ] Connect the chosen model through one small adapter.
- [ ] Execute AI-selected actions through existing deterministic iOS actions.
- [ ] Save each decision and associated screenshot in the report.
- [ ] Add hard guards against purchases and destructive external actions unless explicitly enabled.
- [ ] Run a bounded exploratory session against the first target.
- [ ] Commit: `feat: add bounded ai explorer`

**Milestone 5 gate:** The agent explores a target for a limited number of actions and produces an evidence-backed anomaly/coverage summary.

---

# Milestone 6 — Physical iPhone

## Task 12: Add connected-device target support

**Files:**
- Modify: `src/config.ts`
- Modify: `src/device/appium-session.ts`
- Create: `tests/device-config.test.ts`
- Create: `targets/example.real-device.target.json`
- Modify: `README.md`

**Interfaces:**
- Extend target configuration with `deviceType: "simulator" | "real"`.
- Real device fields are explicit and validated.

- [ ] Write configuration tests for simulator versus real-device requirements.
- [ ] Verify tests fail.
- [ ] Implement real-device Appium capability mapping.
- [ ] Document Xcode/WebDriverAgent prerequisites.
- [ ] Connect one iPhone.
- [ ] Execute the smallest supported smoke scenario.
- [ ] Record any App Store/signing limitations discovered instead of designing speculative workarounds.
- [ ] Commit: `feat: support connected ios devices`

---

# Milestone 7 — Stabilization

## Task 13: Make the local workflow one-command and repeatable

**Files:**
- Modify: `README.md`
- Modify: `package.json`
- Modify runner files only for bugs found during repeated runs.

- [ ] Add `npm run test:ios -- --target ...` documentation.
- [ ] Add startup prerequisite checks for Node, Appium endpoint, target config, and required environment variables.
- [ ] Ensure sessions are closed in `finally` blocks.
- [ ] Ensure reports are attempted after runner/device errors.
- [ ] Run the full unit test suite.
- [ ] Run typecheck.
- [ ] Perform repeated local end-to-end runs.
- [ ] Fix only reproducible defects discovered by those runs.
- [ ] Commit: `chore: stabilize local ios testing workflow`

---

# MVP Completion Checklist

- [ ] Local Cursor/terminal setup documented.
- [ ] iOS Simulator run works.
- [ ] Deterministic scenario runner works.
- [ ] Standard login/state/stress scenarios supported where applicable.
- [ ] Screenshots and evidence saved.
- [ ] Crash/termination observation supported.
- [ ] Freeze/UI timeout detection supported.
- [ ] White-box capabilities supported.
- [ ] Black-box capabilities supported.
- [ ] Unsupported steps report `NOT_SUPPORTED`.
- [ ] JSON + Markdown report produced.
- [ ] Slack Notifier receives final summary.
- [ ] Bounded AI exploration works.
- [ ] One connected-iPhone smoke test completed.
- [ ] No cloud backend is required.

---

# Recommended Development Order in Cursor

Implement strictly in Milestone order.

Do **not** begin the AI Explorer until Milestones 1–4 work end-to-end.

For each task:

1. write the test first;
2. run it and confirm failure;
3. implement the smallest solution;
4. run the relevant tests;
5. run TypeScript typecheck;
6. manually exercise the feature when it touches iOS/Appium;
7. commit only after human approval;
8. move to the next task.

The first meaningful product checkpoint is the end of **Milestone 3**. At that point the project should already be useful: it can run iOS tests locally, capture evidence, generate a report, and notify Slack.
