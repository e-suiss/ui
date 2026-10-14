import EsuissUI
import PhosphorSwift
import SwiftUI

enum ChipStories {
  static let group = StoryGroup(.components, "Chip", stories: [
    Story("Default") {
      ChipToggleDemo(title: "Open now", initial: false)
    },
    Story("States") {
      VStack(alignment: .leading, spacing: 16) {
        ChipSection(label: "Unselected") {
          ChipToggleDemo(title: "Open now", initial: false)
        }
        ChipSection(label: "Selected") {
          ChipToggleDemo(title: "Open now", initial: true)
        }
        ChipSection(label: "Disabled") {
          HStack(spacing: 8) {
            Chip("Open now", isSelected: .constant(false))
            Chip("Open now", isSelected: .constant(true))
          }
          .disabled(true)
        }
      }
    },
    Story("Sizes") {
      VStack(alignment: .leading, spacing: 16) {
        ChipSection(label: "Default") {
          HStack(spacing: 8) {
            ChipToggleDemo(title: "Top rated", initial: false, icon: Ph.star.regular)
            ChipToggleDemo(title: "Top rated", initial: true, icon: Ph.star.regular)
            ChipToggleDemo(title: "Nearby", initial: false, onRemove: {})
          }
        }
        ChipSection(label: "Small") {
          HStack(spacing: 8) {
            ChipToggleDemo(title: "Top rated", initial: false, size: .sm, icon: Ph.star.regular)
            ChipToggleDemo(title: "Top rated", initial: true, size: .sm, icon: Ph.star.regular)
            ChipToggleDemo(title: "Nearby", initial: false, size: .sm, onRemove: {})
          }
        }
      }
    },
    Story("WithIcon") {
      FlowRow(spacing: 8) {
        ChipToggleDemo(title: "Coffee", initial: false, icon: Ph.coffee.regular)
        ChipToggleDemo(title: "Restaurants", initial: true, icon: Ph.forkKnife.regular)
        ChipToggleDemo(title: "Nearby", initial: false, icon: Ph.mapPin.regular)
        ChipToggleDemo(title: "Tonight", initial: false, icon: Ph.calendarBlank.regular)
          .disabled(true)
      }
    },
    Story("Removable") {
      ChipRemovableDemo()
    },
    Story("Controlled") {
      ChipControlledDemo()
    },
    Story("GroupSingle") {
      ChipGroupSingleDemo()
    },
    Story("GroupMultiple") {
      ChipGroupMultipleDemo()
    },
    Story("GroupUncontrolled") {
      ChipGroupUncontrolledDemo()
    },
    Story("GroupScrollable") {
      ChipGroupScrollableDemo()
    },
    Story("GroupDisabled") {
      ChipGroupDisabledDemo()
    },
  ])
}

private struct ChipCategory: Hashable {
  let value: String
  let label: String
}

private let chipCategories = [
  ChipCategory(value: "all", label: "All"),
  ChipCategory(value: "coffee", label: "Coffee"),
  ChipCategory(value: "lunch", label: "Lunch"),
  ChipCategory(value: "dinner", label: "Dinner"),
  ChipCategory(value: "bakery", label: "Bakery"),
  ChipCategory(value: "bars", label: "Bars"),
  ChipCategory(value: "desserts", label: "Desserts"),
]

private struct ChipSection<Content: View>: View {
  let label: LocalizedStringKey
  @ViewBuilder let content: () -> Content

  var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      Text(label).textVariant(.muted)
      content()
    }
  }
}

private struct ChipToggleDemo: View {
  let title: LocalizedStringKey
  var size: ChipSize?
  var icon: Image?
  var onRemove: (() -> Void)?

  @State private var selected: Bool

  init(
    title: LocalizedStringKey,
    initial: Bool,
    size: ChipSize? = nil,
    icon: Image? = nil,
    onRemove: (() -> Void)? = nil
  ) {
    self.title = title
    self.size = size
    self.icon = icon
    self.onRemove = onRemove
    _selected = State(initialValue: initial)
  }

  var body: some View {
    Chip(title, isSelected: $selected, size: size, icon: icon, onRemove: onRemove)
  }
}

private struct ChipRemovableDemo: View {
  @State private var tags = ["Design", "Mobile", "Accessibility", "Motion"]
  @State private var selected: Set<String> = []

  var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      FlowRow(spacing: 8) {
        ForEach(tags, id: \.self) { tag in
          Chip(isSelected: binding(tag), onRemove: {
            withAnimation { tags.removeAll { $0 == tag } }
          }) {
            Text(verbatim: tag)
          }
        }
      }
      Text("\(tags.count) tags").textVariant(.muted)
    }
  }

  private func binding(_ tag: String) -> Binding<Bool> {
    Binding(
      get: { selected.contains(tag) },
      set: { isOn in
        if isOn { selected.insert(tag) } else { selected.remove(tag) }
      }
    )
  }
}

private struct ChipControlledDemo: View {
  @State private var selected = true

  var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      Chip("Free delivery", isSelected: $selected)
      Text(selected ? "Selected" : "Not selected").textVariant(.muted)
    }
  }
}

private struct ChipGroupSingleDemo: View {
  @State private var value: String? = "all"

  var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      ChipGroup(selection: $value) {
        ForEach(chipCategories.prefix(4), id: \.value) { category in
          Chip(value: category.value) { Text(verbatim: category.label) }
        }
      }
      Text("Selected: \(value ?? "none")").textVariant(.muted)
    }
  }
}

private struct ChipGroupMultipleDemo: View {
  @State private var value: Set<String> = ["coffee", "bakery"]

  var body: some View {
    let selected = chipCategories.map(\.value).filter { value.contains($0) }
    VStack(alignment: .leading, spacing: 12) {
      ChipGroup(selection: $value) {
        ForEach(chipCategories.dropFirst(), id: \.value) { category in
          Chip(value: category.value) { Text(verbatim: category.label) }
        }
      }
      Text("Selected: \(selected.isEmpty ? "none" : selected.joined(separator: ", "))").textVariant(.muted)
    }
  }
}

private struct ChipGroupUncontrolledDemo: View {
  @State private var value: Set<String> = ["lunch"]

  var body: some View {
    ChipGroup(selection: $value, size: .sm) {
      ForEach(chipCategories.dropFirst(), id: \.value) { category in
        Chip(value: category.value) { Text(verbatim: category.label) }
      }
    }
  }
}

private struct ChipGroupScrollableDemo: View {
  @State private var value: String? = "all"

  var body: some View {
    ChipGroup(selection: $value, scrollable: true) {
      ForEach(chipCategories, id: \.value) { category in
        Chip(value: category.value) { Text(verbatim: category.label) }
      }
    }
    .contentMargins(.horizontal, 16, for: .scrollContent)
    .padding(.horizontal, -16)
  }
}

private struct ChipGroupDisabledDemo: View {
  @State private var value: String? = "coffee"

  var body: some View {
    ChipGroup(selection: $value) {
      ForEach(chipCategories[1..<4], id: \.value) { category in
        Chip(value: category.value) { Text(verbatim: category.label) }
      }
    }
    .disabled(true)
  }
}
