# suiss/ui

[![npm version](https://img.shields.io/npm/v/@esuiss/ui?label=%40esuiss%2Fui)](https://www.npmjs.com/package/@esuiss/ui)
[![npm downloads](https://img.shields.io/npm/dm/@esuiss/ui)](https://www.npmjs.com/package/@esuiss/ui)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Documentation](https://img.shields.io/badge/docs-ui.suiss.app-black)](https://ui.suiss.app)

**suiss/ui is an open-source library of copy-paste components with a clean, minimal design for React, React Native, SwiftUI and Jetpack Compose.** React components are built on [Base UI](https://base-ui.com) and [Tailwind CSS](https://tailwindcss.com) v4 for Next.js and Vite. React Native components come in [Uniwind](https://uniwind.dev), [NativeWind](https://www.nativewind.dev) and plain StyleSheet flavors with the same API for Expo and React Native. SwiftUI views and Compose composables share the same design tokens, names and variants. Instead of installing a component package, the `@esuiss/ui` command-line tool copies each component's source into your project, so you own the code and can change anything.

**[Documentation](https://ui.suiss.app/docs)** · [Components](https://ui.suiss.app/docs/components) · [Patterns](https://ui.suiss.app/docs/patterns) · [Interactions](https://ui.suiss.app/docs/interactions) · [Charts](https://ui.suiss.app/docs/charts) · [Blocks](https://ui.suiss.app/docs/blocks) · [CLI](https://ui.suiss.app/docs/cli)

## Features

- **Four platforms, one design**: React, React Native, SwiftUI and Jetpack Compose read the same tokens and use the same component names, parts and variants.
- **Components**: buttons, inputs, dialogs, sheets, drawers, menus, sidebars, tables, calendars, toasts, keypads, chat views and more.
- **Patterns and interactions**: command palettes, pickers, split views, swipe actions, pull to refresh, card stacks and other compositions built from the components.
- **Charts**: area, bar, line, pie, radar and radial charts, built on Recharts on the web, react-native-svg in React Native, Swift Charts in SwiftUI and the Compose canvas on Android.
- **Blocks**: complete screens such as sign-up, checkout, dashboards, settings and pricing.
- **Accessible**: keyboard navigation, focus management and screen reader labels on every platform.
- **Themeable**: colors named by role (`surface`, `label`, `accent`), with a light and a dark value for every color.
- **Phosphor icons** throughout.
- **No runtime dependency**: the CLI runs with `npx` and is never installed in your project.

## Quick start

Run the CLI in your project. It detects whether it is a Next.js or Vite app, an Expo or React Native app, an Xcode project or an Android Gradle module:

```bash
npx @esuiss/ui@latest init
npx @esuiss/ui@latest add button dialog sheet
```

```tsx
import { Button } from "@/components/ui/button"

export function Example() {
  return <Button>Continue</Button>
}
```

For SwiftUI and Jetpack Compose, pass the platform when the folder holds more than one project:

```bash
npx @esuiss/ui@latest add dialog --platform swift
npx @esuiss/ui@latest add dialog --platform kotlin
```

On the web, `init` sets up Tailwind CSS (4.2 or later), the `@/*` import alias, the theme stylesheet and the button. In React Native projects it sets up Uniwind, NativeWind or StyleSheet, the theme, Metro and the portal host. In Xcode and Gradle projects it copies the theme files and the button. `add` copies components together with the components and packages they depend on. Patterns, interactions, charts and blocks are added by name:

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
An open-source collection of components, patterns, interactions, charts and blocks with a clean, minimal design for React, React Native, SwiftUI and Jetpack Compose, distributed as source code through the `@esuiss/ui` CLI.

**How is it different from a component library on npm?**
Components are not imported from a package. Their source is copied into your project, so you can read, change and extend every line without waiting for a release.

**Which platforms does it support?**
React with Next.js or Vite (TypeScript, Tailwind CSS 4.2 or later), React Native with Expo or without it (TypeScript; Uniwind, NativeWind v4 or StyleSheet), SwiftUI on iOS 17 or later, and Jetpack Compose with `minSdk` 24 or higher.

**Does it support dark mode?**
Yes. Every color has a light and a dark value on every platform.

**Is it free?**
Yes, it is released under the [MIT License](LICENSE).

**Is the documentation available for AI assistants?**
Yes. [ui.suiss.app/llms.txt](https://ui.suiss.app/llms.txt) lists every page, [ui.suiss.app/llms-full.txt](https://ui.suiss.app/llms-full.txt) contains the full documentation, and every page is available as Markdown by adding `.md` to its URL.

## Develop

This repository is a pnpm workspace. One install at the root sets up everything:

```bash
pnpm install
pnpm dev             # the ui.suiss.app site on :3000
pnpm build           # build the site
pnpm typecheck       # every package and site
pnpm test            # web component tests and CLI tests
pnpm check           # Biome on the web library, the CLI and the mobile library
pnpm format          # apply Biome fixes and formatting
pnpm knip            # unused files, exports, and dependencies in every package
pnpm registry        # regenerate the web and mobile registries and the site pages
pnpm registry:check  # fail if a registry is out of date
pnpm sync-site       # copy changed library components into the sites
pnpm --filter @esuiss/web storybook     # web Storybook at http://localhost:6006
pnpm --filter @esuiss/mobile start      # the React Native Storybook app
```

Layout:

- `apps/ui`: the ui.suiss.app site, with a React, React Native, SwiftUI and Compose tab on every page.
- `packages/web`: the web library. `components/` and `hooks/` are the files `add` copies into projects, `styles/globals.css` is the theme `init` writes, `stories/` has one Storybook file per component, and `registry.json` lists everything.
- `packages/mobile`: the mobile library: React Native components for Uniwind, NativeWind and StyleSheet, the SwiftUI and Jetpack Compose libraries with their catalog apps, stories and its own `registry.json`. See `packages/mobile/README.md`.
- `packages/tokens`: the design tokens the mobile themes are generated from.
- `packages/cli`: the `@esuiss/ui` command.
- `packages/tailwind`: the `@esuiss/tailwind` stylesheet with variants, animations, and utilities.

Git hooks are installed by `pnpm install`:

- pre-commit: Biome fixes and checks the staged files (warnings fail too). Changed web components regenerate `packages/web/registry.json` and the copies in the sites; changed mobile components, the Uniwind stylesheet or the tokens regenerate the NativeWind files, the themes and `packages/mobile/registry.json`.
- commit-msg: commitlint enforces [Conventional Commits](https://www.conventionalcommits.org), e.g. `fix: correct dialog padding`.
- pre-push: Biome, Knip, typecheck, the registry checks, the site copy check, and the tests.

## Deploy

Every push to `main` that changes the site builds the `apps/Dockerfile` image for `linux/amd64` and `linux/arm64` and pushes it to `ghcr.io/e-suiss/ui/site`, tagged `latest` and with the short commit SHA. The server only pulls and runs it:

```bash
docker pull ghcr.io/e-suiss/ui/site:latest
docker run -d -p 3000:3000 ghcr.io/e-suiss/ui/site:latest
```

To build it locally, run `docker build -f apps/Dockerfile .` from the repository root.

## Release

Component, hook, and theme color changes, on the web and on mobile, reach users as soon as they are pushed to `main`. Releasing is needed when `packages/cli` or `packages/tailwind` changes; both packages are released together with the same version:

```bash
pnpm release patch   # or minor, major, or an exact version like 1.0.0
```

This bumps both packages, commits, tags `vX.Y.Z`, and pushes. GitHub Actions then publishes them to npm, publishes `packages/mobile/swiftui` and `packages/mobile/kotlin` to [e-suiss/uim-swift](https://github.com/e-suiss/uim-swift) and [e-suiss/uim-kotlin](https://github.com/e-suiss/uim-kotlin) with the same tag, and creates the GitHub release.
