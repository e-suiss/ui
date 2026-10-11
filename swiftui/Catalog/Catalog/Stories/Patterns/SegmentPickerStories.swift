import EsuissUI
import PhosphorSwift
import SwiftUI

enum SegmentPickerStories {
  static let group = StoryGroup(.patterns, "Segment Picker", stories: [
    Story("Default") {
      SegmentPickerDemo(value: "week")
    },
    Story("WithoutValue") {
      SegmentPickerDemo(value: nil)
    },
    Story("Sizes") {
      VStack(alignment: .leading, spacing: 12) {
        SegmentPickerDemo(value: "week", size: .sm)
        SegmentPickerDemo(value: "week")
      }
    },
    Story("WithIcons") {
      SegmentPickerViews(label: "View", showsText: false)
    },
    Story("WithIconsAndText") {
      SegmentPickerViews(label: "View", showsText: true)
    },
    Story("DisabledItem") {
      SegmentPickerDemo(value: "week", disablesYear: true)
    },
    Story("Disabled") {
      SegmentPickerDemo(value: "week")
        .disabled(true)
    },
    Story("Controlled") {
      SegmentPickerControlled()
    },
  ])
}

private struct SegmentPickerPeriods: View {
  var disablesYear = false

  var body: some View {
    SegmentPickerItem("Day", value: "day")
    SegmentPickerItem("Week", value: "week")
    SegmentPickerItem("Month", value: "month")
    SegmentPickerItem("Year", value: "year")
      .disabled(disablesYear)
  }
}

private struct SegmentPickerDemo: View {
  var size: ToggleSize = .default
  var disablesYear = false

  @State private var value: String?

  init(value: String?, size: ToggleSize = .default, disablesYear: Bool = false) {
    _value = State(initialValue: value)
    self.size = size
    self.disablesYear = disablesYear
  }

  var body: some View {
    SegmentPicker(selection: $value, size: size) {
      SegmentPickerPeriods(disablesYear: disablesYear)
    }
    .frame(width: 160)
    .accessibilityLabel(Text("Period"))
  }
}

private struct SegmentPickerViews: View {
  let label: LocalizedStringKey
  let showsText: Bool

  @State private var value: String? = "grid"

  var body: some View {
    SegmentPicker(selection: $value) {
      SegmentPickerItem(value: "list", label: "List") {
        icon(Ph.list.regular, title: "List")
      }
      SegmentPickerItem(value: "grid", label: "Grid") {
        icon(Ph.squaresFour.regular, title: "Grid")
      }
      SegmentPickerItem(value: "table", label: "Table") {
        icon(Ph.table.regular, title: "Table")
      }
    }
    .frame(width: 160)
    .accessibilityLabel(Text(label))
  }

  @ViewBuilder
  private func icon(_ image: some View, title: LocalizedStringKey) -> some View {
    HStack(spacing: 6) {
      image.frame(width: 16, height: 16)
      if showsText {
        Text(title)
      }
    }
  }
}

private struct SegmentPickerControlled: View {
  @State private var value: String? = "month"

  var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      SegmentPicker(selection: $value) {
        SegmentPickerPeriods()
      }
      .frame(width: 160)
      .accessibilityLabel(Text("Period"))
      Text(verbatim: "Selected: \(value ?? "")")
        .textStyle(.sm)
        .foregroundStyle(Color.labelSecondary)
    }
  }
}
