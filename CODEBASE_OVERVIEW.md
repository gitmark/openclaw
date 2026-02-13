# OpenClaw Codebase Overview

## What It Does

OpenClaw is a **locally-hosted personal AI assistant platform**. It acts as a unified gateway/control plane that connects multiple messaging channels (WhatsApp, Telegram, Slack, Discord, Signal, iMessage, Teams, Matrix, and more) to AI agents. Users run it on their own devices and interact with AI through any of their existing messaging apps. It also supports voice interaction, a live visual canvas, scheduled tasks (cron), and an extensible skills/plugin system.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Language** | TypeScript (ESM), Swift (macOS/iOS), Kotlin (Android) |
| **Runtime** | Node.js 22+ |
| **Agent engine** | Pi agent runtime (`@mariozechner/pi-agent-core`) |
| **Server** | Express 5 + WebSocket (`ws`) |
| **Database** | SQLite (node:sqlite) + `sqlite-vec` for vector embeddings |
| **AI providers** | Anthropic (Claude), OpenAI, Google Gemini, Ollama, OpenRouter, Bedrock |
| **Messaging** | Baileys (WhatsApp), grammY (Telegram), @slack/bolt, discord.js, and more |
| **Build** | tsdown, pnpm monorepo, Vitest, oxlint/oxfmt |
| **UI** | Lit web components, Rolldown bundler |
| **Infra** | Docker (node:22-bookworm), Render.yaml, docker-compose |

## Main Entry Points

- **`src/entry.ts`** — CLI bootstrap; parses profile args and launches the main program
- **`src/index.ts`** — Public API barrel export; installs global error handlers
- **`openclaw.mjs`** — Binary entry point (Node loader shim)
- **Gateway server** (`src/gateway/server/`) — Central WebSocket control plane, default port `18789`

Key CLI commands:

```
openclaw onboard       # Interactive setup wizard
openclaw gateway       # Start the WebSocket gateway server
openclaw agent         # Send a message to an agent
openclaw tui           # Terminal UI
openclaw doctor        # Diagnose config issues
```

## Project Structure

```
src/gateway/       — WebSocket server + RPC method handlers
src/agents/        — Pi agent runtime, tools, system prompts, auth profiles
src/channels/      — Unified channel abstraction + built-in plugins
src/cli/           — CLI command infrastructure (Commander.js)
src/config/        — Config loading (Zod-validated openclaw.json)
src/sessions/      — Conversation session persistence (SQLite)
src/memory/        — Vector search & embeddings
src/browser/       — Playwright-based browser automation tools
apps/              — Native apps (macOS SwiftUI, iOS, Android Kotlin)
skills/            — 54+ bundled integrations (GitHub, Spotify, Trello, etc.)
extensions/        — Pluggable channel modules (Matrix, Teams, Zalo, IRC, etc.)
ui/                — Web control panel & WebChat (Lit components)
```

## Architecture Highlights

- **Gateway-first**: All channels and clients connect via WebSocket to a central gateway
- **Security-first**: Loopback binding by default, DM pairing codes, allowlists, non-root Docker
- **Multi-agent routing**: Messages route to different AI agents based on channel/peer rules
- **Config layering**: env vars > `.env` files > `openclaw.json`
- **Monorepo**: Root (core), `ui/`, `extensions/`, `skills/` as workspace packages
