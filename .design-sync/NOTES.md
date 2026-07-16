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
