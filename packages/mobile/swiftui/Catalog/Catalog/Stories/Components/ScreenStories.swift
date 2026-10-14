import EsuissUI
import SwiftUI

enum ScreenStories {
  static let group = StoryGroup(.components, "Screen", stories: [
    Story("Default", fullScreen: true) {
      Screen {
        ScreenContent(scroll: false) {
          Text("Account").textVariant(.h2)
          Text("The screen pads every safe-area edge and sets the status bar style from the color scheme.")
            .textVariant(.muted)
          ScreenRows()
        }
      }
    },
    Story("Secondary", fullScreen: true) {
      Screen(background: .surfaceSecondary) {
        ScreenContent(scroll: false) {
          Text("Settings").textVariant(.h2)
          ScreenRows(labels: ["General", "Privacy", "Notifications"], background: .surface)
        }
      }
    },
    Story("Scrollable", fullScreen: true) {
      Screen {
        ScreenContent {
          Text("Long content").textVariant(.h2)
          ScreenRows(labels: (1...24).map { "Row \($0)" })
        }
      }
    },
    Story("TopEdgeOnly", fullScreen: true) {
      Screen(edges: .top) {
        ScreenContent(scroll: false) {
          Text("Top edge only").textVariant(.h3)
          Text("The bottom, left and right edges are not padded.")
            .textVariant(.muted)
        }
        .background(Color.surfaceSecondary)
      }
    },
    Story("WithBottomBar", fullScreen: true) {
      ScreenBottomBarDemo()
    },
  ])
}

private struct ScreenRows: View {
  var labels: [String] = (1...4).map { "Row \($0)" }
  var background: Color = .surfaceSecondary

  var body: some View {
    VStack(spacing: 0) {
      ForEach(Array(labels.enumerated()), id: \.offset) { index, label in
        Text(verbatim: label)
          .textVariant(.default)
          .frame(maxWidth: .infinity, alignment: .leading)
          .padding(.horizontal, 16)
          .padding(.vertical, 12)
          .overlay(alignment: .top) {
            if index > 0 {
              Color.separator.frame(height: 1)
            }
          }
      }
    }
    .background(background)
    .clipShape(RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
  }
}

private struct ScreenBottomBarDemo: View {
  @State private var email = ""

  var body: some View {
    Screen {
      ScreenContent {
        Text("Your email").textVariant(.h2)
        Text("We will send a code to this address.").textVariant(.muted)
        TextField(String("name@example.com"), text: $email)
          .textFieldStyle(.input)
          .keyboardType(.emailAddress)
          .textInputAutocapitalization(.never)
      }
      BottomBar(separator: true) {
        BottomBarContent {
          Button {} label: {
            Text("Continue")
          }
          .buttonStyle(.variant(size: .lg, block: true))
        }
      }
    }
  }
}
