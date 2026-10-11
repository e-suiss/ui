import EsuissUI
import PhosphorSwift
import SwiftUI

enum ToggleStories {
  static let group = StoryGroup(.components, "Toggle", stories: [
    Story("Default") {
      ToggleDemo(label: "Toggle bold") { Ph.textB.regular }
    },
    Story("Pressed") {
      ToggleDemo(initial: true, label: "Toggle bold") { Ph.textB.regular }
    },
    Story("Variants") {
      HStack(spacing: 8) {
        ToggleDemo(label: "Toggle italic") { Ph.textItalic.regular }
        ToggleDemo(variant: .outline, label: "Toggle italic") { Ph.textItalic.regular }
      }
    },
    Story("Sizes") {
      HStack(spacing: 8) {
        ToggleDemo(variant: .outline, size: .sm, label: "Small") { Ph.textB.regular }
        ToggleDemo(variant: .outline, label: "Default") { Ph.textB.regular }
        ToggleDemo(variant: .outline, size: .lg, label: "Large") { Ph.textB.regular }
      }
    },
    Story("WithText") {
      WithTextDemo()
    },
    Story("Disabled") {
      HStack(spacing: 8) {
        ToggleDemo(label: "Toggle bold") { Ph.textB.regular }
        ToggleDemo(initial: true, variant: .outline, label: "Toggle italic") { Ph.textItalic.regular }
      }
      .disabled(true)
    },
  ])
}

private struct ToggleDemo<Icon: View>: View {
  let variant: ToggleVariant
  let size: ToggleSize
  let label: LocalizedStringKey
  let icon: Icon

  @State private var isOn: Bool

  init(
    initial: Bool = false,
    variant: ToggleVariant = .default,
    size: ToggleSize = .default,
    label: LocalizedStringKey,
    @ViewBuilder icon: () -> Icon
  ) {
    self.variant = variant
    self.size = size
    self.label = label
    self.icon = icon()
    _isOn = State(initialValue: initial)
  }

  var body: some View {
    Toggle(isOn: $isOn) {
      icon.frame(width: 16, height: 16)
    }
    .toggleStyle(.variant(variant, size: size))
    .accessibilityLabel(Text(label))
  }
}

private struct WithTextDemo: View {
  @State private var isOn = false

  var body: some View {
    Toggle(isOn: $isOn) {
      Label {
        Text("Bookmark")
      } icon: {
        Ph.bookmarkSimple.regular
      }
    }
    .toggleStyle(.variant(.outline))
  }
}
