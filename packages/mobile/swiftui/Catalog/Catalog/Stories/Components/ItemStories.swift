import EsuissUI
import PhosphorSwift
import SwiftUI

enum ItemStories {
  static let group = StoryGroup(.components, "Item", stories: [
    Story("Default") {
      VStack(alignment: .leading, spacing: 16) {
        Item(.outline) {
          ItemContent {
            ItemTitle("Basic item")
            ItemDescription("A simple item with a title and a description.")
          }
          ItemActions {
            Button("Action") {}
              .buttonStyle(.variant(.outline, size: .sm))
          }
        }
        Item(.muted, size: .sm, action: {}) {
          ItemMedia(.icon) {
            Ph.shieldCheck.regular
          }
          ItemContent {
            ItemTitle("Your profile has been verified.")
          }
          ItemActions {
            ItemChevron()
          }
        }
        Item(.outline, size: .xs) {
          ItemHeader {
            ItemTitle("Header")
            Badge("New")
          }
          ItemContent {
            ItemDescription("Items can carry a header and a footer.")
          }
          ItemFooter {
            Text("Footer")
              .textStyle(.sm)
              .foregroundStyle(EsuissColor.mutedForeground)
          }
        }
      }
    },
    Story("InsetGroup") {
      ItemGroup(.inset) {
        Item(action: {}) {
          ItemMedia(.image) {
            ItemTile(icon: Ph.wifiHigh.regular, color: EsuissColor.primary)
          }
          ItemContent {
            ItemTitle("Wi-Fi")
          }
          ItemActions {
            Text("Home")
            ItemChevron()
          }
        }
        ItemSeparator()
        Item(action: {}) {
          ItemMedia(.image) {
            ItemTile(icon: Ph.bell.regular, color: EsuissColor.destructive)
          }
          ItemContent {
            ItemTitle("Notifications")
            ItemDescription("Banners, sounds, badges")
          }
          ItemActions {
            ItemChevron()
          }
        }
      }
    },
  ])
}

private struct ItemChevron: View {
  var body: some View {
    Ph.caretRight.regular
      .frame(width: 16, height: 16)
      .foregroundStyle(EsuissColor.mutedForeground)
  }
}

private struct ItemTile: View {
  let icon: Image
  let color: Color

  var body: some View {
    ZStack {
      color
      icon
        .frame(width: 20, height: 20)
        .foregroundStyle(EsuissColor.primaryForeground)
    }
  }
}
