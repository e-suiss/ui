# suiss/uim for SwiftUI

[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Documentation](https://img.shields.io/badge/docs-uim.suiss.app-black)](https://uim.suiss.app)

**EsuissUI is the SwiftUI library of [suiss/uim](https://github.com/e-suiss/uim): mobile components with a clean, minimal design** that follow the React Native and Jetpack Compose versions: the same names, parts and tokens, with light and dark mode.

## Features

- **Components**: buttons, inputs, sheets, drawers, dialogs, menus, tabs, calendars, wheel pickers, toasts and more.
- **Patterns and interactions**: pickers, confirmations, flyouts, swipe actions, pull to refresh, steppers and more.
- **Blocks and charts**: ready screens such as sign in, settings and dashboards, and line, area, bar, pie, radial and radar charts.
- **Themeable**: one token source shared with every platform.
- **Phosphor icons** throughout.

## Installation

Add the package in Xcode with **File → Add Package Dependencies…** and the URL:

```
https://github.com/e-suiss/uim-swift
```

Or in `Package.swift`:

```swift
dependencies: [
  .package(url: "https://github.com/e-suiss/uim-swift", from: "0.4.0")
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

This repository is published from [e-suiss/uim](https://github.com/e-suiss/uim) on every release. Please open issues and pull requests there.

## License

[MIT](LICENSE)
