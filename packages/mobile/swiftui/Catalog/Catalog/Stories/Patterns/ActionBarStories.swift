import EsuissUI
import PhosphorSwift
import SwiftUI

enum ActionBarStories {
  static let group = StoryGroup(.patterns, "Action Bar", stories: [
    Story("Default") {
      ActionBarDemo {
        ActionBarFileMenu()
        ActionBarEditMenu()
        ActionBarViewMenu()
      }
    },
    Story("Overflow") {
      ActionBarDemo(open: true) {
        ActionBarFileMenu()
        ActionBarEditMenu()
        ActionBarViewMenu()
      }
    },
    Story("WithIcons") {
      ActionBarDemo {
        ActionBarFileMenu()
        ActionBarEditMenu(withIcons: true)
        ActionBarViewMenu()
      }
    },
    Story("OpenByDefault") {
      ActionBarOpenFileDemo()
    },
    Story("NotDismissible") {
      ActionBarDemo(dismissible: false) {
        ActionBarFileMenu()
        ActionBarEditMenu()
      }
    },
    Story("CustomLabels") {
      ActionBarDemo(moreLabel: "Document actions", cancelLabel: "Close") {
        ActionBarFileMenu()
        ActionBarEditMenu()
      }
    },
  ])
}

private struct ActionBarDemo<Content: View>: View {
  var dismissible = true
  var moreLabel: LocalizedStringKey = "More actions"
  var cancelLabel: LocalizedStringKey = "Cancel"
  let content: Content

  @State private var open: Bool

  init(
    open: Bool = false,
    dismissible: Bool = true,
    moreLabel: LocalizedStringKey = "More actions",
    cancelLabel: LocalizedStringKey = "Cancel",
    @ViewBuilder content: () -> Content
  ) {
    _open = State(initialValue: open)
    self.dismissible = dismissible
    self.moreLabel = moreLabel
    self.cancelLabel = cancelLabel
    self.content = content()
  }

  var body: some View {
    ActionBar(isPresented: $open, dismissible: dismissible, moreLabel: moreLabel, cancelLabel: cancelLabel) {
      content
    }
  }
}

private struct ActionBarOpenFileDemo: View {
  @State private var file = true

  var body: some View {
    ActionBar {
      ActionBarFileMenu(isPresented: $file)
      ActionBarEditMenu()
      ActionBarViewMenu()
    }
  }
}

private struct ActionBarFileMenu: View {
  var isPresented: Binding<Bool>?

  var body: some View {
    ActionBarMenu("File", isPresented: isPresented) {
      ActionBarItem("New tab") {}
      ActionBarItem("New window") {}
      ActionBarItem("New incognito window") {}.disabled(true)
      ActionBarSeparator()
      ActionBarItem("Print") {}
    }
  }
}

private struct ActionBarEditMenu: View {
  var withIcons = false

  var body: some View {
    ActionBarMenu("Edit") {
      if withIcons {
        ActionBarItem("Cut", icon: Ph.scissors.regular) {}
        ActionBarItem("Copy", icon: Ph.copy.regular) {}
        ActionBarItem("Paste", icon: Ph.clipboardText.regular) {}
        ActionBarSeparator()
        ActionBarItem("Delete", icon: Ph.trash.regular, variant: .destructive) {}
      } else {
        ActionBarItem("Cut") {}
        ActionBarItem("Copy") {}
        ActionBarItem("Paste") {}
        ActionBarSeparator()
        ActionBarItem("Delete", variant: .destructive) {}
      }
    }
  }
}

private struct ActionBarViewMenu: View {
  var body: some View {
    ActionBarMenu("View") {
      ActionBarLabel("Appearance")
      ActionBarItem("Zoom in") {}
      ActionBarItem("Zoom out") {}
      ActionBarItem("Actual size") {}
    }
  }
}
