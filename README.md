# AI Testing Agent

An AI-assisted mobile QA agent, starting with iOS. It targets applications through configuration, so it is not tied to one app. The same core is meant to run deterministic tests in white-box and black-box modes, collect screenshots and other evidence, and send reports to Slack Notifier. Bounded AI exploratory testing comes later.

## Current status

Early development — Milestone 1. `.github/workflows/ios-smoke.yml` exists and is the primary iOS backend path. The hosted iOS environment has not been verified. No real Appium iOS app session has run. The iOS test runner does not work yet.

## Architecture

```text
Cursor / Local Development
        ↓
GitHub Repository
        ↓
GitHub Actions
standard macOS runner
        ↓
Appium + XCUITest
        ↓
iOS Simulator
        ↓
Target App
        ↓
Artifacts / Reports
        ↓
Slack Notifier
```

## Why GitHub Actions

This path avoids a large local Xcode and iOS Simulator install and keeps the developer Mac lightweight. iOS execution uses standard GitHub-hosted macOS runners. On this public repository, that standard-runner usage is the free MVP path, and each run starts from a clean, reproducible macOS environment. That is not unlimited free capacity. Larger runners and paid device clouds are out of scope. If the repository becomes private later, the cost assumption has to be reevaluated.

## Dynamic targets

The agent is not tied to one app.

```bash
npm run test:ios -- --target targets/example.target.json
```

Changing the app should normally be target configuration, not a core-source change. That command is the intended entry. It is not a working iOS run yet.

## Currently verified

- The Node.js and TypeScript project exists.
- Dynamic target loading works.
- Two target configs load.
- Tests pass.
- Typecheck passes.
- The Appium 3.8.0 dependency is installed.
- The XCUITest driver 12.20.0 is installed.
- A local Appium startup smoke test passed.

`.github/workflows/ios-smoke.yml` exists. The hosted iOS environment has not been verified. No real Appium iOS app session has run. No app has been launched by the agent yet. No screenshot from an iOS test exists yet.

## Development workflow

Architect → Builder → Analyst → Architect → Human Approval.

The Architect scopes the task. The Builder implements it. The Analyst reviews read-only. Integration happens only after approval.

## Local requirements

MVP development on this Mac needs Node.js, npm, Git, and Cursor or another editor. Full local Xcode is not required for the primary MVP execution path.

## Roadmap

- [BACKLOG.md](BACKLOG.md)
- [PLAN.md](PLAN.md)
