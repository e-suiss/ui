import EsuissUI
import SwiftUI

enum ConfirmStories {
  static let group = StoryGroup(.patterns, "Confirm", stories: [
    Story("Default") {
      ConfirmDemo(open: false)
    },
    Story("OpenByDefault") {
      ConfirmDemo(open: true)
    },
  ])
}

private struct ConfirmDemo: View {
  @State private var open: Bool

  init(open: Bool) {
    _open = State(initialValue: open)
  }

  var body: some View {
    Button("Delete account") { open = true }
      .buttonStyle(.variant(.destructive))
      .confirm(isPresented: $open) {
        ConfirmContent {
          ConfirmHeader {
            ConfirmTitle("Delete your account?")
            ConfirmDescription("This permanently deletes your account and all of its data.")
          }
          ConfirmFooter {
            ConfirmCancel("Cancel")
            ConfirmAction("Delete Account", variant: .destructive)
          }
        }
      }
  }
}
