import EsuissUI
import SwiftUI

enum ThemeStories {
  static let group = StoryGroup(.components, "Theme", stories: [
    Story("System") {
      ThemeDemo(defaultTheme: .system)
    },
    Story("Light") {
      ThemeDemo(defaultTheme: .light)
    },
    Story("Dark") {
      ThemeDemo(defaultTheme: .dark)
    },
    Story("WithStorage") {
      ThemeDemo(defaultTheme: .light, storage: SavedDarkThemeStorage.shared)
    },
  ])
}

private actor SavedDarkThemeStorage: ThemeStorage {
  static let shared = SavedDarkThemeStorage()

  private var values = ["theme-story": "dark"]

  func getItem(_ key: String) async -> String? {
    values[key]
  }

  func setItem(_ key: String, _ value: String?) async {
    values[key] = value
  }
}

private struct ThemeDemo: View {
  let defaultTheme: Theme

  @State private var storage: any ThemeStorage

  init(defaultTheme: Theme, storage: (any ThemeStorage)? = nil) {
    self.defaultTheme = defaultTheme
    _storage = State(initialValue: storage ?? InMemoryThemeStorage())
  }

  var body: some View {
    ThemeProvider(defaultTheme: defaultTheme, storage: storage, storageKey: "theme-story") {
      ThemePreview()
        .background {
          Color.surface.padding(-16)
        }
    }
  }
}

private struct ThemePreview: View {
  @Environment(\.theme) private var theme

  var body: some View {
    VStack(alignment: .leading, spacing: 24) {
      VStack(alignment: .leading, spacing: 8) {
        Text("Light and dark.").textVariant(.h2)
        Text("Every surface, label and accent follows the theme tokens, so the whole app changes at once.")
          .textStyle(.base)
          .foregroundStyle(Color.labelSecondary)
      }
      ThemeToggle()
      VStack(alignment: .leading, spacing: 4) {
        Text("Selected")
          .textStyle(.sm)
          .foregroundStyle(Color.labelSecondary)
        Text(verbatim: theme.theme.rawValue)
          .textStyle(.base, weight: .semibold)
          .foregroundStyle(Color.label)
        Text("Showing")
          .textStyle(.sm)
          .foregroundStyle(Color.labelSecondary)
          .padding(.top, 8)
        Text(verbatim: theme.resolvedTheme == .dark ? "dark" : "light")
          .textStyle(.base, weight: .semibold)
          .foregroundStyle(Color.label)
      }
      .padding(16)
      .frame(maxWidth: .infinity, alignment: .leading)
      .background(Color.surfaceSecondary, in: RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
    }
    .frame(maxWidth: .infinity, alignment: .leading)
  }
}
