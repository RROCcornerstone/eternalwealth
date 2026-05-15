# Eternal Wealth Framework

A faith-rooted, interactive personal finance web app. Twenty-eight modules. The divine order of wealth — livestock, silver, gold.

## Quick start

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

Without credentials, the app runs in stub mode: signup → onboarding → modules all work, with state in `localStorage` instead of Supabase. Good enough to walk the framework end-to-end and feel the product.

**To go live:** see [`ACTION_REQUIRED.md`](./ACTION_REQUIRED.md) for the 30-minute credential setup.

## Stack

- **Framework:** Next.js 16 (App Router, RSC-first)
- **Language:** TypeScript with strict mode (`noUncheckedIndexedAccess`, `noImplicitOverride`)
- **Styling:** Tailwind v4 + shadcn/ui `new-york` style
- **Forms:** React Hook Form + Zod
- **State:** TanStack Query v5, RSC where possible
- **DB:** Supabase Postgres (full migration in `supabase/migrations/`)
- **Auth:** Supabase Auth (magic-link)
- **AI:** Anthropic Claude API (`claude-sonnet-4-5` for extraction + categorization; `claude-opus-4-7` for analysis)
- **PDF:** `pdf-parse` (text extraction) + `@react-pdf/renderer` (downloadable account-setup sheet)

## Folder structure

```
app/
  (marketing)/      Landing
  (auth)/           Login / signup / verify
  (app)/            Authed shell — onboarding, course, dashboard, etc.
  (legal)/          Privacy / Terms / Disclaimer / Cookies
  api/              Route handlers (auth callback, upload, categorize, legacy)

components/
  ui/               shadcn primitives
  modules/          The 28 module components (m01-welcome.tsx through m28-personal-legacy-plan.tsx)
  shared/           Sidebar, onboarding form, etc.

lib/
  supabase/         Browser / server / middleware clients
  ai/               Anthropic SDK + extraction/categorization prompts
  math/             Pure-function calculators (legacy, debt payoff, giving growth)
  content/          Module registry + stage definitions
  validation/       Zod schemas
  utils.ts          cn(), formatCurrency(), dollarsToCents()

supabase/
  migrations/0001_initial_schema.sql   Full Section 5 schema with RLS

content/modules/    Markdown source (Phase 4 will populate per module)

tests/              vitest + Playwright fixtures (empty in Phase 1)
```

## Environment variables

See [`.env.example`](./.env.example). Minimum to run live:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY` (for M21 + M22 AI categorization)

## Build philosophy

1. The course IS the product. No marketing pages with sign-up forms. The 28 modules ARE what users do.
2. Faith-first framing throughout — but inputs accommodate practicing / exploring / non-religious users.
3. Every input has a purpose; nothing collected for collection's sake.
4. Mobile-first.
5. AI is invisible infrastructure.
6. Educational only — every projection page has a disclaimer.

## What's done

See [`BUILD_LOG.md`](./BUILD_LOG.md) for the full decision log.

- ✅ All 28 modules with real interactives
- ✅ Auth (magic-link), onboarding (10-step), course renderer with save/resume
- ✅ Dashboard with progress tracking
- ✅ Legal pages (privacy, terms, disclaimer, cookies)
- ✅ Math library (legacy projection, debt payoff, giving growth)
- ✅ `pnpm build` passes; 23 routes compile

## What's pending

See [`ACTION_REQUIRED.md`](./ACTION_REQUIRED.md) for the full handoff.

## Disclaimer

Eternal Wealth is educational software, not financial / legal / tax / investment advice. See `/disclaimer` for the full version. Talk to a qualified professional before making material money decisions.
<!-- Deploy timestamp: Fri May 15 19:55:32 UTC 2026 -->
