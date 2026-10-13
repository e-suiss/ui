# @esuiss/uim

Copy-paste React Native components with a clean, minimal design for Expo and React Native projects, styled with [Uniwind](https://uniwind.dev), [NativeWind](https://www.nativewind.dev) or plain StyleSheet.

**[Documentation](https://uim.suiss.app/docs)** · [Components](https://uim.suiss.app/docs/components) · [CLI reference](https://uim.suiss.app/docs/cli) · [GitHub](https://github.com/e-suiss/uim)

```bash
npx @esuiss/uim@latest init
npx @esuiss/uim@latest add
npx @esuiss/uim@latest add dialog
npx @esuiss/uim@latest add button --diff
npx @esuiss/uim@latest add button --overwrite
```

Run `add` without names to pick from a list: choose components, patterns, interactions, charts or blocks, type to filter, select with space and press enter. Outside an interactive terminal, `add` without names prints the available names instead.

`init` sets up Uniwind (Tailwind CSS v4), NativeWind v4 (Tailwind CSS v3) or plain StyleSheet, the `@/*` import alias, the theme stylesheet, the portal host, and the button. In React Native projects without Expo it also sets up the Babel alias resolver and the Reanimated plugin. Requires TypeScript. The styling library is detected from the project, or chosen with `--styling uniwind|nativewind|stylesheet`.

## SwiftUI and Jetpack Compose

The same components are available as SwiftUI and Jetpack Compose source. Pass `--platform swift` or `--platform kotlin`:

```bash
npx @esuiss/uim@latest init --platform swift
npx @esuiss/uim@latest add dialog --platform swift

npx @esuiss/uim@latest init --platform kotlin
npx @esuiss/uim@latest add dialog --platform kotlin
```

`init` copies the theme, the tokens and the button. `add` copies a component together with every file it uses, and keeps files you changed unless you pass `--overwrite`. SwiftUI files go to `EsuissUI/` in an Xcode project (or `Sources/<Target>/EsuissUI/` in a Swift package), Compose files to `src/main/kotlin/com/esuiss/ui/` of the Android module; choose another folder with `--path`. The CLI does not edit Xcode or Gradle files. It prints what to add: the Phosphor Swift package and iOS 17 for SwiftUI; the Compose plugin, Compose Foundation and the Phosphor icon library with minSdk 24 for Compose.
