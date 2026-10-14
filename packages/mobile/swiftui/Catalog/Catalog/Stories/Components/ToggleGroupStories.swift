import EsuissUI
import PhosphorSwift
import SwiftUI

enum ToggleGroupStories {
  static let group = StoryGroup(.components, "Toggle Group", stories: [
    Story("Default") {
      FormattingDemo()
    },
    Story("Outline") {
      FormattingDemo(initial: ["italic"], variant: .outline)
    },
    Story("Attached") {
      FormattingDemo(variant: .outline, spacing: 0)
    },
    Story("Sizes") {
      VStack(alignment: .leading, spacing: 12) {
        FormattingDemo(size: .sm)
        FormattingDemo()
        FormattingDemo(size: .lg)
      }
    },
    Story("Segmented") {
      SegmentedDemo()
    },
    Story("SegmentedVertical") {
      SegmentedDemo(orientation: .vertical)
        .fixedSize(horizontal: true, vertical: false)
    },
    Story("SegmentedMultiple") {
      FormattingDemo(initial: ["bold", "underline"], spacing: 0)
    },
    Story("SegmentedSizes") {
      VStack(alignment: .leading, spacing: 12) {
        SegmentedDemo(items: Array(segmentedViews.prefix(3)), size: .sm)
        SegmentedDemo(items: Array(segmentedViews.prefix(3)))
        SegmentedDemo(items: Array(segmentedViews.prefix(3)), size: .lg)
      }
    },
    Story("SingleSelection") {
      AlignmentDemo()
    },
    Story("Vertical") {
      FormattingDemo(variant: .outline, spacing: 0, orientation: .vertical)
        .fixedSize(horizontal: true, vertical: false)
    },
    Story("Disabled") {
      FormattingDemo()
        .disabled(true)
    },
  ])
}

private let segmentedViews = ["Day", "Week", "Month", "Year"]

private struct FormattingDemo: View {
  let variant: ToggleVariant
  let size: ToggleSize
  let spacing: Int
  let orientation: Axis

  @State private var value: Set<String>

  init(
    initial: Set<String> = ["bold"],
    variant: ToggleVariant = .default,
    size: ToggleSize = .default,
    spacing: Int = 2,
    orientation: Axis = .horizontal
  ) {
    self.variant = variant
    self.size = size
    self.spacing = spacing
    self.orientation = orientation
    _value = State(initialValue: initial)
  }

  var body: some View {
    ToggleGroup(selection: $value, variant: variant, size: size, spacing: spacing, orientation: orientation) {
      ToggleGroupItem(value: "bold") {
        Ph.textB.regular.frame(width: 16, height: 16)
      }
      .accessibilityLabel(Text("Toggle bold"))
      ToggleGroupItem(value: "italic") {
        Ph.textItalic.regular.frame(width: 16, height: 16)
      }
      .accessibilityLabel(Text("Toggle italic"))
      ToggleGroupItem(value: "underline") {
        Ph.textUnderline.regular.frame(width: 16, height: 16)
      }
      .accessibilityLabel(Text("Toggle underline"))
    }
  }
}

private struct AlignmentDemo: View {
  @State private var value: String? = "left"

  var body: some View {
    ToggleGroup(selection: $value, variant: .outline) {
      ToggleGroupItem(value: "left") {
        Ph.textAlignLeft.regular.frame(width: 16, height: 16)
      }
      .accessibilityLabel(Text("Align left"))
      ToggleGroupItem(value: "center") {
        Ph.textAlignCenter.regular.frame(width: 16, height: 16)
      }
      .accessibilityLabel(Text("Align center"))
      ToggleGroupItem(value: "right") {
        Ph.textAlignRight.regular.frame(width: 16, height: 16)
      }
      .accessibilityLabel(Text("Align right"))
    }
  }
}

private struct SegmentedDemo: View {
  var items: [String] = segmentedViews
  var size: ToggleSize = .default
  var orientation: Axis = .horizontal

  @State private var value: String? = "Week"

  var body: some View {
    ToggleGroup(selection: $value, size: size, spacing: 0, orientation: orientation) {
      ForEach(items, id: \.self) { item in
        ToggleGroupItem(value: item) {
          Text(verbatim: item)
        }
      }
    }
    .accessibilityLabel(Text("Calendar view"))
  }
}
