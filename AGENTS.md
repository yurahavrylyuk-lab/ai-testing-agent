# AI Testing Agent

## Repository

`/Users/yuriy/Documents/IT Study/General/General/AI Agents/APP Testing Agent`

`BACKLOG.md` is the product spec. `PLAN.md` is the roadmap. `docs/HANDOFF.md` is the current task. Implement only the task in the handoff.

## Roles

- **Architect** — scope, architecture, task boundaries, acceptance criteria, and approval gates. Assigns one narrow task. Does not implement the current Builder task.
- **Builder** — implements the approved task and runs the verification named in the handoff. Stays inside that task.
- **Analyst** — independent read-only review. Never modifies, stages, commits, pushes, merges, or fixes code.

## Workflow

Architect → Builder → Analyst → Architect → Human Approval

The next milestone starts only after the current milestone gate is approved.

## Milestones

Every roadmap stage in `BACKLOG.md` and `PLAN.md` is a Milestone. Keep those names. Do not rename Milestones to AT tasks.

Active milestone: Milestone 1 — Project Foundation + GitHub-Hosted iOS Test Runner.

## Execution

Cursor and local development stay on this Mac: Node, TypeScript, and Architect → Builder → Analyst → Human Approval.

iOS execution goes: GitHub repo → GitHub Actions standard macOS hosted runner → Xcode / simctl → iOS Simulator → Appium + XCUITest → target app → screenshots, logs, results → Actions artifacts → Slack Notifier.

GitHub Actions is the execution environment for iOS tests. This is not a distributed platform, device farm, queue, or microservice. Xcode is not required on the developer Mac for the MVP. Local Xcode and the local iOS Simulator may be an optional backend later.

## Living Documentation

Code and project documentation must not intentionally drift apart.

`BACKLOG.md`, `PLAN.md`, and `docs/HANDOFF.md` are living documents. The Architect reconciles them with the repo after every meaningful production step or state transition, not after every trivial edit.

- `BACKLOG.md` tracks product scope, Milestone status, completed capabilities, remaining capabilities, and meaningful scope changes.
- `PLAN.md` tracks implementation strategy, completed tasks, remaining tasks, architectural changes discovered during development, and real blockers. It stays a plan, not an activity log.
- `docs/HANDOFF.md` tracks current role/workflow state, current task, Builder verification, Analyst result, Architect decision, and integration status.

## Core Rules

- Local development, hosted iOS execution. Develop on this Mac from Cursor. Run iOS tests on a standard GitHub-hosted macOS runner.
- iOS-first.
- Simple MVP-first architecture. Fastest usable MVP.
- MVP execution must use free infrastructure. Primary execution is standard GitHub-hosted macOS runners on the public repository. Do not select larger runners, Sauce Labs, BrowserStack, AWS device farms, or other paid device clouds. If the repo becomes private later, cost assumptions must be reevaluated.
- No dashboard, microservices, queues, or device-farm abstraction for the MVP.
- White-box and black-box testing share one testing core.
- Deterministic scenarios come before AI exploration.
- The runner is not tied to one app. The target is selected by configuration. Future usage is `npm run test:ios -- --target targets/dime.target.json` and `npm run test:ios -- --target targets/another-app.target.json`. The same runner tests different apps without core source changes. A new app normally needs only a new target config and, where appropriate, app-specific scenarios.
- Milestone 1 establishes dynamic target loading. Do not build the scenario engine in Milestone 1.
- Generic scenarios and app-specific scenarios are future scope. Generic: launch, relaunch, background/foreground, rapid taps, rapid text input, navigation smoke, freeze detection. App-specific: login, logout, create transaction, CSV import, and other app-specific flows.
- Report unsupported functionality honestly (`NOT_SUPPORTED`). Never present it as success.
- Secrets stay in environment variables and are never committed.
- No fake verification. Record real command results.

## Git

- Inspect `git status` before changing files.
- Change only files that belong to the approved task.
- No force push.
- No destructive git without approval.
- No merge without human approval.
- The Analyst never commits or stages.
- A Builder commit happens only when the approved task says to commit. Keep it local until a push is explicitly approved.
- A commit happens only after human approval. Leave the current Builder task uncommitted for the Analyst.
- Secrets must never enter Git history.
- `.env` stays ignored.
- `.env.example` may be committed.
- `artifacts/` is ignored except intentional placeholders.
- Before the first push, run the public-repo safety check: `git status`, `git remote -v`, and `gh auth status`. Confirm that no `.env`, Slack webhook, credentials, generated artifacts, machine secrets, or other sensitive files are included, and that `.gitignore` is correct.
- Public GitHub repo `yurahavrylyuk-lab/ai-testing-agent` exists and is public. Origin is `https://github.com/yurahavrylyuk-lab/ai-testing-agent.git`. Do not force-push. Further pushes need human approval.
