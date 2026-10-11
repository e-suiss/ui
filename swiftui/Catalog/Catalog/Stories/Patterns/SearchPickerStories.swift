import EsuissUI
import SwiftUI

enum SearchPickerStories {
  static let group = StoryGroup(.patterns, "Search Picker", stories: [
    Story("Default") {
      SearchPickerDemo()
    },
    Story("WithValue") {
      SearchPickerDemo(value: "astro")
    },
    Story("Grouped") {
      SearchPickerDemo(
        items: searchPickerCities,
        placeholder: "Select a city",
        searchPlaceholder: "Search cities...",
        emptyText: "No city found.",
        label: "City"
      )
    },
    Story("WithTitle") {
      SearchPickerDemo(title: "Framework")
    },
    Story("WithCloseButton") {
      SearchPickerDemo(showCloseButton: true)
    },
    Story("WithCloseLabel") {
      SearchPickerDemo(showCloseButton: true, closeLabel: "Cancel")
    },
    Story("Disabled") {
      SearchPickerDemo()
        .disabled(true)
    },
    Story("Invalid") {
      SearchPickerDemo()
        .invalid()
    },
    Story("Controlled") {
      SearchPickerControlled()
    },
  ])
}

private let searchPickerFrameworks = [
  SearchPickerItem(value: "next", label: "Next.js"),
  SearchPickerItem(value: "remix", label: "Remix"),
  SearchPickerItem(value: "astro", label: "Astro"),
  SearchPickerItem(value: "sveltekit", label: "SvelteKit"),
  SearchPickerItem(value: "nuxt", label: "Nuxt"),
  SearchPickerItem(value: "gatsby", label: "Gatsby", disabled: true),
]

private let searchPickerCities = [
  SearchPickerItem(value: "nyc", label: "New York", group: "Americas"),
  SearchPickerItem(value: "chi", label: "Chicago", group: "Americas"),
  SearchPickerItem(value: "sao", label: "São Paulo", group: "Americas"),
  SearchPickerItem(value: "lon", label: "London", group: "Europe"),
  SearchPickerItem(value: "ber", label: "Berlin", group: "Europe"),
  SearchPickerItem(value: "ist", label: "Istanbul", group: "Europe"),
  SearchPickerItem(value: "tyo", label: "Tokyo", group: "Asia"),
  SearchPickerItem(value: "sin", label: "Singapore", group: "Asia"),
]

private struct SearchPickerDemo: View {
  var items = searchPickerFrameworks
  var placeholder: LocalizedStringKey = "Select a framework"
  var searchPlaceholder: LocalizedStringKey = "Search frameworks..."
  var emptyText: LocalizedStringKey = "No framework found."
  var label: LocalizedStringKey = "Framework"
  var title: LocalizedStringKey?
  var showCloseButton = false
  var closeLabel: LocalizedStringKey?

  @State private var value: String?

  init(
    value: String? = nil,
    items: [SearchPickerItem] = searchPickerFrameworks,
    placeholder: LocalizedStringKey = "Select a framework",
    searchPlaceholder: LocalizedStringKey = "Search frameworks...",
    emptyText: LocalizedStringKey = "No framework found.",
    label: LocalizedStringKey = "Framework",
    title: LocalizedStringKey? = nil,
    showCloseButton: Bool = false,
    closeLabel: LocalizedStringKey? = nil
  ) {
    _value = State(initialValue: value)
    self.items = items
    self.placeholder = placeholder
    self.searchPlaceholder = searchPlaceholder
    self.emptyText = emptyText
    self.label = label
    self.title = title
    self.showCloseButton = showCloseButton
    self.closeLabel = closeLabel
  }

  var body: some View {
    SearchPicker(
      items: items,
      selection: $value,
      placeholder: placeholder,
      searchPlaceholder: searchPlaceholder,
      emptyText: emptyText,
      title: title,
      showCloseButton: showCloseButton,
      closeLabel: closeLabel
    )
    .frame(width: 224)
    .accessibilityLabel(Text(label))
  }
}

private struct SearchPickerControlled: View {
  @State private var value: String? = "next"

  var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      SearchPicker(
        items: searchPickerFrameworks,
        selection: $value,
        placeholder: "Select a framework",
        searchPlaceholder: "Search frameworks...",
        emptyText: "No framework found."
      )
      .frame(width: 224)
      .accessibilityLabel(Text("Framework"))
      Text(verbatim: "Selected: \(value ?? "none")")
        .textStyle(.sm)
        .foregroundStyle(Color.labelSecondary)
    }
  }
}
