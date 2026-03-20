# Server-Side Filtering Implementation Checklist

## Code Changes

### `src/data/cards.js`
- [ ] Add `useColumnCards(column)` hook using `useCardClient()` and `ResourceClient.related({parent: column})`
- [ ] Add `useRefreshColumnCards()` hook that invalidates `{queryKey: ['columnCards']}`
- [ ] Add `refreshAllColumnCards` helper that calls `queryClient.invalidateQueries({queryKey: ['columnCards']})`
- [ ] Call `refreshAllColumnCards(queryClient)` in `useCreateCard` `onSuccess`
- [ ] Call `refreshAllColumnCards(queryClient)` unconditionally in `useUpdateCard` `onSuccess` (outside the `if (!mountedRef.current)` block)
- [ ] Call `refreshAllColumnCards(queryClient)` in `useDeleteCard` `onSuccess`

### `src/screens/Board/Column/Column.js`
- [ ] Replace `useCards` import with `useColumnCards` from `../../../data/cards`
- [ ] Remove `checkConditions` import
- [ ] Remove `'card-inclusion-conditions'` destructuring from column attributes
- [ ] Replace `useCards(board)` + `cards.filter(...)` block with `useColumnCards(column)`
- [ ] Verify downstream code (sorting, grouping, summary) still receives `filteredCards` unchanged

### `src/screens/Board/Board.js`
- [ ] Import and call `useRefreshColumnCards()` alongside `useRefreshCards()` in `useNavigateEffect`

## Tests

### Unit Tests
- [ ] Create `src/data/cards.spec.js`
  - [ ] Test: `column` is null/undefined → query disabled, no fetch
  - [ ] Test: `column` provided → fetches `GET /columns/:id/cards`, returns card array
  - [ ] Test: different columns have separate query keys / caches

### Cypress E2E Tests

#### `cypress/e2e/display-cards.cy.js`
- [ ] Add `GET /columns/:id/cards` intercepts per column (returning pre-filtered card arrays)
- [ ] Keep existing `GET /boards/:id/cards` intercept (Board.js still needs it)
- [ ] Verify existing column assertions still pass

#### `cypress/e2e/edit-columns.cy.js`
- [ ] Add `GET /columns/:id/cards` intercept to `setUpInitialData()` helper for `allColumn`
- [ ] Update "allows editing column filtering" test: add column cards intercept after save
- [ ] Update "allows filtering a column by a specific value" test: add column cards intercept returning only matching cards after save
- [ ] Audit all other tests in file that navigate to the board and add intercepts as needed

#### `cypress/e2e/edit-card.cy.js`
- [ ] Add `GET /columns/:id/cards` intercepts per column

#### `cypress/e2e/field-data-types.cy.js`
- [ ] Add `GET /columns/:id/cards` intercept for `allColumn`

#### `cypress/e2e/buttons.cy.js`
- [ ] Add `GET /columns/:id/cards` intercepts per column

#### `cypress/e2e/edit-fields.cy.js`
- [ ] Audit: determine if board is navigated to and cards displayed; add intercepts if needed

#### `cypress/e2e/edit-boards.cy.js`
- [ ] Audit: determine if board is navigated to and cards displayed; add intercepts if needed

#### `cypress/e2e/edit-buttons.cy.js`
- [ ] Audit: determine if board is navigated to and cards displayed; add intercepts if needed

## Manual Verification (Playwright)

- [ ] Start API server and web dev server
- [ ] Navigate to a board with column conditions; confirm `GET /columns/:id/cards` requests in network tab
- [ ] Verify each column shows only cards matching its conditions
- [ ] Create a card → verify it appears in correct column(s) and not in others
- [ ] Edit a card to change which column it belongs to → navigate back and verify placement
- [ ] Edit column conditions → save → verify column shows updated cards
- [ ] Delete a card → verify it disappears from its column
- [ ] Verify a column with no matching cards shows empty state
- [ ] Confirm no stale data after mutations (cache invalidation works)
- [ ] Confirm no duplicate `GET /columns/:id/cards` requests per column on load
