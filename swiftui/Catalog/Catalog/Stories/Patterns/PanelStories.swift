import EsuissUI
import SwiftUI

enum PanelStories {
  static let group = StoryGroup(.patterns, "Panel", stories: [
    Story("Default") {
      PanelDemo(open: false)
    },
    Story("OpenByDefault") {
      PanelDemo(open: true)
    },
  ])
}

private struct PanelDemo: View {
  @State private var open: Bool

  init(open: Bool) {
    _open = State(initialValue: open)
  }

  var body: some View {
    Button("Filters") { open = true }
      .buttonStyle(.variant(.outline))
      .panel(isPresented: $open) {
        PanelContent {
          PanelHeader {
            PanelTitle("Filters")
            PanelDescription("Narrow down the results.")
          }
          PanelBody {
            Text("Status, owner and date filters go here.")
              .textStyle(.sm)
              .foregroundStyle(Color.labelSecondary)
          }
          PanelFooter {
            Button {} label: {
              Text("Apply").frame(maxWidth: .infinity)
            }
            .buttonStyle(.variant())
            PanelClose {
              Text("Reset").frame(maxWidth: .infinity)
            }
            .buttonStyle(.variant(.secondary))
          }
        }
      }
  }
}
