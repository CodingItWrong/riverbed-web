# MUI upgrade plan

Staged plan for moving the MUI packages forward one major version at a time.
Each stage is its own PR, verified before the next one starts.

## Why one major at a time

Combining majors makes it impossible to attribute a regression to a specific
upgrade. The three MUI packages are also coupled through peer dependencies, so
each stage has to move them as a matching set rather than individually.

## Version landscape

`@mui/material` and `@mui/icons-material` **skip v8 entirely** — they go from 7
straight to 9, to realign Material's version number with the MUI X packages.
`@mui/x-date-pickers` does publish a v8.

| Package | Published majors |
| --- | --- |
| `@mui/material` | 5, 6, 7, **9** |
| `@mui/icons-material` | 5, 6, 7, **9** |
| `@mui/x-date-pickers` | 5, 6, 7, 8, 9 |

Peer constraints that force the pairings below:

- `@mui/x-date-pickers@8` peers `@mui/material ^5.15.14 || ^6 || ^7`
- `@mui/x-date-pickers@9` peers `@mui/material ^7.3.0 || ^9`

## Stage 1 — Material 6 → 7, pickers 7 → 8 (complete)

- `@mui/material` 6.5.0 → 7.3.11
- `@mui/icons-material` 6.5.0 → 7.3.11
- `@mui/x-date-pickers` 7.29.4 → 8.29.2

Pickers had to move in the same PR: v7 only peers `@mui/material ^5 || ^6`, so
it could not stay behind once Material reached 7. Both packages still advanced
by exactly one major.

Notes from this stage:

- `Grid` → `Grid2` rename and the `Hidden` removal did not apply; neither is
  used in this codebase.
- Pickers v8 makes the *accessible field DOM structure* the default, which
  replaces the picker's single `<input>` with sectioned spans. Both editors opt
  back out via `enableAccessibleFieldDOMStructure={false}` to keep markup and
  `data-testid` placement unchanged. See Stage 2.

## Stage 2 — adopt the accessible field DOM structure (complete)

Done as its own PR, before Stage 3: a behavioral change to the date pickers
rather than a version bump, so it was kept out of one. The opt-out added in
Stage 1 pinned deprecated v7 behavior, and the flag is removed outright in
pickers v9 — carrying it further would have turned that bump into a forced UI
change.

Work done:

- Removed `enableAccessibleFieldDOMStructure={false}` from
  `src/components/fieldTypes/lazy/DateEditorComponent.js` and
  `src/components/fieldTypes/lazy/DateTimeEditorComponent.js`.
- Moved the date editor's `data-testid` from `slotProps.textField.inputProps`
  onto the field root, matching what the datetime editor already did. Not
  `slotProps.htmlInput`: under the new structure that lands on the *visually
  hidden* input kept only for form interop, which tests cannot drive.
- Re-enabled and rewrote the date-editing assertions in
  `cypress/e2e/field-data-types.cy.js`, plus a keyboard-navigation step.
- Rewrote the three `DateEditorComponent.spec.js` tests that queried
  `role="textbox"`, which no longer exists.

Notes from this stage:

- The rendered field is a `role="group"` wrapping one
  `span[role="spinbutton"][contenteditable]` per section, labelled `Month`,
  `Day`, `Year` (plus `Hours`, `Minutes`, `Meridiem` for datetime). Select
  sections by `aria-label`; there is no input to type into.
- Edit **one section at a time** in tests. Typing a full date walks through
  several intermediate valid dates and emits a PATCH for each, so a single
  `cy.wait('@updateCard')` would assert against the wrong one.
- Clearing is `ctrl+A` then `Delete` — `user.clear()` needs an input.
- The datetime value is sent as UTC, so assert through a local `Date` rather
  than a literal string, or the test only passes in one time zone.
- The old "mobile picker on CI" problem did not reappear: under
  `--browser chrome`, which is what CI uses, the desktop variant renders and
  its sections are editable. Worth re-checking if these tests ever fail only on
  CI, since the mobile field is read-only and typing into it silently does
  nothing.

## Stage 3 — Material 7 → 9, pickers 8 → 9

- `@mui/material` and `@mui/icons-material` 7 → 9 (no v8 exists)
- `@mui/x-date-pickers` 8 → 9

Pickers v9 peers `@mui/material ^7.3.0 || ^9`, so **pickers 8 → 9 can ship on
its own first**, while Material stays at 7. Prefer that split — it keeps each PR
to a single package family and isolates any picker regression from the much
larger Material bump.

Before starting, read the official migration guides rather than working from the
changelog alone:

- <https://mui.com/material-ui/migration/upgrade-to-v9/>
- <https://mui.com/x/migration/migration-pickers-v8/>

Expect this stage to be larger than Stage 1: it crosses two Material majors'
worth of change even though it is a single version step.

## Verification checklist

Run for every stage:

```bash
pnpm lint
pnpm format:check
pnpm test:ci
pnpm build
pnpm cypress:run     # needs the dev server on 8080
```

Then a manual pass in a browser covering the sign-in screen, the sign-up modal
(`Dialog`, `Select`, `TextField`), a board, a card, and both date editors.

Two things that cost time during Stage 1 and are worth knowing up front:

- **Restart the dev server after installing.** `pnpm add` re-resolves the
  lockfile and changes the `node_modules/.pnpm` path hashes. A dev server
  started beforehand keeps serving the old paths and fails with
  `ENOENT ... webpack-dev-server/client/index.js`, which looks like an upgrade
  regression but is not.
- **Check which port the dev server actually bound.** If 8080 is already taken,
  webpack-dev-server silently increments to 8081/8082, while `cypress.config.js`
  still points at 8080 — so Cypress tests the stale build. Either free the port
  or pass `--config baseUrl=http://localhost:<port>`.
