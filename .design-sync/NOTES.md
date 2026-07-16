# Blueprint design-sync notes

Design system: `@blueprintjs/core` synced to claude.ai/design (project "Blueprint",
id `cf65c2ec-7710-49b7-b078-521dae37a042`). Storybook shape.

## Scope

- **This sync covers `@blueprintjs/core` only.** It is the only package with Storybook
  stories (55 story files). `select`, `table`, `datetime`, `labs` have **zero** stories,
  so the storybook oracle can't verify them — deferred to a future authored-preview pass.
- User picked packages: core, select, table. select/table deferred per the above.

## Build / environment

- Repo pins Node `>=24.14.1` (`.nvmrc` v24.14.1), but only Node 20/21/22 available here.
  Built + synced on **Node 22**. Watch for Node-24-only behavior on re-sync.
- pnpm 11.3.0; install with `COREPACK_ENABLE_STRICT=0 pnpm install --frozen-lockfile`.
- Build command (`buildCmd`): compile core + the packages whose CSS `.storybook/preview.tsx`
  imports (core, icons, datetime, labs, select, table) via
  `pnpm exec nx run-many -t compile -p @blueprintjs/core @blueprintjs/icons @blueprintjs/datetime @blueprintjs/labs @blueprintjs/select @blueprintjs/table`.
  `.storybook/preview.tsx` imports blueprint-datetime/labs/select/table CSS, so those must
  be built or the reference storybook build fails.

## Storybook facts

- Single storybook at repo root `.storybook/`; stories glob `packages/{core,datetime,labs,select,table}/src/**/*.stories.@(ts|tsx)`.
- Preview wraps stories in `<BlueprintProvider>` (core export), theme-by-class (light default).
- Preview loads ALL icons up-front: `Icons.setLoaderOptions({loader:"all"}); await Icons.loadAll();`
  (`Icons` from `packages/icons/src/iconLoader`). **Icon rendering in previews depends on the
  bundle's Icons singleton being loaded** — watch icon-bearing stories (Button icons, Icon).
- Stories import `@storybook-common` (`.storybook/common.tsx`) and `@blueprintjs/labs` (`Flex`)
  for layout — these must resolve in preview compiles (storyImports bundle/shim likely needed).

## Conventions header must cover (per user emphasis + Blueprint docs sections)

The design agent needs these enumerated, sourced from the built artifacts:

- **Setup / getting-started**: wrap the app in `<BlueprintProvider>`; import
  `@blueprintjs/core/lib/css/blueprint.css`; `FocusStyleManager.onlyShowFocusOnTabs()`.
  (docs: #blueprint/getting-started)
- **Colors**: the `Colors` TS export + color scale tokens (gray/dark-gray/light-gray,
  core blue/green/orange/red, extended). Source: `packages/colors/src/_colors.scss` +
  `Colors` export + `blueprint.css` custom properties. (docs: #core/colors)
- **Classes vocabulary**: the `Classes` export and `bp*-`/`.bp5-`/`.bp6-` utility classes.
  Source: `Classes` export + `blueprint.css`. (docs: #core/classes)
- **Typography**: heading/running-text/text-muted/monospace classes. (docs: #core/typography)
- Blueprint docs site is a client-rendered SPA — WebFetch only sees the shell; derive
  everything from the local built artifacts instead.

## Verify-loop learnings (solo phase: Button, Icon, Callout, Dialog all match)

- [GENERAL] **Icons render fine in previews** via Blueprint's `autoLoad` + the bundled
  icon path-loader — no special handling needed (the storybook decorator's `Icons.loadAll()`
  is NOT bundled; icons still resolve per-component). Verified on Button/Icon stories.
- [GENERAL] `provider: {"component":"BlueprintProvider"}` supplies theme + overlay/portal/
  hotkeys context. Decorators do NOT auto-bundle (`.storybook/preview.tsx` has a top-level
  `await Icons.loadAll()` → esbuild "Top-level await not available" — expected, ignore).
- [GENERAL] `@storybook-common` and `@blueprintjs/labs` (`Flex`) resolve in preview compiles
  via `.design-sync/preview-tsconfig.json` (minimal tsconfig; do NOT point tsconfig at
  `.storybook/tsconfig.json` — it remaps `@blueprintjs/*` to source and breaks the bundle).
- [GENERAL] **Framing differs**: preview cells render smaller / full-width vs the storybook
  canvas (which centers). Judge the COMPONENT, not the surrounding whitespace — sub-scale and
  width differences from framing are `match`, not `close`.
- [GENERAL] Env for compare/rebuild: `export DS_CHROMIUM_PATH=/opt/pw-browsers/chromium
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`. Node 22.
- cardMode overrides already applied (config): column for wide components, single+primaryStory
  for portal overlays (Dialog/Drawer/MultistepDialog/PopoverNext/Tooltip). Do not re-apply.
- `[EXPORT_COLLISION]` warning: `@blueprintjs/icons` and core share 8 names (Code, Label,
  Link, Menu, SegmentedControl, Switch, …). Core wins the merge. Verified harmless — the
  affected stories (Link, Label, Switch, SegmentedControl) import from core, which wins,
  and render the component correctly (not an icon).
- [GENERAL] Blueprint uses **Blueprint v6**: class prefix `bp6-`, CSS tokens `--bp-*`
  (`--bp-intent-{primary,success,warning,danger}-{rest,hover,active,foreground}`,
  `--bp-palette-{blue,green,red,gray,…}-N`). `Classes` export → `bp6-*`; `Colors` export →
  `BLUE3`/`GREEN3`/`GRAY1-5`/`DARK_GRAY1-5`/etc.

## Overlay/portal grading context (wave-1 batch-D — Drawer, Popover, Tooltip, etc.)

- [GENERAL] **Storybook crops portaled open-overlay content** to `#storybook-root` while the
  preview captures the full viewport. A story with `isOpen:true` on a portal overlay shows a
  cropped sliver on the storybook (left) side but renders the full open overlay in the
  preview (right). **The preview is the faithful render** — grade the component, not the
  cropped storybook capture. Do NOT treat "storybook shows only the trigger" as authoritative
  when the story sets `isOpen:true`.
- [GENERAL] **Storybook `play` functions do NOT run in the preview capture harness.** Hover/
  click-to-open stories render OPEN in storybook but CLOSED (trigger only) in the preview.
  These are graded `close` with a note (not fixable without forcing `isOpen`, which would
  misrepresent the story) — the component is proven by its sibling `isOpen` stories.
  Accepted `close`: Tooltip "Hover Open", ContextMenuPopover "Click To Open".
- ButtonGroup + Breadcrumbs set to `cardMode:"single"` (portal/popover tail stories bleed the
  grid card). ContextMenu/Overlay2 interaction stories render closed on both sides (match).
