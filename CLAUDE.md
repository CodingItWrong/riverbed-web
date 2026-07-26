# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm start          # Dev server at localhost:8080
pnpm test           # Jest in watch mode
pnpm test:ci        # Jest (single run, for CI)
pnpm cypress        # Open Cypress UI for e2e tests
pnpm cypress:run    # Run Cypress headlessly
pnpm lint           # oxlint (fails on warnings)
pnpm format:check   # Check formatting with oxfmt
pnpm format         # Auto-format with oxfmt
pnpm build          # Production build to dist/
```

To run a single Jest test file: `pnpm test:ci -- path/to/file.spec.js`

## Architecture

Riverbed Web is a React client for Riverbed, a no-code app-building platform for creating CRUD applications. Users configure boards (kanban-style), columns, cards, and elements through a UI-driven configuration system.

**Key libraries:**
- **React Router v7** — `src/Navigation.js` defines all routes
- **TanStack React Query v5** — all server state management; data hooks live in `src/data/`
- **MUI v6** — UI components and theming (`src/theme/`)
- **@codingitwrong/jsonapi-client** — JSON:API spec compliance for all API calls
- **react-native-web** — aliased to `react-native` via webpack for cross-platform compatibility

**Route structure** (from `src/Navigation.js`):
- `/` → SignIn (child: `/sign-up`)
- `/boards` → BoardList (child: `/settings`)
- `/boards/:boardId` → Board (children: `/cards/:cardId`, `/columns/:columnId`, `/edit`)
- `/boards/:boardId/cards/:cardId` → Card (child: `/elements/:elementId`)

Card and Column routes render as modals on top of the Board screen (`BaseModalScreen.js`).

**Data layer** (`src/data/`): Each resource (boards, cards, columns, elements, user) has a file exporting React Query hooks. `httpClient.js` wraps the JSON:API client with auth token injection from `src/data/token.js`.

**Field types** (`src/components/fieldTypes/`): Pluggable renderers for text, choice, date, dateTime, number, and geolocation field types. Date/dateTime components are lazy-loaded.

## Testing

**Unit tests (Jest):** Co-located as `*.spec.js` files in `src/`. Primarily cover `src/utils/` and business logic. Uses `@testing-library/react` and jsdom.

**E2E tests (Cypress):** In `cypress/e2e/`. Tests mock API responses using `cy.intercept()`. The dev server must be running on port 8080. `cypress/support/Factory.js` provides test data factories; `cypress/support/commands.js` provides `cy.signIn()` and other custom commands.

**Manual testing against a local backend:** the API runs on port 3000 and the dev server on 8080. Sign in with `example@example.com` / `password` — a local dev seed account only, never valid anywhere else.

## Environment

Copy `.env.sample` to `.env.local` and fill in `RIVERBED_GOOGLE_MAPS_API_KEY` for Google Maps support. Production builds require `.env.production` with the same key.

Node version: 24.x (see `.nvmrc`)

## Security Rules

Reference these when writing or reviewing security-sensitive code:

@rules/general/general-security.mdc — Apply to all code changes.
@rules/frontend-specific/react.mdc — Apply when writing or reviewing React components, hooks, or JSX.
@rules/frontend-specific/api-network.mdc — Apply when making API calls, handling responses, or configuring the HTTP client.
@rules/frontend-specific/auth-sessions.mdc — Apply when working with authentication, tokens, sign-in/sign-up, or session state.
@rules/frontend-specific/xss.mdc — Apply when rendering user-supplied content or using dangerouslySetInnerHTML.
@rules/frontend-specific/sensitive-data.mdc — Apply when handling passwords, tokens, PII, or any data stored client-side.
@rules/frontend-specific/csp-headers.mdc — Apply when modifying HTML templates, webpack config, or server response headers.
@rules/frontend-specific/dependencies.mdc — Apply when adding, removing, or upgrading packages.
@rules/frontend-specific/open-redirect.mdc — Apply when writing navigation logic or handling redirect URLs.

## Code Style

- Single quotes, no semicolons beyond what oxfmt enforces, trailing commas, no arrow-function parens
- Formatting is handled by **oxfmt** (`.oxfmtrc.json`); linting by **oxlint** (`.oxlintrc.json`)
- oxfmt sorts imports (`sortImports`); oxlint dedupes them (`no-duplicate-imports`)
- `eslint-plugin-cypress` runs through oxlint's ESLint-compat layer (`jsPlugins`); all other rules are oxlint built-ins
- No PropTypes — the project does not use React prop type validation
- Run `pnpm format` before committing; the Husky pre-push hook runs `pnpm lint && pnpm format:check`
