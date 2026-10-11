import EsuissUI
import SwiftUI

enum BottomBarStories {
  static let group = StoryGroup(.components, "Bottom Bar", stories: [
    Story("Default", fullScreen: true) {
      BottomBarPage {
        BottomBar(separator: false) {
          BottomBarContent {
            Button("Continue") {}.buttonStyle(.variant(size: .lg, block: true))
          }
        }
      }
    },
    Story("WithSeparator", fullScreen: true) {
      BottomBarPage {
        BottomBar(separator: true) {
          BottomBarContent {
            Button("Place order") {}.buttonStyle(.variant(size: .lg, block: true))
          }
        }
      }
    },
    Story("TwoActions", fullScreen: true) {
      BottomBarPage {
        BottomBar(separator: true) {
          BottomBarContent {
            Button("Place order") {}.buttonStyle(.variant(size: .lg, block: true))
            Button("Save for later") {}.buttonStyle(.variant(.plain, size: .lg, block: true))
          }
        }
      }
    },
    Story("SideBySide", fullScreen: true) {
      BottomBarPage {
        BottomBar(separator: true) {
          BottomBarContent {
            HStack(spacing: 8) {
              Button("Back") {}.buttonStyle(.variant(.secondary, size: .lg, block: true))
              Button("Next") {}.buttonStyle(.variant(size: .lg, block: true))
            }
          }
        }
      }
    },
    Story("AboveKeyboard", fullScreen: true) {
      BottomBarKeyboardDemo()
    },
  ])
}

private struct BottomBarPage<Bar: View>: View {
  @ViewBuilder let bar: () -> Bar

  var body: some View {
    VStack(spacing: 0) {
      VStack(alignment: .leading, spacing: 8) {
        Text("Review order").textVariant(.h3)
        Text("2 items, delivery on Thursday.").textVariant(.muted)
      }
      .padding(16)
      .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
      bar()
    }
  }
}

private struct BottomBarKeyboardDemo: View {
  @State private var code = ""
  @FocusState private var focused: Bool

  var body: some View {
    VStack(spacing: 0) {
      VStack(alignment: .leading, spacing: 12) {
        Text("Promo code").textVariant(.h3)
        TextField("Promo code", text: $code, prompt: Text("Enter code"))
          .textFieldStyle(.input)
          .textInputAutocapitalization(.characters)
          .focused($focused)
      }
      .padding(16)
      .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
      BottomBar(separator: true) {
        BottomBarContent {
          Button("Apply") {}.buttonStyle(.variant(size: .lg, block: true))
        }
      }
    }
    .onAppear { focused = true }
  }
}
