# Shakel - AI Coding Agent Reference

This document provides essential information about the Shakel project for AI coding agents.

## Project Overview

**Shakel** is a visual builder platform for creating web applications and Telegram bots without coding. It provides:

- **Visual Builder**: Drag-and-drop interface for constructing UI components and pages
- **Workflow Automation**: Node-based editor for creating automation flows with AI integrations
- **Design System Management**: Token-based theming with colors, spacing, typography, and effects
- **Code Generation**: Automated generation of Next.js (web) and NestJS (bot) code
- **AI Integrations**: Support for Gemini, DeepSeek, Mistral, Ollama, Anthropic, OpenAI
- **Third-party Integrations**: Discord, Slack, HTTP requests, Google Forms, Stripe

**Language**: The project uses Russian language in UI text (metadata, titles) and documentation comments (marked with `//` comments).

## Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js | 16.1.5 (App Router) |
| UI Library | React | 19.2.3 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | v4 |
| Database | PostgreSQL | 14+ |
| ORM | Prisma | 7.3.0 |
| API | tRPC | 11.8.1 |
| Auth | Better Auth | 1.4.17 |
| Workflow Engine | Inngest | 3.49.3 |
| Payments | Polar.sh | SDK 0.42.5 |
| UI Components | shadcn/ui | New York style |
| State Management | Zustand | 5.0.11 |
| State Management | Jotai | 2.16.2 |
| Forms | React Hook Form + Zod | 7.71.1 / 4.3.6 |
| Query Client | TanStack React Query | 5.90.20 |
| Font | Geist | (Vercel font) |

### Key Dependencies

- **@xyflow/react** - React Flow for workflow node editor
- **@dnd-kit/** - Drag and drop kit for builder canvas
- **@monaco-editor/react** - Code editor component
- **@inngest/realtime** - Real-time workflow updates
- **@polar-sh/better-auth** - Payment integration with auth
- **ts-morph** - TypeScript AST manipulation for code generation
- **cryptr** - AES encryption for credentials
- **toposort** - Topological sorting for workflow execution

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (landing)/               # Landing page routes (no URL prefix)
│   │   ├── layout.tsx           # Landing layout with Header
│   │   ├── page.tsx             # Home page
│   │   ├── contact/             # Contact page
│   │   ├── docs/                # Documentation page
│   │   ├── features/            # Features page
│   │   └── pricing/             # Pricing page
│   ├── (dashboard)/             # Dashboard routes
│   │   ├── (editor)/            # Visual builder editor routes
│   │   │   ├── web/[webId]/     # Web project editor
│   │   │   ├── bots/[botId]/    # Bot project editor
│   │   │   └── automates/[automateId]/  # Workflow editor
│   │   └── (rest)/              # Dashboard management pages
│   │       ├── projects/        # Project management
│   │       ├── workflows/       # Workflow management
│   │       ├── credentials/     # API credentials
│   │       ├── executions/      # Execution history
│   │       ├── resources/       # Resources page
│   │       └── settings/        # User settings
│   ├── (auth)/                  # Auth routes
│   │   ├── login/               # Login page
│   │   └── signup/              # Registration page
│   ├── api/                     # API routes
│   │   ├── auth/[...all]/       # Better Auth handlers
│   │   ├── trpc/[trpc]/         # tRPC handler
│   │   └── inngest/             # Inngest webhook endpoint
│   ├── layout.tsx               # Root layout (fonts, providers)
│   └── globals.css              # Global styles (Tailwind v4)
│
├── features/                     # Feature-based modules
│   ├── auth/                    # Authentication components
│   │   └── components/          # Auth-related UI components
│   ├── builder/                 # Visual builder core
│   │   ├── codegen/             # Code generation (NextJS)
│   │   ├── components/          # Builder UI components
│   │   │   ├── canvas/          # Canvas area
│   │   │   ├── palette/         # Component palette
│   │   │   ├── panels/          # Side panels
│   │   │   ├── toolbar/         # Builder toolbar
│   │   │   ├── viewport/        # Viewport controls
│   │   │   ├── dnd/             # Drag and drop components
│   │   │   └── code-editor/     # Monaco editor integration
│   │   ├── hooks/               # Builder hooks
│   │   ├── server/              # Builder TRPC router
│   │   ├── stores/              # Zustand canvas state
│   │   ├── types/               # Builder types
│   │   └── utils/               # Builder utilities
│   ├── credentials/             # API credentials management
│   │   ├── components/          # Credential UI components
│   │   ├── hooks/               # Credential hooks
│   │   └── server/              # Credentials TRPC router
│   ├── design-system/           # Design tokens management
│   │   └── server/              # Design system TRPC router
│   ├── executions/              # Workflow execution
│   │   ├── components/          # Node UI components
│   │   │   ├── deepseek/        # DeepSeek AI node
│   │   │   ├── gemeni/          # Gemini AI node
│   │   │   ├── mistral/         # Mistral AI node
│   │   │   ├── ollama/          # Ollama AI node
│   │   │   ├── discord/         # Discord integration node
│   │   │   ├── slack/           # Slack integration node
│   │   │   └── http-request/    # HTTP request node
│   │   ├── lib/                 # Executor registry
│   │   └── server/              # Executions TRPC router
│   ├── landing/                 # Landing page components
│   ├── project/                 # Project management
│   │   └── server/              # Projects TRPC router
│   ├── subscriptions/           # Payment/subscription handling
│   └── workflows/               # Workflow CRUD operations
│       └── server/              # Workflows TRPC router
│
├── components/                   # Shared components
│   ├── ui/                      # shadcn/ui components
│   │   ├── acernity/            # Aceternity UI components
│   │   ├── kokonut/             # Kokonut UI components
│   │   ├── magic/               # Magic UI components
│   │   └── hero-animations/     # Hero animation components
│   └── react-flow/              # React Flow custom nodes
│
├── lib/                          # Shared libraries
│   ├── auth.ts                  # Better Auth configuration
│   ├── auth-client.ts           # Auth client
│   ├── auth-utils.ts            # Auth helpers
│   ├── db.ts                    # Prisma client singleton
│   ├── polar.ts                 # Polar.sh client
│   ├── utils.ts                 # Utility functions (cn)
│   ├── excryption.ts            # Encryption utilities
│   └── codegen/                 # Component registry for code gen
│
├── trpc/                         # tRPC configuration
│   ├── client.tsx               # React Query provider
│   ├── init.ts                  # tRPC initialization with procedures
│   ├── query-client.ts          # Query client config
│   ├── server.tsx               # Server-side caller
│   └── routers/                 # API routers
│       └── _app.ts              # Main router aggregation
│
├── inngest/                      # Workflow engine
│   ├── client.ts                # Inngest client with realtime
│   ├── functions.ts             # Workflow execution function
│   ├── utils.ts                 # Topological sort utilities
│   └── channels/                # Real-time pub/sub channels
│       ├── deepseek.ts
│       ├── discord.ts
│       ├── gemeni.ts
│       ├── google-form-trigger.ts
│       ├── http-request.ts
│       ├── manual-trigger.ts
│       ├── mistral.ts
│       ├── ollama.ts
│       ├── slack.ts
│       └── stripe-trigger.ts
│
├── config/                       # Configuration files
│   ├── constants.ts             # Pagination, etc.
│   ├── node-components.ts       # Workflow node definitions
│   ├── web-components.ts        # Web component definitions
│   └── bot-components.ts        # Bot component definitions
│
├── hooks/                        # Shared React hooks
├── types/                        # Global TypeScript types
└── generated/prisma/            # Generated Prisma client
```

## Key Configuration Files

### package.json Scripts

```bash
npm run dev          # Start Next.js development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run Biome linter
npm run format       # Format code with Biome
npm run inngest:dev  # Start Inngest dev server
npm run dev:all      # Run Next.js + Inngest + Prisma Studio via mprocs
```

### Environment Variables (.env)

```
# Database
DATABASE_URL                # PostgreSQL connection string

# Better Auth
BETTER_AUTH_SECRET          # Auth encryption key
BETTER_AUTH_URL            # Auth base URL

# OAuth Providers
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET

# AI API Keys
GOOGLE_GENERATIVE_AI_API_KEY
DEEPSEEK_API_KEY
MISTRAL_API_KEY
OLLAMA_API_KEY

# Payments
POLAR_ACCESS_TOKEN         # Polar.sh API token
POLAR_SUCCESS_URL          # Checkout success redirect

# App
NEXT_PUBLIC_APP_URL        # Public app URL
NGROK_URL                  # Ngrok tunnel URL for webhooks

# Security
ENCRYPTION_KEY             # Credential encryption (AES)
SENTRY_AUTH_TOKEN          # Error tracking
```

### Prisma Configuration (prisma/schema.prisma)

- **Schema**: `prisma/schema.prisma`
- **Migrations**: `prisma/migrations/`
- **Generated client**: `src/generated/prisma/`
- **Adapter**: `@prisma/adapter-pg` for PostgreSQL

### Biome Configuration (biome.json)

- **Linting**: Enabled with recommended rules
- **Formatter**: 2-space indentation, single quotes
- **Import organization**: Enabled via assist actions
- **Domains**: Next.js and React recommended rules
- **Ignored paths**: node_modules, .next, dist, build

### shadcn/ui Configuration (components.json)

- **Style**: New York
- **RSC**: Enabled
- **Base color**: Neutral
- **CSS Variables**: Enabled
- **Registries**: Aceternity, Magic UI, Kokonut UI

## Database Schema

### Core Models

| Model | Description |
|-------|-------------|
| **User** | User accounts with OAuth (GitHub, Google) |
| **Session** | Auth sessions via Better Auth |
| **Account** | OAuth account connections |
| **Credential** | Encrypted API keys for AI services |
| **Project** | Unified web/bot projects with platform type |
| **Workflow** | Automation workflows with nodes and connections |
| **Node** | Workflow nodes (triggers, AI, integrations) |
| **Connection** | Node connections for workflow graph |
| **Execution** | Workflow run history with status |
| **Page** | Visual builder pages |
| **ComponentNode** | UI component tree (hierarchical) |
| **DesignSystem** | Design tokens (colors, spacing, typography, effects) |
| **Interaction** | Component interactions (onClick, onSubmit, etc.) |
| **CodeArtifact** | Generated code files |

### Key Enums

- **Platform**: `WEB`, `TELEGRAM_BOT`, `MOBILE_APP`
- **NodeType**: `INITIAL`, `MANUAL_TRIGGER`, `HTTP_REQUEST`, `GOOGLE_FORM_TRIGGER`, `STRIPE_TRIGGER`, `ANTHROPIC`, `GEMINI`, `DEEPSEEK`, `MISTRAL`, `OLLAMA`, `OPENAI`, `DISCORD`, `SLACK`
- **CredentialType**: `OPENAI`, `ANTHROPIC`, `GEMINI`, `DEEPSEEK`, `MISTRAL`, `OLLAMA`
- **ExecutionStatus**: `RUNNING`, `SUCCESS`, `FAILED`
- **InteractionType**: `NAVIGATE`, `OPEN_MODAL`, `CLOSE_MODAL`, `SCROLL_TO`, `SHOW_FORM`, `HIDE_FORM`, `SET_STATE`, `TOGGLE_VISIBILITY`, `TRIGGER_WORKFLOW`, `SEND_MESSAGE`, `EDIT_MESSAGE`, `SHOW_KEYBOARD`, `HIDE_KEYBOARD`
- **ArtifactType**: `NEXTJS_PAGE`, `NEXTJS_LAYOUT`, `NEXTJS_COMPONENT`, `REACT_COMPONENT`, `CSS_STYLESHEET`, `TAILWIND_CONFIG`, `NESTJS_HANDLER`, `NESTJS_MODULE`, `NESTJS_SERVICE`, `PACKAGE_JSON`, `DOCKERFILE`

## API Architecture (tRPC)

### Router Structure

```typescript
appRouter
├── workflows      # Workflow CRUD + execution triggers
├── credentials    # API credential management (encrypted)
├── executions     # Execution history and node executors
├── designSystem   # Design token management
├── projects       # Project CRUD + config
└── builder        # Visual builder (pages, components, interactions)
```

### Procedures

| Procedure | Description |
|-----------|-------------|
| `baseProcedure` | No authentication required |
| `protectedProcedure` | Requires valid session via Better Auth |
| `premiumProcedure` | Requires active Polar.sh subscription |

### Context

- Session validation via `auth.api.getSession()`
- Polar.sh customer state checking for premium features

## Workflow Execution (Inngest)

### Execution Flow

1. Client sends `workflows/execute.workflow` event with `workflowId`
2. Inngest triggers `executeWorkflow` function
3. Nodes are sorted topologically using `toposort`
4. Each node executes via registry lookup (`getExecutor`)
5. Context passes between nodes (accumulating results)
6. Execution status updated in database

### Real-time Channels

Inngest realtime middleware provides pub/sub for:
- Manual triggers
- HTTP requests
- Google Form triggers
- Stripe triggers
- AI providers (Gemini, DeepSeek, Mistral, Ollama)
- Integrations (Discord, Slack)

### Node Executors

| Node Type | Executor Location |
|-----------|-------------------|
| Triggers | `src/fetures/triggers/components/{trigger}/executor.ts` |
| AI | `src/features/executions/components/{ai}/executor.ts` |
| Integrations | `src/features/executions/components/{service}/executor.ts` |

### Retry Policy

- Production: 2 retries
- Development: 0 retries
- On failure: Execution status set to FAILED with error details

## Code Style Guidelines

### File Organization

- Use path aliases: `@/components`, `@/lib`, `@/features`
- No relative imports crossing feature boundaries
- Each feature exports public API via `index.ts`

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `Button.tsx`, `WorkflowNode.tsx` |
| Hooks | camelCase with `use` prefix | `useWorkflows.ts`, `useCanvas.ts` |
| Utils | camelCase | `formatDate.ts`, `cn.ts` |
| Types | PascalCase | `ApiResponse.ts`, `NodeData.ts` |
| Features | kebab-case | `design-system`, `executions` |

### Component Patterns

- **Server Components** by default (Next.js App Router)
- **Client Components** marked with `'use client'` directive
- UI components in `src/components/ui/`
- Feature components in `src/features/{feature}/components/`
- React Flow nodes in `src/components/react-flow/`

### Code Quality

```bash
# Before committing
npm run lint          # Check for issues
npm run format        # Auto-format code
```

- Biome handles unused imports automatically (`noUnusedImports: error`)
- Organize imports on save/format
- 2-space indentation
- Single quotes for JavaScript/TypeScript

## Development Commands

### Start Development

```bash
# Terminal 1 - Next.js dev server
npm run dev

# Terminal 2 - Inngest dev server
npm run inngest:dev

# Or run all via mprocs (includes Prisma Studio)
npm run dev:all
```

### Database Operations

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Create and apply migration
npx prisma migrate dev

# Open Prisma Studio
npx prisma studio

# Reset database (caution: destroys data)
npx prisma migrate reset
```

### Build for Production

```bash
npm run build
npm run start
```

## Security Considerations

### Authentication

- Better Auth with session-based authentication
- OAuth providers: GitHub, Google
- Email/password authentication enabled
- Protected routes via `protectedProcedure`
- Auth checks in server components via `auth.api.getSession()`

### Credential Storage

- API keys encrypted with AES (Cryptr library)
- Encryption key in `ENCRYPTION_KEY` environment variable
- Credentials never logged or exposed in client code
- Row-level ownership via `userId` relations

### Authorization

- Row-level ownership checks in all database queries
- User ID filtering on all data access
- Premium features gated via `premiumProcedure` with Polar.sh integration

### Environment Security

- Never commit `.env` file
- Use different encryption keys for production
- Rotate API keys regularly

## Common Tasks

### Adding a New Workflow Node

1. Add node type to `NodeType` enum in `prisma/schema.prisma`
2. Create executor in `src/features/executions/components/{name}/executor.ts`
3. Register executor in `src/features/executions/lib/executor-registry.ts`
4. Create UI components (node card, config dialog)
5. Add channel in `src/inngest/channels/{name}.ts`
6. Run `npx prisma migrate dev`

### Adding a New UI Component

1. Use shadcn CLI: `npx shadcn add {component}`
2. Or create manually in `src/components/ui/`
3. Export from `src/components/ui/index.ts` if needed
4. Use in features via `@/components/ui/{component}`

### Adding a New Feature Module

1. Create directory in `src/features/{feature}/`
2. Create subdirectories: `components/`, `hooks/`, `server/`
3. Create TRPC router in `server/router.ts`
4. Export public API in `index.ts`
5. Register router in `src/trpc/routers/_app.ts`

### Adding a New tRPC Procedure

1. Define procedure in feature's `server/router.ts`
2. Use appropriate base procedure (`baseProcedure`, `protectedProcedure`, `premiumProcedure`)
3. Export router and add to `src/trpc/routers/_app.ts`
4. Use React Query hooks in components via `api.{router}.{procedure}.useQuery()`

## Testing

The project currently does not have automated tests configured. When adding tests:

- Place test files next to source files: `component.test.ts`
- Or use `__tests__/` directories within features
- Recommended: Vitest for unit tests, Playwright for E2E

## Deployment

The application is designed for deployment on:

- **Vercel** - Next.js frontend
- **Neon** or **AWS RDS** - PostgreSQL database
- **Inngest Cloud** - Workflow execution engine
- **Polar.sh** - Payment processing

### Build Output

- Next.js build output: `.next/` directory
- Static assets: `public/` directory

### Environment Setup for Production

1. Set `NODE_ENV=production`
2. Configure `DATABASE_URL` for production database
3. Set `BETTER_AUTH_URL` to production domain
4. Configure OAuth callback URLs
5. Set `ENCRYPTION_KEY` (generate new key)
6. Configure `POLAR_ACCESS_TOKEN` for production
7. Set `NEXT_PUBLIC_APP_URL` to production URL

## Troubleshooting

### Common Issues

**Prisma Client Not Found**
```bash
npx prisma generate
```

**Database Connection Issues**
- Check `DATABASE_URL` format
- Ensure PostgreSQL is running
- Verify SSL settings for cloud providers

**Inngest Events Not Processing**
- Ensure Inngest dev server is running: `npm run inngest:dev`
- Check event ID matches in database
- Verify `inngestEventId` is unique

**TypeScript Errors After Schema Change**
```bash
npx prisma generate
# Restart TypeScript server in IDE
```
