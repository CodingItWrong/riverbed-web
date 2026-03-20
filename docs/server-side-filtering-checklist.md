# Server-Side Filtering Implementation Checklist

## Code Changes

### `src/data/cards.js`
- [x] Add `useColumnCards(column)` hook using `useCardClient()` and `ResourceClient.related({parent: column})`
- [x] Add `useRefreshColumnCards()` hook that invalidates `{queryKey: ['columnCards']}`
- [x] Add `refreshAllColumnCards` helper that calls `queryClient.invalidateQueries({queryKey: ['columnCards']})`
- [x] Call `refreshAllColumnCards(queryClient)` in `useCreateCard` `onSuccess`
- [x] Call `refreshAllColumnCards(queryClient)` unconditionally in `useUpdateCard` `onSuccess` (outside the `if (!mountedRef.current)` block)
- [x] Call `refreshAllColumnCards(queryClient)` in `useDeleteCard` `onSuccess`

### `src/screens/Board/Column/Column.js`
- [x] Replace `useCards` import with `useColumnCards` from `../../../data/cards`
- [x] Remove `checkConditions` import
- [x] Remove `'card-inclusion-conditions'` destructuring from column attributes
- [x] Replace `useCards(board)` + `cards.filter(...)` block with `useColumnCards(column)`
- [x] Verify downstream code (sorting, grouping, summary) still receives `filteredCards` unchanged

### `src/screens/Board/Board.js`
- [x] Import and call `useRefreshColumnCards()` alongside `useRefreshCards()` in `useNavigateEffect`

## Tests

### Unit Tests
- [x] Create `src/data/cards.spec.js`
  - [x] Test: `column` is null/undefined → query disabled, no fetch
  - [x] Test: `column` provided → fetches `GET /columns/:id/cards`, returns card array
  - [x] Test: different columns have separate query keys / caches

### Cypress E2E Tests

#### `cypress/e2e/display-cards.cy.js`
- [x] Add `GET /columns/:id/cards` intercepts per column (returning pre-filtered card arrays)
- [x] Keep existing `GET /boards/:id/cards` intercept (Board.js still needs it)
- [x] Verify existing column assertions still pass

#### `cypress/e2e/edit-columns.cy.js`
- [x] Add `GET /columns/:id/cards` intercept to `setUpInitialData()` helper for `allColumn`
- [x] Update "allows editing column filtering" test: add column cards intercept after save
- [x] Update "allows filtering a column by a specific value" test: add column cards intercept returning only matching cards after save
- [x] Audit all other tests in file that navigate to the board and add intercepts as needed

#### `cypress/e2e/edit-card.cy.js`
- [x] Add `GET /columns/:id/cards` intercepts per column

#### `cypress/e2e/field-data-types.cy.js`
- [x] Add `GET /columns/:id/cards` intercept for `allColumn`

#### `cypress/e2e/buttons.cy.js`
- [x] Add `GET /columns/:id/cards` intercepts per column

#### `cypress/e2e/edit-fields.cy.js`
- [x] Audit: determine if board is navigated to and cards displayed; add intercepts if needed

#### `cypress/e2e/edit-boards.cy.js`
- [x] Audit: determine if board is navigated to and cards displayed; add intercepts if needed

#### `cypress/e2e/edit-buttons.cy.js`
- [x] Audit: determine if board is navigated to and cards displayed; add intercepts if needed

## Manual Verification (Playwright)

- [x] Start API server and web dev server
- [x] Navigate to a board with column conditions; confirm `GET /columns/:id/cards` requests in network tab
- [x] Verify each column shows only cards matching its conditions
- [x] Create a card → verify it appears in correct column(s) and not in others
- [x] Edit a card to change which column it belongs to → navigate back and verify placement
- [x] Edit column conditions → save → verify column shows updated cards
- [x] Delete a card → verify it disappears from its column
- [x] Verify a column with no matching cards shows empty state
- [x] Confirm no stale data after mutations (cache invalidation works)
- [x] Confirm no duplicate `GET /columns/:id/cards` requests per column on load
