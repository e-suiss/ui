import EsuissUI
import PhosphorSwift
import SwiftUI

enum ButtonStories {
  static let group = StoryGroup(.components, "Button", stories: [
    Story("Default") {
      Button("Button") {}
        .buttonStyle(.variant())
    },
    Story("Variants") {
      VStack(alignment: .leading, spacing: 12) {
        WideButton(title: "Default", variant: .default)
        WideButton(title: "Secondary", variant: .secondary)
        WideButton(title: "Tinted", variant: .tinted)
        WideButton(title: "Outline", variant: .outline)
        WideButton(title: "Ghost", variant: .ghost)
        WideButton(title: "Plain", variant: .plain)
        WideButton(title: "Destructive", variant: .destructive)
        WideButton(title: "Link", variant: .link)
        IconButton(icon: Ph.plus.regular, size: .icon, variant: .outline)
      }
    },
    Story("Sizes") {
      VStack(alignment: .leading, spacing: 12) {
        FlowRow {
          Button("Extra small") {}.buttonStyle(.variant(size: .xs))
          Button("Small") {}.buttonStyle(.variant(size: .sm))
          Button("Default") {}.buttonStyle(.variant())
          Button("Large") {}.buttonStyle(.variant(size: .lg))
          Button("Extra large") {}.buttonStyle(.variant(size: .xl))
        }
        FlowRow {
          IconButton(icon: Ph.plus.regular, size: .iconXs, variant: .secondary)
          IconButton(icon: Ph.plus.regular, size: .iconSm, variant: .secondary)
          IconButton(icon: Ph.plus.regular, size: .icon, variant: .secondary)
          IconButton(icon: Ph.plus.regular, size: .iconLg, variant: .secondary)
          IconButton(icon: Ph.plus.regular, size: .iconXl, variant: .secondary)
        }
      }
    },
    Story("WithIcon") {
      VStack(alignment: .leading, spacing: 12) {
        Button {} label: {
          Label {
            Text("Download")
          } icon: {
            Ph.downloadSimple.regular
          }
        }
        .buttonStyle(.variant())
        Button {} label: {
          HStack(spacing: 6) {
            Text("Continue")
            Ph.arrowRight.regular
              .frame(width: VariantButtonStyle.Size.default.iconSize, height: VariantButtonStyle.Size.default.iconSize)
          }
        }
        .buttonStyle(.variant(.outline))
        Button {} label: {
          Label {
            Text("Delete")
          } icon: {
            Ph.trash.regular
          }
        }
        .buttonStyle(.variant(.destructive))
      }
    },
    Story("Disabled") {
      VStack(alignment: .leading, spacing: 12) {
        Button("Default") {}.buttonStyle(.variant())
        Button("Secondary") {}.buttonStyle(.variant(.secondary))
        Button("Tinted") {}.buttonStyle(.variant(.tinted))
        Button("Outline") {}.buttonStyle(.variant(.outline))
        Button("Destructive") {}.buttonStyle(.variant(.destructive))
      }
      .disabled(true)
    },
    Story("Block") {
      VStack(spacing: 12) {
        Button("Continue") {}.buttonStyle(.variant(size: .lg, block: true))
        Button("Not now") {}.buttonStyle(.variant(.secondary, size: .lg, block: true))
        Button("Learn more") {}.buttonStyle(.variant(.tinted, block: true))
      }
    },
  ])
}

private struct WideButton: View {
  let title: LocalizedStringKey
  let variant: VariantButtonStyle.Variant

  var body: some View {
    Button {} label: {
      Text(title).frame(maxWidth: .infinity)
    }
    .buttonStyle(.variant(variant))
  }
}

private struct IconButton<Icon: View>: View {
  let icon: Icon
  let size: VariantButtonStyle.Size
  let variant: VariantButtonStyle.Variant

  var body: some View {
    Button {} label: {
      icon.frame(width: size.iconSize, height: size.iconSize)
    }
    .buttonStyle(.variant(variant, size: size))
    .accessibilityLabel(Text("Add"))
  }
}
