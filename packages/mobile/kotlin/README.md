# suiss/ui for Jetpack Compose

[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Documentation](https://img.shields.io/badge/docs-suiss.app%2Fui-black)](https://suiss.app/ui)

**The Jetpack Compose library of [suiss/ui](https://github.com/e-suiss/ui): mobile components with a clean, minimal design** that follow the React Native and SwiftUI versions: the same names, parts and tokens, with light and dark mode. Built on Compose Foundation only.

## Features

- **Components**: buttons, inputs, sheets, drawers, dialogs, menus, tabs, calendars, wheel pickers, toasts and more.
- **Patterns and interactions**: pickers, confirmations, previews, swipe actions, pull to refresh, steppers and more.
- **Blocks and charts**: ready screens such as sign in, settings and dashboards, and line, area, bar, pie, radial and radar charts.
- **Themeable**: one token source shared with every platform.
- **Phosphor icons** throughout.

## Installation

A Maven artifact is on the way. Until then, clone this repository next to your app and include the `ui` module in your `settings.gradle.kts`:

```kotlin
include(":esuiss-ui")
project(":esuiss-ui").projectDir = file("../uim-kotlin/ui")
```

Then depend on it:

```kotlin
dependencies {
    implementation(project(":esuiss-ui"))
}
```

Requires Android API 24 or later.

## Usage

```kotlin
import androidx.compose.runtime.Composable
import com.esuiss.ui.components.Button
import com.esuiss.ui.theme.EsuissTheme

@Composable
fun Example() {
    EsuissTheme {
        Button("Continue", onClick = {})
    }
}
```

## Catalog

The `catalog` module is a browsable app with every component, pattern, block and chart story. Open this folder in Android Studio and run the `catalog` configuration.

## Contributing

This repository is published from [e-suiss/ui](https://github.com/e-suiss/ui/tree/main/packages/mobile/kotlin) on every release. Please open issues and pull requests there.

## License

[MIT](LICENSE)
