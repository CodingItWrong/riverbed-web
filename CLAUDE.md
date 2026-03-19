# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm start          # Dev server at localhost:8080
pnpm test           # Jest in watch mode
pnpm test:ci        # Jest (single run, for CI)
pnpm cypress        # Open Cypress UI for e2e tests
pnpm cypress:run    # Run Cypress headlessly
pnpm lint           # ESLint + Prettier check
pnpm format         # Auto-format with Prettier
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

## Environment

Copy `.env.sample` to `.env.local` and fill in `RIVERBED_GOOGLE_MAPS_API_KEY` for Google Maps support. Production builds require `.env.production` with the same key.

Node version: 22.x (see `.nvmrc`)

## Code Style

- Single quotes, no semicolons beyond what Prettier enforces, trailing commas, no arrow-function parens
- ESLint enforces alphabetized and deduplicated imports (`eslint-plugin-import`)
- No PropTypes — the project does not use React prop type validation
- Run `pnpm format` before committing (Husky enforces this via pre-commit hook)
