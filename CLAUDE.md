# CLAUDE.md - OpenClaw Repository Guide

## Overview

OpenClaw is a multi-channel AI gateway with extensible messaging integrations. It provides a personal AI assistant platform that runs on your own devices, with support for dozens of messaging channels (Telegram, Discord, Slack, WhatsApp, Signal, iMessage, Matrix, and more), desktop apps (macOS, iOS, Android), a CLI, and a web control UI.

- **Repo:** https://github.com/openclaw/openclaw
- **Language:** TypeScript (ESM), strict mode
- **Runtime:** Node.js 22+ (Bun also supported for scripts/dev)
- **Package Manager:** pnpm 10.23.0+ (monorepo with workspaces)
- **Version scheme:** date-based `YYYY.M.D` (current: 2026.2.10)
- **License:** MIT

## Project Structure

```
openclaw/
├── src/                  # Core TypeScript source (69+ subdirectories)
│   ├── agents/           # AI agent core logic, LLM integration, tools
│   ├── cli/              # CLI wiring and interactive prompts
│   ├── commands/         # CLI commands (agent, channels, models, config, etc.)
│   ├── channels/         # Channel routing, allowlists, plugin system
│   ├── gateway/          # Gateway server, protocol, web UI bridge
│   ├── config/           # Config loading, schema validation, paths
│   ├── memory/           # Memory/knowledge store (LanceDB, QMD)
│   ├── routing/          # Message routing, session management
│   ├── telegram/         # Telegram channel
│   ├── discord/          # Discord channel
│   ├── slack/            # Slack channel
│   ├── signal/           # Signal channel
│   ├── imessage/         # iMessage channel (macOS)
│   ├── whatsapp/         # WhatsApp channel (via web)
│   ├── web/              # Web channel
│   ├── browser/          # Browser automation tools
│   ├── hooks/            # Event hooks system
│   ├── tui/              # Terminal UI
│   ├── wizard/           # Onboarding wizard
│   ├── infra/            # Infrastructure (exec, ports, errors, dotenv)
│   ├── logging/          # Structured logging (tslog)
│   ├── security/         # Security audit, code analysis
│   ├── plugin-sdk/       # Plugin SDK for extensions
│   ├── process/          # Process execution, RPC
│   ├── tts/              # Text-to-speech (Edge TTS)
│   ├── media/            # Media processing (images, video)
│   ├── terminal/         # Terminal/PTY utilities, palette, tables
│   ├── shared/           # Shared utilities
│   └── types/            # TypeScript type definitions
├── extensions/           # 35 channel/feature plugins (workspace packages)
├── skills/               # 100+ bundled AI skills
├── packages/             # Workspace packages (clawdbot, moltbot shims)
├── ui/                   # Lit.js-based web control panel (Vite build)
├── apps/                 # Native apps
│   ├── macos/            # macOS app (SwiftUI)
│   ├── ios/              # iOS app (SwiftUI)
│   ├── android/          # Android app (Kotlin)
│   └── shared/           # Shared OpenClawKit framework
├── docs/                 # Mintlify documentation (28+ categories)
├── test/                 # Test utilities, fixtures, setup
├── scripts/              # Build, dev, and automation scripts
├── vendor/               # Vendored dependencies (a2ui renderers)
├── .github/              # CI/CD workflows (GitHub Actions)
├── .agents/              # Agent skills for PR workflow automation
└── dist/                 # Built output (do not edit)
```

### Extensions

Extensions live in `extensions/*/` as workspace packages. Each extension has:
- `package.json` with `openclaw.extensions` field
- `openclaw.plugin.json` with plugin metadata and config schema
- `index.ts` exporting the plugin implementation

Plugin-only deps go in the extension's `package.json`, not the root. Use `devDependencies` or `peerDependencies` for `openclaw` (not `dependencies` with `workspace:*`).

## Quick Reference Commands

### Build & Development

```bash
pnpm install              # Install all dependencies
pnpm build                # Full production build (tsdown + UI + DTS + hooks)
pnpm dev                  # Run CLI in dev mode
pnpm gateway:dev          # Run gateway in dev (skip channels)
pnpm tui                  # Terminal UI
pnpm ui:dev               # Control UI dev server (Vite)
```

### Testing

```bash
pnpm test                 # Run unit tests (parallelized vitest)
pnpm test:watch           # Watch mode
pnpm test:coverage        # With V8 coverage (70% thresholds)
pnpm test:e2e             # E2E test suite
pnpm test:live            # Live API tests (needs CLAWDBOT_LIVE_TEST=1)
pnpm test:docker:all      # All Docker-based E2E tests
pnpm test:ui              # UI tests
```

### Linting & Formatting

```bash
pnpm check                # format:check + tsgo + lint (run before commits)
pnpm lint                 # oxlint --type-aware
pnpm lint:fix             # oxlint --fix + oxfmt --write
pnpm format               # oxfmt --write
pnpm format:check         # oxfmt --check
pnpm lint:swift           # SwiftLint (macOS/iOS)
pnpm format:swift         # SwiftFormat (macOS/iOS)
```

### Type Checking

```bash
pnpm tsgo                 # TypeScript type-check (fast)
pnpm build                # Full build (also type-checks)
```

## Testing Guidelines

- **Framework:** Vitest with V8 coverage
- **Coverage thresholds:** 70% lines, 70% functions, 55% branches, 70% statements
- **Test naming:** colocated `*.test.ts` next to source files
- **E2E tests:** `*.e2e.test.ts` suffix
- **Live tests:** `*.live.test.ts` suffix (opt-in via env vars)
- **Setup:** `test/setup.ts` provides global test setup with plugin registry stubs
- **Pool:** forks (for isolation); max 16 workers locally, 2-3 in CI
- **Timeouts:** 120s default, 180s on Windows
- Do not set test workers above 16
- Pure test additions/fixes generally do not need a changelog entry

## Coding Conventions

### TypeScript Style

- **ESM only:** `import ... from "..."` (no CommonJS)
- **Strict typing:** `no-explicit-any` enforced by oxlint; avoid `any`
- **Node built-ins:** prefix with `node:` (e.g., `import fs from "node:fs"`)
- **Type imports:** use `import type { T } from "..."`
- **Formatting/linting:** Oxfmt + Oxlint; run `pnpm check` before commits
- **File size:** aim for under 500-700 LOC; split/refactor for clarity
- **Comments:** brief, for tricky/non-obvious logic only

### Naming

- **Product/app/docs headings:** `OpenClaw`
- **CLI, package, binary, paths, config keys:** `openclaw`
- **Commit messages:** concise, action-oriented (e.g., `CLI: add verbose flag to send`)

### Architecture Patterns

- **Dependency injection:** `createDefaultDeps()` pattern for testable code
- **Plugin system:** `ChannelPlugin` interface in `src/channels/plugins/types.js`
- **Config validation:** Zod schemas throughout
- **Event hooks:** `src/hooks/` for extensibility
- **CLI progress:** use `src/cli/progress.ts` (osc-progress + @clack/prompts spinner)
- **Status output:** `src/terminal/table.ts` for tables + ANSI-safe wrapping
- **Colors:** use shared CLI palette in `src/terminal/palette.ts` (no hardcoded colors)

### Control UI (Lit.js)

The web control UI uses Lit with **legacy** decorators (not standard decorators):

```ts
@state() foo = "bar";
@property({ type: Number }) count = 0;
```

`tsconfig.json` has `experimentalDecorators: true` and `useDefineForClassFields: false`. Do not change these without updating the UI build tooling.

## Commit & PR Guidelines

- Use `scripts/committer "<msg>" <file...>` to create commits (scoped staging)
- Follow concise, action-oriented commit messages (e.g., `fix(telegram): handle no-text message`)
- Group related changes; avoid bundling unrelated refactors
- Run `pnpm build && pnpm check && pnpm test` before pushing
- Keep PRs focused (one thing per PR)
- AI-assisted PRs are welcome; mark them and note testing level
- Full PR workflow docs: `.agents/skills/PR_WORKFLOW.md`

## CI/CD

GitHub Actions workflows in `.github/workflows/`:

| Workflow | Purpose |
|----------|---------|
| `ci.yml` | Main pipeline: lint, format, build, unit tests, e2e, live tests, Docker tests, native builds |
| `docker-release.yml` | Build and publish Docker images |
| `install-smoke.yml` | Test npm install scripts |
| `formal-conformance.yml` | Protocol conformance tests |

CI uses smart scope detection (docs-only, Node changes, macOS, Android) to skip irrelevant jobs.

## Pre-commit Hooks

Installed via `prek install`. Hooks run:
- Trailing whitespace & EOF fixer
- YAML syntax check
- Secret detection (detect-secrets)
- Shell script linting (shellcheck)
- GitHub Actions validation (actionlint + zizmor)
- oxlint (type-aware) and oxfmt on staged TS/JS files
- SwiftLint + SwiftFormat on staged Swift files

## Configuration

- **TypeScript:** `tsconfig.json` - ES2023 target, NodeNext modules, strict mode
- **Build:** `tsdown.config.ts` - 6 entry points (index, entry, plugin-sdk, extensionAPI, hooks, warning-filter)
- **Lint:** `.oxlintrc.json` - unicorn + typescript + oxc plugins; correctness/perf/suspicious = error
- **Format:** `.oxfmtrc.jsonc` - sorts imports and package.json scripts
- **Tests:** `vitest.config.ts` (base), plus `vitest.unit.config.ts`, `vitest.e2e.config.ts`, `vitest.live.config.ts`, `vitest.gateway.config.ts`, `vitest.extensions.config.ts`

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `@mariozechner/pi-*` | Agent framework (core, AI, coding-agent, TUI) |
| `@agentclientprotocol/sdk` | Agent Client Protocol |
| `grammy` | Telegram bot framework |
| `@slack/bolt` | Slack bot framework |
| `@buape/carbon` | Discord framework (do not update) |
| `@whiskeysockets/baileys` | WhatsApp Web client |
| `zod` | Schema validation |
| `commander` | CLI framework |
| `express` + `ws` | HTTP/WebSocket server (gateway) |
| `sharp` | Image processing |
| `playwright-core` | Browser automation |
| `lit` | Web components (control UI) |

## Documentation

- **Docs site:** https://docs.openclaw.ai (Mintlify-hosted)
- **Internal links:** root-relative, no `.md`/`.mdx` extension (e.g., `[Config](/configuration)`)
- **README links:** use absolute `https://docs.openclaw.ai/...` URLs
- **Docs content:** keep generic (no personal device names/hostnames/paths)
- **i18n (zh-CN):** `docs/zh-CN/**` is generated; do not edit manually

## Security Notes

- Never commit real phone numbers, API keys, or live config values
- Use obviously fake placeholders in docs, tests, and examples
- Report vulnerabilities to security@openclaw.ai or via GitHub
- Patched dependencies (`pnpm.patchedDependencies`) must use exact versions (no `^`/`~`)
- Patching dependencies requires explicit approval

## Multi-Agent Safety

When multiple AI agents may be working on the repo simultaneously:
- Do not create/apply/drop `git stash` entries unless explicitly requested
- Do not create/remove/modify `git worktree` checkouts unless explicitly requested
- Do not switch branches unless explicitly requested
- When pushing, `git pull --rebase` to integrate changes (never discard others' work)
- When committing, scope to your changes only
- When unrecognized files appear, continue; focus on your changes

## GitHub Operations

- GitHub issues/comments/PR comments: use literal multiline strings or `-F - <<'EOF'` for newlines; never embed `\n`
- When adding channels/extensions/apps/docs, update `.github/labeler.yml` and create matching labels
- When working on a GitHub Issue or PR, print the full URL at the end of the task

## Release

- **Stable:** tagged releases `vYYYY.M.D`, npm dist-tag `latest`
- **Beta:** prerelease tags `vYYYY.M.D-beta.N`, npm dist-tag `beta`
- **Dev:** moving head on `main` (no tag)
- Do not change version numbers without explicit consent
- Release flow docs: `docs/reference/RELEASING.md` and `docs/platforms/mac/release.md`
- Version locations: `package.json`, `apps/android/app/build.gradle.kts`, iOS/macOS Info.plist files, `docs/install/updating.md`
