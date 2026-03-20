# Server-Side Card Filtering Plan (Web Frontend)

This document describes the plan for updating the web frontend to use the new `GET /columns/:id/cards` API endpoint for server-side filtering, replacing the current client-side filtering logic.

---

## Background

Currently, the `Column` component (`src/screens/Board/Column/Column.js`) fetches **all** cards for a board via `useCards(board)` and filters them client-side using `checkConditions()`. The API now supports `GET /columns/:id/cards`, which returns only the cards matching a column's `card-inclusion-conditions`. See `api/docs/server-side-filtering-plan.md` for the API spec.

---

## Overview of Changes

The core change is small: instead of each `Column` component reading from a shared board-level card cache and filtering locally, each `Column` will fetch its own pre-filtered cards from `GET /columns/:id/cards`. Sorting, grouping, and summary calculation remain client-side (the API does not handle these).

---

## Files to Modify

| File | Change |
|---|---|
| `src/data/cards.js` | Add `useColumnCards(column)` hook that fetches `GET /columns/:id/cards` |
| `src/screens/Board/Column/Column.js` | Replace `useCards(board)` + `checkConditions` with `useColumnCards(column)` |
| `src/screens/Board/Board.js` | Remove `useCards` import if no longer needed at board level (see analysis below) |
| `src/screens/Board/Column/ColumnList.js` | Remove `useCards` import if no longer needed (see analysis below) |

### Files That May Be Deletable Later (Not in This Change)

| File | Reason |
|---|---|
| `src/utils/checkConditions.js` | No longer called from Column; still used by `src/components/Field.js` for show-conditions |
| `src/logic/queries.js` | Same — still used by show-conditions |

**Important:** `checkConditions` is also used for element `show-conditions` (controlling field visibility on the card edit screen), so it **cannot** be deleted. The client-side filtering code stays; it just stops being used for column card filtering.

---

## Detailed Changes

### 1. New Data Hook: `useColumnCards(column)`

**File:** `src/data/cards.js`

Add a new hook that fetches cards for a specific column:

```js
export function useColumnCards(column) {
  const cardClient = useCardClient();

  return useQuery({
    queryKey: ['columnCards', column?.id],
    queryFn: () => cardClient.related({parent: column}).then(resp => resp.data),
    enabled: !!column,
  });
}
```

Key design decisions:
- Uses `useCardClient()` and `ResourceClient.related({parent: column})`, which constructs `GET /columns/:id/cards` — the same pattern already used by `useCards(board)` to fetch `GET /boards/:id/cards`.
- Query key is `['columnCards', column.id]` — separate from the board-level `['cards', boardId]` cache, so board-level card operations don't interfere.

### 2. Update `Column` Component

**File:** `src/screens/Board/Column/Column.js`

Before:
```js
import {useCards} from '../../../data/cards';
import checkConditions from '../../../utils/checkConditions';
// ...
const {data: cards = []} = useCards(board);
const filteredCards = cards.filter(card =>
  checkConditions({
    fieldValues: card.attributes['field-values'],
    conditions: cardInclusionConditions,
    elements,
  }),
);
```

After:
```js
import {useColumnCards} from '../../../data/cards';
// ...
const {data: filteredCards = []} = useColumnCards(column);
```

This removes:
- The `useCards` import
- The `checkConditions` import
- The `'card-inclusion-conditions'` destructuring from column attributes (no longer needed here)
- The entire `cards.filter(...)` block

Everything downstream (sorting, grouping, summary) continues to operate on `filteredCards` unchanged.

### 3. Keep Board-Level Card Fetching for Card Creation

**File:** `src/screens/Board/Board.js`

`Board.js` uses `useCards(board)` for:
- Loading state tracking (`isFetchingCards`)
- `useRefreshCards` for refreshing after navigation
- `useCreateCard` for the "Add Card" button

These remain necessary. When a card is created or edited, we need to invalidate the column-level caches so columns re-fetch their filtered cards.

### 4. Cache Invalidation Strategy

When a card is created, updated, or deleted, the column-level caches must be invalidated so each column re-fetches its filtered results.

**Approach:** Invalidate all `columnCards` queries when any card mutation succeeds.

In `src/data/cards.js`, update the mutation hooks:

```js
const refreshAllColumnCards = queryClient =>
  queryClient.invalidateQueries({queryKey: ['columnCards']});

// In useCreateCard, useUpdateCard, useDeleteCard onSuccess callbacks:
// Add: refreshAllColumnCards(queryClient);
```

Invalidating `{queryKey: ['columnCards']}` (prefix match) will invalidate all `['columnCards', *]` queries, causing every visible column to re-fetch. This is simple and correct — individual column invalidation would require knowing which columns a card belongs to, which is the server's job.

**Note on React Query v5 API:** The canonical `invalidateQueries` signature in v5 is `invalidateQueries({ queryKey: [...] })`. The existing codebase uses the array shorthand (`invalidateQueries(['cards', board.id])`), which still works due to backward compatibility shims but is not the v5 idiomatic form. The new `refreshAllColumnCards` helper above uses the v5 object form. When adding calls to the existing mutation hooks, either form will work, but prefer consistency with whichever style is adopted. Consider updating the existing `refreshCards` and `refreshCard` helpers to the object form as a follow-up.

**Special case — `useUpdateCard`:** The current `onSuccess` callback only calls `refreshCards` when `!mountedRef.current`. The `refreshAllColumnCards` call should be added **unconditionally** (outside the `if` block), because column card caches always need invalidating after a card update regardless of whether the card form is still mounted:

```js
onSuccess: () => {
  refreshCard(queryClient, board, card);
  refreshAllColumnCards(queryClient); // always invalidate column caches

  if (!mountedRef.current) {
    refreshCards(queryClient, board);
  }
},
```

### 5. Board.js and ColumnList.js Cleanup

**`Board.js`:** Keep `useCards(board)` — it is still used for `isFetchingCards` (contributes to the navigation bar spinner), `useRefreshCards`, `useCreateCard`, and `usePrimeCard`. It also provides `cardsError` and `refetchCards` for the error snackbar and retry logic. No changes needed.

**`ColumnList.js`:** Currently uses `useCards(board)` for both `isLoadingCards` (drives the full-screen `LoadingIndicator` on first load, via the `isLoading` calculation on line 50–52) and `isFetchingCards` (drives the small reload indicator). Both are included in the `isLoading` guard that gates all column rendering. If we remove `useCards` here, the board would render columns before cards are available and each column would show its own loading state. For now, keep `useCards` in `ColumnList.js` so the existing unified first-load experience is preserved. This is a separate UX decision that can be revisited once the core change is working.

### 6. Refresh on Navigation

`Board.js` calls `refreshCards()` (via `useRefreshCards`) when navigating back to the board. This invalidates `['cards', boardId]`. We should also invalidate column cards at this point:

```js
export function useRefreshColumnCards() {
  const queryClient = useQueryClient();
  return useCallback(
    () => queryClient.invalidateQueries({queryKey: ['columnCards']}),
    [queryClient],
  );
}
```

Call this alongside `refreshCards()` in `Board.js`'s `useNavigateEffect`. Unlike `useRefreshCards`, this hook takes no parameter because column card invalidation is not scoped to a board — all visible column caches should be refreshed together.

---

## What Does NOT Change

- **Column configuration UI** (`EditColumnForm.js`, `ConditionsInputs.js`): Still saves `card-inclusion-conditions` to the column via `PATCH /columns/:id`. No change needed.
- **Sorting logic**: Remains client-side in `Column.js`.
- **Grouping logic**: Remains client-side in `groupCards.js`.
- **Summary calculation**: Remains client-side in `calculateSummary.js`.
- **Card edit screen**: Still fetches individual cards via `useCard({boardId, cardId})`.
- **Show-conditions** (element visibility): Still uses `checkConditions` client-side.
- **`queries.js` / `checkConditions.js`**: Remain in codebase for show-conditions.

---

## Test Plan

### Unit Tests (Jest)

**New test file:** `src/data/cards.spec.js`

No existing spec files live in `src/data/`, so this would be a new file co-located with `cards.js` following the `*.spec.js` convention used throughout the project. Do not create `src/data/useColumnCards.spec.js` — spec files in this codebase are named after the module they test, not the individual export.

Test the `useColumnCards` hook in isolation using `renderHook` from `@testing-library/react` (the `@testing-library/react-hooks` package is not used in this codebase; `renderHook` is provided directly by `@testing-library/react` since v13):

| Scenario | Expected |
|---|---|
| `column` is null/undefined | Query is disabled, no fetch |
| `column` is provided | Fetches `GET /columns/:id/cards`, returns card array |
| Query key includes column ID | Different columns have separate caches |

**Existing test updates:**

- `src/utils/checkConditions.spec.js` — No changes needed. These tests remain valid for show-conditions.
- `src/logic/queries.spec.js` — No changes needed.

### Cypress E2E Tests

#### Update: `cypress/e2e/display-cards.cy.js`

Currently intercepts `GET /boards/:id/cards` and relies on client-side filtering. Update to:

1. Keep the `GET /boards/:id/cards` intercept (Board.js still fetches board-level cards).
2. Add intercepts for `GET /columns/:id/cards` that return pre-filtered results:

```js
cy.intercept('GET', `http://cypressapi/columns/${releasedColumn.id}/cards?`, {
  data: [releasedCard],
});
cy.intercept('GET', `http://cypressapi/columns/${unreleasedColumn.id}/cards?`, {
  data: [unreleasedCard],
});
```

3. The existing assertions (`cy.get('[data-testid=column-...]').contains(...)`) remain unchanged — they verify the same visual outcome.

#### Update: `cypress/e2e/edit-columns.cy.js`

The "allows editing column filtering" and "allows filtering a column by a specific value" tests need similar updates:

1. Add `GET /columns/:id/cards` intercepts that return the expected filtered results after column save.
2. The test flow (set filter → save → verify cards) remains the same, but the data source changes from client-side filter of mocked board cards to server-returned column cards.

For the filtering test, after the column is saved and columns are re-fetched:
```js
// After save, the column re-fetches its cards from the server
cy.intercept('GET', `http://cypressapi/columns/${allColumn.id}/cards?`, {
  data: [unplayedCard1, unplayedCard2],  // server returns only matching cards
});
```

#### Other Cypress tests that set up cards

Any test that navigates to a board and renders columns will need a `GET /columns/:id/cards` intercept per column. The full list of affected files (confirmed by reading each test):

- `display-cards.cy.js` — intercepts `GET .../cards?`, renders two columns with filtered cards
- `edit-columns.cy.js` — all tests except `allows creating columns` use `setUpInitialData()` which includes `GET .../cards?` and renders `allColumn`; every test in this file that navigates to the board needs a `GET /columns/${allColumn.id}/cards?` intercept. Tests that re-intercept the columns list (sort, grouping, filtering, ordering, summary) may also need to re-intercept the column cards endpoint after each column save, since the column's query key changes when the column data changes.
- `edit-card.cy.js` — intercepts `GET .../cards?` and displays cards in two columns; needs per-column intercepts
- `field-data-types.cy.js` — intercepts `GET .../cards?` and displays one card in `allColumn`; needs a column cards intercept
- `buttons.cy.js` — intercepts `GET .../cards?` and displays cards across two columns; needs per-column intercepts
- `edit-fields.cy.js`, `edit-boards.cy.js`, `edit-buttons.cy.js` — audit each to determine if they navigate to a board and display cards in columns

The `setUpInitialData()` helper in `edit-columns.cy.js` is a good candidate to receive a column cards intercept as part of its setup, so it does not need to be added to every individual test step.

### Playwright MCP Manual Testing

Use the Playwright MCP browser tools to manually verify the feature end-to-end against the real API:

#### Setup
1. Start the API server: `cd api && bin/serve`
2. Start the web dev server: `cd web && pnpm start`
3. Navigate to `http://localhost:8080` in the Playwright browser

#### Test Steps

1. **Sign in** with test credentials
2. **Navigate to a board** that has columns with card-inclusion-conditions configured
3. **Verify filtered cards display correctly:**
   - Open browser Network tab (via `browser_network_requests`) to confirm `GET /columns/:id/cards` requests are being made (not just `GET /boards/:id/cards`)
   - Verify each column shows only the cards matching its conditions
4. **Create a new card:**
   - Click "Add Card", fill in fields, save
   - Verify the new card appears in the correct column(s) based on conditions
   - Verify it does NOT appear in columns whose conditions it doesn't match
5. **Edit a card to change which column it belongs to:**
   - Edit a card's field value so it no longer matches a column's condition
   - Navigate back to the board
   - Verify the card moved to the correct column(s)
6. **Edit column conditions:**
   - Edit a column's card-inclusion-conditions
   - Save
   - Verify the column now shows different cards matching the new conditions
7. **Delete a card:**
   - Delete a card from the card edit screen
   - Verify it disappears from its column
8. **Verify empty state:**
   - Create a column with conditions that no cards match
   - Verify it shows "(no cards)"

#### Specific Things to Watch For
- **No stale data**: After card mutations, columns should show updated results (cache invalidation works)
- **No duplicate requests**: Each column should make exactly one `GET /columns/:id/cards` request on load
- **Loading states**: Columns should show loading indicators while fetching, not flash empty/stale data
- **Column with no conditions**: Should return all board cards (same as before)

---

## Migration Notes

### Backward Compatibility

The frontend change is purely a data-fetching change. If the API endpoint is unavailable (e.g., deployed frontend against an older API), columns will show errors. There is no graceful fallback — the API and frontend should be deployed together.

### Performance Considerations

- **More HTTP requests**: Instead of 1 `GET /boards/:id/cards`, we now make N requests (one per column). For boards with many columns, this adds latency. However, the requests happen in parallel (React Query fires them concurrently), and each response is smaller (filtered cards only).
- **Reduced client-side work**: No more iterating all cards × all conditions × all columns in JavaScript.
- **Cache size**: Column-level caches store filtered subsets, so total memory use is similar (some cards appear in multiple columns).

### Side-by-Side Comparison

Deploy the `server-side-filtering` branch to Netlify as a preview site to compare against the current production GitHub Pages deployment. Both will hit the same API (`https://api.riverbed.app`), so the only difference is client-side vs server-side filtering. Use browser DevTools Network tab to verify `GET /columns/:id/cards` requests (new) vs `GET /boards/:id/cards` (old).

### Rollout

1. Deploy the API with `GET /columns/:id/cards` endpoint (already done, commit `8e5629c`)
2. Deploy the frontend with the changes described here
3. No database migration needed
4. No feature flag needed — the change is transparent to users
