# AI Testing Agent — Backlog

## Product Goal

Build a straightforward local AI-assisted mobile testing agent, starting with iOS, that can:

- test apps we control (white-box);
- test third-party apps without source access (black-box);
- run standard reusable QA scenarios;
- perform limited AI-driven exploratory testing;
- collect screenshots, logs, crash/freeze evidence, and test results;
- generate a clear final report;
- send the report to the Slack app **Notifier** via webhook.

The first priority is a usable local MVP, not a large testing platform.

---

## Core Principles

1. **Local first** — run from the developer Mac using Cursor.
2. **iOS first** — Android comes only after the iOS workflow is usable.
3. **Simple before autonomous** — deterministic scenarios must work before AI exploration.
4. **Shared core** — white-box and black-box testing use the same runner and reporting pipeline.
5. **Evidence over guesses** — every failure should include reproducible evidence where possible.
6. **No unnecessary infrastructure** — no cloud orchestration, device farm, dashboard, queue system, or distributed workers in the MVP.
7. **Capability-aware testing** — unsupported black-box operations must be marked `NOT_SUPPORTED`, never silently faked.

---

# Milestones

## Milestone 1 — Project Foundation + Local iOS Test Runner

Status: IN_PROGRESS

- [x] Architect / Builder / Analyst workflow foundation
- [x] TypeScript project bootstrap
- [x] Dynamic target configuration
- [ ] Initial approved commit
- [ ] Public GitHub repository
- [ ] Xcode / Simulator environment
- [ ] Appium installation
- [ ] XCUITest driver installation
- [ ] Local iOS Appium session
- [ ] Launch selected target app
- [ ] Perform basic UI interaction
- [ ] Capture screenshot artifact
- [ ] Clean PASS / FAIL result

Verified done: workflow foundation, TypeScript project bootstrap, and dynamic target configuration. Analyst approved Task 1. `npm test` is 18 passing. `npm run typecheck` is passing. The CLI selects the app with `--target <path>` and loads both example targets. No commit, remote, Xcode, Simulator, or Appium work is verified.

Public GitHub repository `ai-testing-agent` stays a later Milestone 1 step. It waits for the initial approved commit. Do not create or push it before that approval. The publication steps are in `PLAN.md`.

### Goal
Run the project locally from Cursor and control an iOS application through Appium/XCUITest. The runner is not tied to one app. Milestone 1 establishes dynamic target loading and does not build the scenario engine.

### Dynamic targets
The target is selected by configuration. Future usage:

```bash
npm run test:ios -- --target targets/dime.target.json
npm run test:ios -- --target targets/another-app.target.json
```

The same runner tests different apps without core source changes. A new app normally needs only a new target config and, where appropriate, app-specific scenarios.

Generic scenarios and app-specific scenarios are future scope, not work to build now. Generic: launch, relaunch, background/foreground, rapid taps, rapid text input, navigation smoke, freeze detection. App-specific: login, logout, create transaction, CSV import, and other app-specific flows.

### Deliverables
- TypeScript/Node.js project
- dynamic target configuration (`--target <path>`)
- local configuration
- Appium setup
- XCUITest driver
- iOS Simulator connection
- app launch/terminate/relaunch
- basic UI actions:
  - tap
  - type
  - clear
  - swipe
  - wait for element
- screenshot capture
- first automated smoke test

### Acceptance Criteria
A command such as:

```bash
npm run test:ios -- --target targets/<app>.target.json
```

launches the app named by that target file in an iOS Simulator, performs at least one interaction, captures a screenshot, and exits with a clear PASS/FAIL result. Switching apps is a target-config change.

---

## Milestone 2 — Scenario Engine + Standard Test Pack

### Goal
Create reusable test scenarios instead of hardcoding every test in the runner.

### Initial standard scenarios
- clean launch
- logged-out launch
- valid login
- invalid login
- logout
- session persistence
- kill and relaunch
- background and foreground
- empty input
- invalid input
- rapid repeated taps
- rapid text entry
- navigation smoke test
- screenshot checkpoints
- unexpected app termination detection
- UI timeout/freeze detection

### Result states
- `PASS`
- `FAIL`
- `WARNING`
- `BLOCKED`
- `NOT_SUPPORTED`

### Acceptance Criteria
The same runner can execute multiple scenarios from configuration and produce a structured result for every scenario.

---

## Milestone 3 — Evidence + Slack Notifier Report

### Goal
Make every test run produce a useful report automatically.

### Evidence
- run metadata
- scenario results
- screenshots
- timestamps
- failed step
- error message
- app termination/crash observation
- timeout/freeze observation
- optional device/app logs where available

### Output
- `results.json`
- human-readable Markdown or HTML report
- local artifacts directory per run

Example:

```text
artifacts/
  2026-10-25T103000/
    results.json
    report.md
    screenshots/
    logs/
```

### Slack
Send a compact final summary to **Notifier** through the configured Slack webhook.

The Slack report should include:
- app
- build/version when known
- device
- total tests
- passed
- failed
- warnings
- blocked/not supported
- critical failures
- local artifact/report location or links when available

### Acceptance Criteria
A completed local test automatically sends one final Slack message through Notifier.

---

## Milestone 4 — White-Box + Black-Box Capability Layer

### Goal
Support both kinds of applications without creating separate testing systems.

### White-box capabilities
For apps we control:
- reset test state
- seed logged-in/logged-out state
- trigger test-only crash
- simulate selected backend failures
- expose extra diagnostics when useful

These hooks are optional and test-build-only.

### Black-box capabilities
For apps without source:
- UI interaction
- screenshot capture
- accessibility/UI hierarchy inspection
- app terminate/relaunch
- background/foreground
- state observation
- stress interaction
- crash observation
- freeze/hang observation
- permission interaction where possible

### Capability manifest
Each target declares what is available.

Example:

```json
{
  "mode": "black-box",
  "capabilities": {
    "uiAutomation": true,
    "screenshots": true,
    "processRelaunch": true,
    "internalCrashInjection": false,
    "databaseSeeding": false
  }
}
```

### Acceptance Criteria
The same scenario system can run against white-box and black-box targets, and unavailable operations are reported as `NOT_SUPPORTED`.

---

## Milestone 5 — AI Explorer MVP

### Goal
Add useful AI exploration without turning the entire runner into an unpredictable autonomous system.

### Inputs to the explorer
- current screenshot
- accessibility/UI tree
- current screen/state
- actions already taken
- test objective
- recent failures

### AI responsibilities
- describe current screen
- identify interactable controls
- choose one next safe test action
- try useful edge cases
- recognize suspicious behavior
- record reasoning summary for the report

### Guardrails
- maximum action count
- maximum run duration
- no purchases
- no destructive account actions unless explicitly allowed
- no sending messages/emails
- no modifying external accounts without explicit permission
- deterministic runner remains responsible for executing actions

### Acceptance Criteria
The agent can explore a simple app for a bounded number of actions and report at least:
- visited screens
- attempted actions
- observed anomalies
- screenshots attached to anomalies

---

## Milestone 6 — Real iPhone Black-Box Execution

### Goal
Run the same black-box testing pipeline against a connected physical iPhone.

### Scope
- device detection
- device selection
- WebDriverAgent/Appium setup
- launch an installable test target
- execute supported scenarios
- capture evidence
- report limitations clearly

### Notes
App Store third-party testing may have platform/signing/automation restrictions. These must be validated experimentally rather than assumed.

### Acceptance Criteria
At least one supported app can be tested on a connected real iPhone using the same scenario/result/report pipeline.

---

## Milestone 7 — Stabilization

### Goal
Make the MVP dependable enough for repeated daily use.

### Work
- retry policy only where safe
- clearer error classification
- configuration validation
- cleanup between runs
- stable artifact naming
- regression test suite for the runner itself
- improved Slack summaries
- README setup instructions
- example target configuration
- one-command local execution

### Acceptance Criteria
A new local test run can be started predictably from Cursor/terminal with minimal manual setup.

---

# Future Backlog

Not required for first usable release:

- Android support
- cloud/device farms
- CI/CD execution
- scheduled runs
- web dashboard
- multi-device parallel execution
- visual regression baselines
- OCR-based fallback
- long-running autonomous exploration
- LLM-generated test plans from product requirements
- automatic Jira/GitHub issue creation
- historical analytics
- test case management platform integrations
- remote artifact storage
- team/user management

---

# Definition of MVP

The MVP is complete when the system can locally:

1. start an iOS test run;
2. launch a target app;
3. execute standard deterministic scenarios;
4. work in both white-box and black-box capability modes;
5. capture screenshots and failure evidence;
6. detect obvious crash/termination and UI timeout/freeze behavior;
7. generate a structured report;
8. send the summary to Slack Notifier;
9. perform a bounded AI exploratory run;
10. do all of the above without a cloud backend or separate dashboard.
