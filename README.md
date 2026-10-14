# suiss/ui

[![npm version](https://img.shields.io/npm/v/@esuiss/ui?label=%40esuiss%2Fui)](https://www.npmjs.com/package/@esuiss/ui)
[![npm downloads](https://img.shields.io/npm/dm/@esuiss/ui)](https://www.npmjs.com/package/@esuiss/ui)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Documentation](https://img.shields.io/badge/docs-ui.suiss.app-black)](https://ui.suiss.app)

**suiss/ui is an open-source library of copy-paste React components with a clean, minimal design.** It is built on [Base UI](https://base-ui.com) and [Tailwind CSS](https://tailwindcss.com) v4 for Next.js and React (Vite) projects with TypeScript. Instead of installing a component package, the `@esuiss/ui` command-line tool copies each component's source into your project, so you own the code and can change anything.

**[Documentation](https://ui.suiss.app/docs)** · [Components](https://ui.suiss.app/docs/components) · [Patterns](https://ui.suiss.app/docs/patterns) · [Interactions](https://ui.suiss.app/docs/interactions) · [Charts](https://ui.suiss.app/docs/charts) · [Blocks](https://ui.suiss.app/docs/blocks) · [CLI](https://ui.suiss.app/docs/cli)

## Features

- **Components**: buttons, inputs, dialogs, sheets, drawers, menus, sidebars, tables, calendars, toasts, chat views and more.
- **Patterns and interactions**: command palettes, pickers, split views, swipe actions, pull to refresh, steppers and other compositions built from the components.
- **Charts**: area, bar, line, pie, radar and radial charts built on Recharts.
- **Blocks**: full sections such as sign-up, checkout, dashboards, settings and pricing pages.
- **Accessible**: keyboard navigation, focus management and ARIA come from Base UI primitives.
- **Themeable**: colors named by role (`bg-surface`, `text-label`, `bg-accent`), written in oklch for light and dark mode.
- **Phosphor icons** throughout.
- **No runtime dependency**: the CLI runs with `npx` and is never installed in your project.

## Quick start

```bash
npx @esuiss/ui@latest init
npx @esuiss/ui@latest add button dialog sidebar
```

```tsx
import { Button } from "@/components/ui/button"

export function Example() {
  return <Button>Continue</Button>
}
```

`init` sets up Tailwind CSS (4.2 or later), the `@/*` import alias, the theme stylesheet, and the button. The stylesheet holds your theme: colors in oklch under `:root` and `.dark`, the radius, the font, and the `@theme inline` block that turns them into Tailwind classes such as `bg-surface`, `text-label` and `bg-accent`. Add or change colors there. Variants, animations, and utilities come from the `@esuiss/tailwind` package it imports. `add` copies components into `components/ui/` together with the components and packages they depend on. Patterns, interactions, charts and blocks are added by name:

```bash
npx @esuiss/ui@latest add patterns command-palette
npx @esuiss/ui@latest add charts bar-chart-default
npx @esuiss/ui@latest add blocks login-account
```

Update a component later:

```bash
npx @esuiss/ui@latest add button --diff
npx @esuiss/ui@latest add button --overwrite
```

## FAQ

**What is suiss/ui?**
An open-source collection of React components, patterns, interactions, charts and blocks with a clean, minimal design, distributed as source code through the `@esuiss/ui` CLI.

**How is it different from a component library on npm?**
Components are not imported from a package. Their source is copied into `components/ui/` in your project, so you can read, change and extend every line without waiting for a release.

**Which frameworks does it support?**
Next.js and React with Vite, using TypeScript and Tailwind CSS 4.2 or later.

**Does it support dark mode?**
Yes. Every color has a light and a dark value, and components switch with the `.dark` class.

**Is there a version for mobile apps?**
Yes. [suiss/uim](mobile) brings the same components to React Native and Expo, SwiftUI and Jetpack Compose, and the same `@esuiss/ui` command adds them: run it in an Expo or React Native app, an Xcode project or an Android Gradle module.

**Is it free?**
Yes, it is released under the [MIT License](LICENSE).

**Is the documentation available for AI assistants?**
Yes. [ui.suiss.app/llms.txt](https://ui.suiss.app/llms.txt) lists every page, [ui.suiss.app/llms-full.txt](https://ui.suiss.app/llms-full.txt) contains the full documentation, and every page is available as Markdown by adding `.md` to its URL.

## Develop

```bash
pnpm install
pnpm typecheck
pnpm check           # lint and format check with Biome
pnpm format          # apply Biome fixes and formatting
pnpm knip            # find unused files, exports, and dependencies
pnpm registry        # regenerate registry.json after changing components or hooks
pnpm registry:check  # fail if registry.json is out of date
pnpm storybook       # preview every component at http://localhost:6006
```

Git hooks are installed by `pnpm install`:

- pre-commit: Biome fixes and checks the staged files (warnings fail too), and `registry.json` is regenerated when components or hooks change.
- commit-msg: commitlint enforces [Conventional Commits](https://www.conventionalcommits.org), e.g. `fix: correct dialog padding`.
- pre-push: Biome on the whole repo, typecheck, Knip, and the registry check, plus the same checks for `mobile/` and the site typecheck.

- `components/ui/` and `hooks/`: the files `add` copies into projects.
- `styles/globals.css`: the theme (oklch colors, radius, font, `@theme inline` names), written to the project stylesheet by `init`.
- `stories/`: one Storybook file per component. Use the toolbar to switch between light and dark mode.
- `packages/cli/`: the `@esuiss/ui` command.
- `packages/tailwind/`: the `@esuiss/tailwind` stylesheet with variants, animations, and utilities.
- `mobile/`: suiss/uim, the React Native (Uniwind, NativeWind and StyleSheet), SwiftUI and Jetpack Compose library with its own `registry.json`, stories and catalog apps. Run `pnpm install` inside it; see `mobile/README.md`.
- `site/`: the ui.suiss.app and uim.suiss.app sites. Run `pnpm install` and `pnpm dev` inside it; see `site/README.md`.

## Release

Component, hook, and theme color changes, on the web and in `mobile/`, reach users as soon as they are pushed to `main`. Releasing is needed when `packages/cli` or `packages/tailwind` changes; both packages are released together with the same version:

```bash
pnpm release patch   # or minor, major, or an exact version like 1.0.0
```

This bumps both packages, commits, tags `vX.Y.Z`, and pushes. GitHub Actions then publishes them to npm, publishes `mobile/swiftui` and `mobile/kotlin` to [e-suiss/uim-swift](https://github.com/e-suiss/uim-swift) and [e-suiss/uim-kotlin](https://github.com/e-suiss/uim-kotlin) with the same tag, and creates the GitHub release.
