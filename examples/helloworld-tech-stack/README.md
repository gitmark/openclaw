# OpenClaw Tech Stack Demo

A simple hello world application demonstrating the core technologies used in [OpenClaw](https://github.com/openclaw/openclaw). This project is designed for academic purposes to help you understand the different technologies you'll encounter when reading the OpenClaw codebase.

## 🚀 What This Demo Does

This is a minimal chat application where you can:
- Type messages that get stored in a SQLite database
- Optionally enhance messages with Claude AI responses
- View all your messages in a clean, modern UI
- See all 9 core technologies working together in harmony

## 🛠️ Technology Stack

### 1. **Node.js** - JavaScript Runtime

Node.js is a JavaScript runtime built on Chrome's V8 engine that allows you to run JavaScript on the server side. It uses an event-driven, non-blocking I/O model that makes it lightweight and efficient, perfect for data-intensive applications. OpenClaw runs on Node.js (v22.12.0+) and leverages its native modules like SQLite and HTTP for core functionality. Node.js enables the entire backend of this application, from the Express server to database operations.

### 2. **TypeScript** - Type-Safe JavaScript

TypeScript is a superset of JavaScript that adds static type definitions, enabling you to catch errors during development rather than at runtime. It provides excellent IDE support with autocomplete, type checking, and refactoring tools. OpenClaw is written entirely in TypeScript with strict mode enabled, ensuring type safety across the entire codebase. This demo uses TypeScript for both client and server code, demonstrating how types can be shared between frontend and backend.

### 3. **pnpm** - Fast Package Manager

pnpm is a fast, disk space-efficient package manager that uses a content-addressable filesystem to store packages. Unlike npm or yarn, pnpm creates a non-flat node_modules structure using symlinks, which saves disk space and speeds up installations. OpenClaw uses pnpm (v10.23.0) with workspace support for managing its monorepo structure with multiple packages and extensions. For this demo, pnpm manages all dependencies and provides convenient npm scripts for development.

### 4. **Vite** - Next-Generation Frontend Build Tool

Vite is a modern build tool that provides lightning-fast hot module replacement (HMR) during development and optimized production builds. It leverages native ES modules in the browser during development, eliminating the need for bundling in dev mode, which results in instant server start and updates. OpenClaw uses Vite (v7.3.1) for building its web UI, taking advantage of its TypeScript support, CSS preprocessing, and optimized bundling. This demo uses Vite to serve the Lit frontend with automatic proxy to the Express backend.

### 5. **Lit** - Web Components Library

Lit is a simple, fast library for building web components using modern web standards like Custom Elements and Shadow DOM. It provides a declarative template syntax with efficient updates, component-scoped CSS, and full TypeScript support. OpenClaw uses Lit (v3.3.2) extensively for all UI components, including terminal interfaces and web dashboards, along with related libraries like @lit/context for state management. This demo showcases a Lit component with reactive state, event handling, and scoped styling.

### 6. **Express** - Web Application Framework

Express is a minimal and flexible Node.js web application framework that provides a robust set of features for building web and mobile applications. It simplifies routing, middleware management, and HTTP utilities while remaining unopinionated about architecture. OpenClaw uses Express (v5.2.1) for its HTTP server, handling REST API endpoints, WebSocket upgrades, and serving static files. This demo uses Express to create a RESTful API with proper error handling and JSON middleware.

### 7. **SQLite** - Embedded Database

SQLite is a self-contained, serverless, zero-configuration SQL database engine that stores the entire database in a single file. Unlike client-server databases, SQLite runs in-process with your application, making it perfect for embedded applications, local development, and mobile apps. OpenClaw uses the native Node.js SQLite module for its local data storage, including message history, configuration, and vector embeddings via the sqlite-vec extension. This demo uses better-sqlite3 (similar to Node's native module) to store messages with full SQL capabilities.

### 8. **Vitest** - Modern Testing Framework

Vitest is a blazing-fast unit testing framework built on top of Vite, providing a Jest-compatible API with significantly better performance. It offers native TypeScript support, smart watch mode, code coverage, and seamless integration with Vite's configuration. OpenClaw uses Vitest (v4.0.18) for all testing needs with multiple configuration files for different test types (unit, e2e, live). This demo includes tests that demonstrate Vitest's API and its integration with Zod for validation testing.

### 9. **Zod** - TypeScript-First Schema Validation

Zod is a TypeScript-first schema declaration and validation library that allows you to define schemas that validate data at runtime while also providing static type inference. It catches invalid data at system boundaries (API inputs, file reads) while keeping your TypeScript types in sync. OpenClaw uses Zod (v4.3.6) extensively for validating API requests, configuration files, and data structures throughout the application. This demo uses Zod to validate API inputs with custom error messages and type transformations.

### 10. **Anthropic Claude API** - AI Language Model

The Anthropic Claude API provides access to Claude, a family of large language models that can understand context, generate text, answer questions, write code, and perform complex reasoning tasks. Claude is designed with safety and helpfulness in mind, offering models ranging from the fast Haiku to the powerful Opus. OpenClaw is built on Anthropic's Pi agent framework and uses Claude as its core AI engine for chat interactions, coding assistance, and multi-platform messaging. This demo integrates Claude to enhance user messages with AI-generated responses.

## 📁 Project Structure

```
helloworld-openclaw-stack/
├── src/
│   ├── server/              # Backend (Express + SQLite)
│   │   ├── index.ts        # Express server with API routes
│   │   ├── database.ts     # SQLite database operations
│   │   ├── schemas.ts      # Zod validation schemas
│   │   └── claude.ts       # Anthropic Claude API integration
│   ├── client/              # Frontend (Vite + Lit)
│   │   ├── index.html      # HTML entry point
│   │   ├── main.ts         # Client entry point
│   │   └── components/
│   │       └── chat-app.ts # Lit web component
│   └── shared/
│       └── types.ts         # Shared TypeScript types
├── tests/
│   └── api.test.ts          # Vitest test examples
├── package.json             # pnpm package configuration
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
├── vitest.config.ts         # Vitest test configuration
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** v22.12.0 or higher ([download](https://nodejs.org/))
- **pnpm** v10.23.0 or higher (`npm install -g pnpm`)
- **Anthropic API Key** (optional, for AI features) - Get one at [console.anthropic.com](https://console.anthropic.com/)

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd helloworld-openclaw-stack
   ```

2. **Install dependencies using pnpm:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables (optional for AI features):**
   ```bash
   cp .env.example .env
   # Edit .env and add your ANTHROPIC_API_KEY
   ```

### Running the Application

#### Option 1: Run both server and client together (recommended)

```bash
pnpm dev
```

This starts both the Express backend (port 3001) and Vite dev server (port 3000).

#### Option 2: Run separately

**Terminal 1 - Start the backend server:**
```bash
pnpm server
```

**Terminal 2 - Start the frontend dev server:**
```bash
pnpm client
```

#### Access the Application

Open your browser to: **http://localhost:3000**

You should see the chat interface where you can:
- Type messages and send them
- Check "Enhance with Claude AI" to get AI responses (requires API key)
- View all your messages stored in SQLite

### Running Tests

```bash
# Run all tests once
pnpm test

# Run tests in watch mode (automatically re-runs on file changes)
pnpm test:watch
```

### Building for Production

```bash
pnpm build
```

This creates an optimized production build in the `dist/client` directory.

## 🎓 Learning Path

To get the most out of this demo for understanding OpenClaw, I recommend exploring in this order:

1. **Start with TypeScript** (`src/shared/types.ts`)
   - See how types are shared between client and server
   - Notice how TypeScript provides autocomplete and safety

2. **Explore Zod validation** (`src/server/schemas.ts`)
   - Understand how runtime validation works
   - See how Zod types are inferred for TypeScript

3. **Study the SQLite database** (`src/server/database.ts`)
   - Learn basic SQL operations
   - See how the sync API works (no callbacks/promises needed)

4. **Examine the Express server** (`src/server/index.ts`)
   - Understand REST API endpoints
   - See how middleware and error handling work

5. **Look at the Lit component** (`src/client/components/chat-app.ts`)
   - Learn about web components and reactive state
   - See how Shadow DOM provides component isolation

6. **Check out Vite configuration** (`vite.config.ts`)
   - Understand the dev server proxy setup
   - See how Vite handles the build process

7. **Review the Vitest tests** (`tests/api.test.ts`)
   - Learn testing patterns and assertions
   - See how to test Zod schemas

8. **Explore Claude API integration** (`src/server/claude.ts`)
   - Understand how to call AI models
   - See async/await patterns in action

9. **Inspect pnpm configuration** (`package.json`)
   - See how scripts are organized
   - Understand dependency management

## 🔍 Key Concepts Demonstrated

### Type Safety (TypeScript + Zod)
- **Compile-time:** TypeScript catches type errors during development
- **Runtime:** Zod validates data from external sources (API requests)
- **Type Inference:** Zod schemas automatically generate TypeScript types

### Reactive UI (Lit)
- **Declarative templates:** UI is defined as a function of state
- **Automatic updates:** Changing `@state` properties triggers re-renders
- **Component isolation:** Shadow DOM keeps styles and behavior encapsulated

### Database Persistence (SQLite)
- **Serverless:** No separate database process to manage
- **SQL queries:** Use standard SQL for data operations
- **Synchronous API:** Simpler code without callback/promise complexity

### API Design (Express + Zod)
- **RESTful endpoints:** Standard HTTP methods (GET, POST)
- **Validation middleware:** Zod schemas validate all inputs
- **Error handling:** Proper HTTP status codes and error messages

### Modern Build Tools (Vite)
- **Fast development:** Instant HMR updates as you code
- **Optimized production:** Tree-shaking and code splitting
- **TypeScript support:** No additional configuration needed

### Testing (Vitest)
- **Fast execution:** Runs tests in milliseconds
- **Watch mode:** Automatically re-runs affected tests
- **TypeScript integration:** Test your actual types

## 📚 Additional Resources

### Documentation Links
- [Node.js Documentation](https://nodejs.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [pnpm Documentation](https://pnpm.io/)
- [Vite Guide](https://vite.dev/guide/)
- [Lit Documentation](https://lit.dev/docs/)
- [Express Guide](https://expressjs.com/en/guide/routing.html)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Vitest Guide](https://vitest.dev/guide/)
- [Zod Documentation](https://zod.dev/)
- [Anthropic Claude API](https://docs.anthropic.com/)

### OpenClaw Resources
- [OpenClaw GitHub Repository](https://github.com/openclaw/openclaw)
- [OpenClaw Documentation](https://openclaw.dev/)

## 💡 Tips for Reading OpenClaw Code

1. **Start with the types:** Look for `.ts` files with type definitions to understand data structures
2. **Follow the imports:** Use your IDE's "Go to Definition" to navigate code
3. **Look for Zod schemas:** They document the expected shape of data
4. **Find the tests:** They show how code is meant to be used
5. **Use the debugger:** Set breakpoints to understand execution flow
6. **Read component decorators:** `@customElement`, `@state`, etc. tell you how components work
7. **Check configuration files:** `tsconfig.json`, `vite.config.ts` reveal project setup
8. **Explore package.json:** Shows all dependencies and available scripts

## 🤝 What's Next?

After understanding these core technologies, you might want to explore:

- **Advanced OpenClaw features:**
  - Plugin/Extension system
  - Vector embeddings with sqlite-vec
  - Multi-platform messaging integrations
  - WebSocket real-time communication

- **Additional technologies from OpenClaw:**
  - Rolldown (next-gen bundler)
  - Playwright (browser automation)
  - Various messaging SDKs (Telegram, Slack, Discord, etc.)
  - Media processing (Sharp, PDF.js)

## 📝 License

This demo is for academic/educational purposes. Feel free to use and modify as needed for learning.

## 🙏 Acknowledgments

This project demonstrates technologies used in [OpenClaw](https://github.com/openclaw/openclaw), an AI gateway built on Anthropic's Claude.
