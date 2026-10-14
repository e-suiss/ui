# suiss/uim

[![npm version](https://img.shields.io/npm/v/@esuiss/ui?label=%40esuiss%2Fui)](https://www.npmjs.com/package/@esuiss/ui)
[![npm downloads](https://img.shields.io/npm/dm/@esuiss/ui)](https://www.npmjs.com/package/@esuiss/ui)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Documentation](https://img.shields.io/badge/docs-uim.suiss.app-black)](https://uim.suiss.app)

**suiss/uim is an open-source library of copy-paste mobile components with a clean, minimal design** for React Native and Expo projects with TypeScript, with matching SwiftUI and Jetpack Compose libraries. Every React Native component comes in three styling flavors with the same API: [Uniwind](https://uniwind.dev) (Tailwind CSS v4), [NativeWind](https://www.nativewind.dev) v4 (Tailwind CSS v3) and plain React Native StyleSheet. The `@esuiss/ui` command-line tool, shared with the web library, copies each component's source into your app, so you own the code and can change anything. It is the mobile counterpart of [suiss/ui](https://github.com/e-suiss/ui).

**[Documentation](https://uim.suiss.app/docs)** · [Components](https://uim.suiss.app/docs/components) · [Patterns](https://uim.suiss.app/docs/patterns) · [Interactions](https://uim.suiss.app/docs/interactions) · [CLI](https://uim.suiss.app/docs/cli)

## Features

- **Components**: buttons, inputs, sheets, drawers, dialogs, menus, tabs, calendars, wheel pickers, toasts and more.
- **Patterns and interactions**: pickers, confirmations, previews, swipe actions, pull to refresh and steppers built from the components.
- **Three styling options**: Uniwind, NativeWind or StyleSheet, detected from your project or chosen with `--styling`.
- **Expo and bare React Native**: packages are installed with `expo install` in Expo projects, and Babel is configured for you in bare projects.
- **Native feel**: animations with Reanimated, gestures with React Native Gesture Handler.
- **SwiftUI and Jetpack Compose**: the same components for native iOS and Android apps.
- **Themeable**: one token source for every platform, with light and dark colors that match suiss/ui.
- **Phosphor icons** throughout.

## Quick start

```bash
npx @esuiss/ui@latest init
npx @esuiss/ui@latest add dialog
```

```tsx
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

export function Example() {
  return (
    <Button>
      <Text>Continue</Text>
    </Button>
  )
}
```

`init` sets up Uniwind (Tailwind CSS v4), NativeWind v4 (Tailwind CSS v3) or plain React Native StyleSheet, the `@/*` import alias, the theme stylesheet, the Metro config, the portal host in the root layout, and the button. `add` copies components into `components/ui/` together with the components and packages they depend on. In Expo projects packages are installed with `expo install`, so native modules match the Expo SDK. In React Native projects without Expo, `init` also adds the `@/*` alias to Babel with `babel-plugin-module-resolver`, and `add` adds the Reanimated Babel plugin when a component needs it. Run `cd ios && pod install` after adding components there.

The styling library is detected from the project. When neither is installed, `init` asks; pass `--styling uniwind`, `--styling nativewind` or `--styling stylesheet` to choose up front. StyleSheet needs no Tailwind; `init` writes `components/ui/theme.ts` with the colors and a `useTheme()` hook. For NativeWind, `init` also writes `tailwind.config.js` and the NativeWind Babel preset.

Update a component later:

```bash
npx @esuiss/ui@latest add button --diff
npx @esuiss/ui@latest add button --overwrite
```

SwiftUI and Jetpack Compose components are copied the same way:

```bash
npx @esuiss/ui@latest init --platform swift    # Xcode project or Swift package
npx @esuiss/ui@latest add dialog --platform swift
npx @esuiss/ui@latest init --platform kotlin   # Android Gradle module
npx @esuiss/ui@latest add dialog --platform kotlin
```

`add` copies the component and every file it uses into `EsuissUI/` or `src/main/kotlin/com/esuiss/ui/` (change it with `--path`) and prints the packages to add. You can also use the SwiftUI library as a Swift package from [e-suiss/uim-swift](https://github.com/e-suiss/uim-swift).

## FAQ

**What is suiss/uim?**
An open-source collection of mobile components, patterns and interactions with a clean, minimal design, for React Native and Expo, distributed as source code through the `@esuiss/ui` CLI, with SwiftUI and Jetpack Compose versions.

**Should I use Uniwind, NativeWind or StyleSheet?**
Use the one your project already has; the CLI detects it. For a new project, Uniwind uses Tailwind CSS v4, NativeWind v4 uses Tailwind CSS v3, and StyleSheet needs no Tailwind at all.

**Does it work with Expo?**
Yes, with Expo and with bare React Native projects that use TypeScript.

**Does it support dark mode?**
Yes. Colors follow the system appearance on iOS and Android.

**Is there a web version?**
Yes. [suiss/ui](https://github.com/e-suiss/ui) has the same components for React, Next.js and Vite.

**Is it free?**
Yes, it is released under the [MIT License](LICENSE).

**Is the documentation available for AI assistants?**
Yes. [uim.suiss.app/llms.txt](https://uim.suiss.app/llms.txt) lists every page, [uim.suiss.app/llms-full.txt](https://uim.suiss.app/llms-full.txt) contains the full documentation, and every page is available as Markdown by adding `.md` to its URL.

## Develop

```bash
pnpm install
pnpm ios             # build the Storybook app and open it in the iOS simulator
pnpm android         # same for Android
pnpm typecheck
pnpm check           # lint and format check with Biome
pnpm format          # apply Biome fixes and formatting
pnpm knip            # find unused files, exports, and dependencies
pnpm nativewind      # regenerate the NativeWind components and stylesheet
pnpm registry        # regenerate registry.json after changing components
pnpm registry:check  # fail if registry.json is out of date
```

Git hooks are installed by `pnpm install`:

- pre-commit: Biome fixes and checks the staged files (warnings fail too). When components or the Uniwind stylesheet change, the NativeWind files and `registry.json` are regenerated.
- commit-msg: commitlint enforces [Conventional Commits](https://www.conventionalcommits.org), e.g. `fix: correct dialog padding`.
- pre-push: Biome on the whole repo, typecheck, Knip, the registry check, and the NativeWind check.

- `uniwind/components/ui/`: the Uniwind components, the source the other versions are generated from. `add` copies them into `components/ui/` in projects.
- `packages/tokens/tokens.json`: the design tokens for every platform; edit them here and run `pnpm tokens` to regenerate each platform's theme.
- `styles/uniwind.css`: the theme and Uniwind setup, written to the project stylesheet by `init`. Colors use the same values as the web library.
- `nativewind/components/ui/`, `styles/nativewind.css` and `styles/nativewind.config.js`: the NativeWind v4 versions, generated from the Uniwind sources by `pnpm nativewind`. They use precomputed color tokens such as `bg-destructive-10` instead of opacity modifiers on theme colors, and Tailwind CSS v3 class names. Don't edit them by hand.
- `stylesheet/components/ui/`: the StyleSheet versions, written by hand with `theme.ts`. Keep them in step with the Uniwind components when you change one.
- `swiftui/`: the SwiftUI package `EsuissUI` and its catalog app, published to [e-suiss/uim-swift](https://github.com/e-suiss/uim-swift) on every release.
- `kotlin/`: the Jetpack Compose library and its catalog app, published to [e-suiss/uim-kotlin](https://github.com/e-suiss/uim-kotlin) on every release.
- `stories/`: one Storybook file per component, rendered on the device. Light and dark mode follow the system appearance.

## Release

Component and stylesheet changes reach users as soon as they are pushed to `main`, because the `@esuiss/ui` CLI in [e-suiss/ui](https://github.com/e-suiss/ui) always reads this repository's `main` branch. Release when the SwiftUI and Compose libraries should get a new version tag:

```bash
pnpm release patch   # or minor, major, or an exact version like 1.0.0
```

This bumps the version in `package.json`, commits, tags `vX.Y.Z`, and pushes. GitHub Actions then publishes `swiftui/` and `kotlin/` to their repositories with the same tag and creates the GitHub release.
