import EsuissUI
import SwiftUI

enum ActionMenuStories {
  static let group = StoryGroup(.patterns, "Action Menu", stories: [
    Story("Default") {
      ActionMenuDemo(open: false)
    },
    Story("OpenByDefault") {
      ActionMenuDemo(open: true)
    },
  ])
}

private struct ActionMenuDemo: View {
  @State private var open: Bool

  init(open: Bool) {
    _open = State(initialValue: open)
  }

  var body: some View {
    ActionMenu(isPresented: $open) {
      ActionMenuLabel("Project")
      ActionMenuItem("Rename") {}
      ActionMenuItem("Duplicate") {}
      ActionMenuItem("Move") {}.disabled(true)
      ActionMenuSeparator()
      ActionMenuItem("Delete", variant: .destructive) {}
    } label: {
      Text("Options")
    }
    .buttonStyle(.variant(.outline))
  }
}
