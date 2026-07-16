# Building with Blueprint (`@blueprintjs/core`, v6)

Blueprint is a **component + props** design system (not a utility-class system). You style
almost everything by passing **props** to components — `intent`, `variant`, `size`, `fill`,
`minimal`, `outlined`, `icon` — NOT by writing CSS classes. Reach for a class only for the
handful of documented modifiers exposed via the `Classes` helper. Global styling comes from
one stylesheet; per-instance styling comes from props.

## Setup (required)

Wrap the whole app in `<BlueprintProvider>` and import the compiled stylesheet once. Without
the provider, overlays (Dialog, Drawer, Popover, Tooltip, Toast, ContextMenu), portals, and
hotkeys have no context and render broken.

```tsx
import { BlueprintProvider, Button } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
// once, at startup: only show focus rings for keyboard users
FocusStyleManager.onlyShowFocusOnTabs();

<BlueprintProvider>
    <App />
</BlueprintProvider>;
```

## The styling idiom — props first

- **Intent** (semantic color) is a prop, not a class: `intent="primary" | "success" | "warning" | "danger" | "none"`.
  `<Button intent="primary">`, `<Callout intent="warning">`, `<Tag intent="danger">`, `<Spinner intent="success">`.
- **Button** appearance is `variant="solid" | "minimal" | "outlined"` + `size="small" | "medium" | "large"`, plus
  `fill`, `active`, `loading`, `disabled`, `icon`, `endIcon`, `alignText`.
- **Icons** are the icon name string or a `<Buggy />`-style element: `<Button icon="refresh" endIcon="caret-down">`,
  `<Icon icon="user" intent="primary" size={20} />`. Icon names come from `@blueprintjs/icons` (500+ icons).
- **Layout/containers** carry their own props: `Card` (`elevation={0..4}`, `interactive`, `selected`, `compact`),
  `Section`, `Navbar`, `Menu`, `FormGroup`, `ControlGroup`, `Tabs`, `Tree`.
- **Dark theme**: put the `Classes.DARK` class (`bp6-dark`) on a container element; everything inside re-themes.

## Classes vocabulary (only when a prop won't do)

Import the `Classes` object — never hardcode the `bp6-` strings. Real members you'll actually use:
`Classes.DARK` (`bp6-dark`), `Classes.ELEVATION_0..4`, `Classes.FILL`, `Classes.MINIMAL`, `Classes.OUTLINED`,
`Classes.INTENT_PRIMARY | INTENT_SUCCESS | INTENT_WARNING | INTENT_DANGER`, and typography classes
`Classes.HEADING` (`bp6-heading`), `Classes.RUNNING_TEXT` (`bp6-running-text`), `Classes.TEXT_MUTED`
(`bp6-text-muted`), `Classes.TEXT_LARGE`, `Classes.TEXT_SMALL`, `Classes.MONOSPACE` (`bp6-monospace`),
`Classes.CODE`. Typography can also be applied by wrapping content in `bp6-running-text`.

## Color tokens

Use the `Colors` TS export for literal color values (`Colors.BLUE3`, `Colors.GREEN3`, `Colors.RED3`,
`Colors.GRAY1..5`, `Colors.DARK_GRAY1..5`, `Colors.LIGHT_GRAY1..5`, `Colors.BLACK`, `Colors.WHITE`).
In CSS, the design tokens are `--bp-*` custom properties: intents as
`--bp-intent-{primary|success|warning|danger}-{rest|hover|active|foreground}`, and the raw palette as
`--bp-palette-{blue|green|red|orange|gray|…}-N`. Prefer intent props over reaching for these directly.

## Where the truth lives

Read the bound stylesheet `_ds/<folder>/styles.css` (it `@import`s `_ds_bundle.css`, the compiled
component CSS) before styling, and each component's `<Name>.d.ts` (the `<Name>Props` contract) and
`<Name>.prompt.md`. The 52 components: Alert, Button, Card, Callout, Dialog, Drawer, Menu, Navbar,
Tabs, Tree, Slider, Spinner, ProgressBar, InputGroup, NumericInput, HTMLSelect, FormGroup, Checkbox,
Switch, RadioGroup, SegmentedControl, Tag, Tooltip, PopoverNext, Toast, and more.

## One idiomatic build snippet

```tsx
import { Card, Button, Callout, FormGroup, InputGroup } from "@blueprintjs/core";

<Card elevation={1} style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 420 }}>
    <Callout intent="primary" icon="info-sign" title="Sign in">
        Enter your credentials to continue.
    </Callout>
    <FormGroup label="Email" labelFor="email">
        <InputGroup id="email" leftIcon="envelope" placeholder="you@example.com" fill />
    </FormGroup>
    <Button intent="primary" text="Continue" endIcon="arrow-right" fill />
</Card>;
```
