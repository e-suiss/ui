import EsuissUI
import SwiftUI

enum ComboboxStories {
  static let group = StoryGroup(.components, "Combobox", stories: [
    Story("Default") {
      ComboboxDemo()
    },
    Story("WithValue") {
      ComboboxDemo(initial: "Expo")
    },
    Story("WithClear") {
      ComboboxDemo(initial: "Remix")
    },
    Story("Multiple") {
      ComboboxMultipleDemo()
    },
    Story("WithLabel") {
      VStack(alignment: .leading, spacing: 8) {
        FieldLabel("Framework")
          .accessibilityHidden(true)
        ComboboxDemo()
          .accessibilityLabel(Text("Framework"))
        Text("Search and pick the framework you use.")
          .textStyle(.sm)
          .foregroundStyle(EsuissColor.mutedForeground)
      }
    },
    Story("Disabled") {
      ComboboxDemo(initial: "Astro")
        .disabled(true)
    },
    Story("Invalid") {
      VStack(alignment: .leading, spacing: 8) {
        ComboboxDemo()
          .invalid()
        Text("Please select a framework.")
          .textStyle(.sm)
          .foregroundStyle(EsuissColor.destructive)
      }
    },
  ])
}

private let comboboxFrameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
  "Gatsby",
  "Expo",
]

private struct ComboboxDemo: View {
  @State private var value: String?

  init(initial: String? = nil) {
    _value = State(initialValue: initial)
  }

  var body: some View {
    Combobox(
      comboboxFrameworks,
      selection: $value,
      placeholder: "Select a framework",
      emptyText: "No framework found."
    )
    .frame(width: 256)
  }
}

private struct ComboboxMultipleDemo: View {
  @State private var value = ["Expo", "Astro"]

  var body: some View {
    Combobox(
      comboboxFrameworks,
      selection: $value,
      placeholder: "Add framework",
      emptyText: "No framework found."
    )
    .frame(width: 288)
  }
}
