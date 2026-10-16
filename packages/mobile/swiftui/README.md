# suiss/ui for SwiftUI

[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Documentation](https://img.shields.io/badge/docs-suiss.app%2Fui-black)](https://suiss.app/ui)

**EsuissUI is the SwiftUI library of [suiss/ui](https://github.com/e-suiss/ui): mobile components with a clean, minimal design** that follow the React Native and Jetpack Compose versions: the same names, parts and tokens, with light and dark mode.

## Features

- **Components**: buttons, inputs, sheets, drawers, dialogs, menus, tabs, calendars, wheel pickers, toasts and more.
- **Patterns and interactions**: pickers, confirmations, previews, swipe actions, pull to refresh, steppers and more.
- **Blocks and charts**: ready screens such as sign in, settings and dashboards, and line, area, bar, pie, radial and radar charts.
- **Themeable**: one token source shared with every platform.
- **Phosphor icons** throughout.

## Installation

Add the package in Xcode with **File → Add Package Dependencies…** and the URL:

```
https://github.com/e-suiss/uim-swift
```

Or in `Package.swift`, replacing `0.6.0` with the latest release:

```swift
dependencies: [
  .package(url: "https://github.com/e-suiss/uim-swift", from: "0.6.0")
],
targets: [
  .target(name: "App", dependencies: [.product(name: "EsuissUI", package: "uim-swift")])
]
```

Requires iOS 17 or later.

## Usage

```swift
import EsuissUI
import SwiftUI

struct ContentView: View {
  var body: some View {
    Button("Continue") {}
      .buttonStyle(.variant(.default))
  }
}
```

## Catalog

`Catalog/Catalog.xcodeproj` is a browsable app with every component, pattern, block and chart story. Open it in Xcode, pick a simulator and run the `Catalog` scheme.

## Contributing

This repository is published from [e-suiss/ui](https://github.com/e-suiss/ui/tree/main/packages/mobile) on every release. Please open issues and pull requests there.

## License

[MIT](LICENSE)
