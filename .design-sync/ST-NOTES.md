# Blueprint select+table design-sync notes

Package shape sync of `@blueprintjs/select` (with `@blueprintjs/table` and
`@blueprintjs/core` merged in as `extraEntries`) into a separate claude.ai/design
project **"Blueprint Select & Table"** (id `57320f42-48a0-4798-8b96-0b59296f58ca`).
Config: `.design-sync/st-config.json` (separate from the core sync's `config.json`,
which anchors a different project).

## Scope (time-budgeted pass)

- 8 components discovered from `@blueprintjs/select`'s own `.d.ts` tree: Select,
  Select2, Suggest, Suggest2, MultiSelect, MultiSelect2, Omnibar, QueryList
  (the `*2` names are deprecated aliases re-exported by select).
- **Authored + graded `good`**: Select, MultiSelect, Suggest (the 3 highest-traffic
  components) — lean standalone previews with inline film data in
  `.design-sync/previews/{Select,MultiSelect,Suggest}.tsx` (NOT the docs site's
  `FilmSelect`/interactive-controls harness, to keep the pass lean).
- **Floor cards** (honest, unauthored, not failures): Select2, Suggest2,
  MultiSelect2 (deprecated aliases — low value to author), Omnibar (needs
  open-overlay handling), QueryList (headless, no visual on its own).
- **`@blueprintjs/table` was NOT synced as its own package** — it was only pulled
  in via `extraEntries` so `@blueprintjs/select` code that imports table can
  resolve. Table has zero cards/previews of its own in this project. A real Table
  sync needs `pkg: "@blueprintjs/table"` as its own converter run — not done here.

## Build facts

- `pkg: @blueprintjs/select`, `globalName: BlueprintSelect`, `--node-modules
packages/select/node_modules --entry packages/select/lib/esm/index.js`.
- **Symlink required**: `packages/select/node_modules/@blueprintjs/table` →
  `../../../table` (three `../` — select/node_modules/@blueprintjs is 3 levels
  below packages/). Not committed (gitignored, `node_modules` rule) — recreate on
  fresh clone: `ln -sfn ../../../table packages/select/node_modules/@blueprintjs/table`.
- **`cssEntry` is bounded to `pkgRoot` and copied VERBATIM** — `@import` paths
  don't get resolved/rewritten, so an `@import` pointing outside the bundle
  breaks styling silently. Fixed by committing the actual concatenated compiled
  CSS (core + select + table) as `packages/select/design-sync-styles.css`
  (~19.5k lines) — durable, tracked, referenced by `cfg.cssEntry`.
- **`cfg.provider: {"component": "BlueprintProvider"}` requires `@blueprintjs/core`
  in `extraEntries`** — BlueprintProvider is a core export; without core merged
  into the global, every preview crashes wrapping in the provider ("Element type
  is invalid") and all components fall to the floor card. `extraEntries:
["@blueprintjs/table", "@blueprintjs/core"]` fixes this.
- `[EXPORT_COLLISION]`: `@blueprintjs/core` (Classes, Utils) and `@blueprintjs/icons`
  (12 names incl. Select, MultiSelect, Grid, Clipboard) collide with select's own
  exports. Select/select's own names win the merge — not verified further given
  budget; watch if a future preview imports one of these names and gets the wrong
  binding.
- `[FONT_MISSING]`: Open Sans + blueprint-icons fonts not shipped — same class of
  gap as core; not resolved here (system-font fallback, budget-driven decision).

## Repo hygiene fix (durable, benefits future syncs too)

- `.design-sync/previews/*.tsx` tripped the repo's `eslint --fix --max-warnings 0`
  pre-commit hook (files outside any tsconfig project). Fixed by adding
  `.design-sync/**` to `eslint.config.js`'s ignores AND changing the lint-staged
  glob in `package.json` to `!(.design-sync/**)*.{ts,tsx}` (bare eslint ignores
  alone still warn when lint-staged passes explicit file args).
- Also had to build `@blueprintjs/eslint-plugin` locally (`pnpm exec nx run
@blueprintjs/eslint-plugin:compile`) — its `lib/` wasn't built, breaking every
  commit repo-wide until fixed.

## Re-sync / follow-up risks

- Never ran a full driver-equivalent receipt for this project (package shape's
  `resync.mjs` wasn't invoked here to save budget) — first re-sync should treat
  this as needing full re-verification.
- No conventions header authored for this project (budget) — the design agent
  building with Select/MultiSelect/Suggest has only the per-component
  `.prompt.md` + `.d.ts`, no cross-cutting guidance. Consider porting the core
  sync's `conventions.md` intro (BlueprintProvider setup, Classes/Colors) plus a
  select-specific section (itemRenderer/itemPredicate pattern) on a future pass.
- Table itself remains fully unsynced. A future pass: new `pkg: @blueprintjs/table`
  config, own project or merge into this one, author Table/Column/Cell previews
  from `packages/docs-app/src/examples/table-examples/*.tsx`.
