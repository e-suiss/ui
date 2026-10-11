import EsuissUI
import SwiftUI

enum AlertSheetStories {
  static let group = StoryGroup(.components, "Alert Sheet", stories: [
    Story("Default") {
      AlertSheetDemo(title: "Show sheet") {
        AlertSheetBody()
      }
    },
    Story("OpenByDefault") {
      AlertSheetDemo(title: "Show sheet", open: true) {
        AlertSheetBody()
      }
    },
    Story("NotDismissible") {
      AlertSheetDemo(title: "Sign out", dismissible: false) {
        AlertSheetContent {
          AlertSheetGroup {
            AlertSheetHeader {
              AlertSheetTitle("Sign out of all devices?")
            }
            AlertSheetAction("Sign Out", variant: .destructive)
            AlertSheetAction("Keep Signed In Here")
              .disabled(true)
          }
          AlertSheetCancel("Cancel")
        }
      }
    },
  ])
}

private struct AlertSheetDemo<Body: View>: View {
  let title: LocalizedStringKey
  let dismissible: Bool
  let content: () -> Body

  @State private var open: Bool

  init(
    title: LocalizedStringKey,
    open: Bool = false,
    dismissible: Bool = true,
    @ViewBuilder content: @escaping () -> Body
  ) {
    self.title = title
    self.dismissible = dismissible
    self.content = content
    _open = State(initialValue: open)
  }

  var body: some View {
    Button(title) { open = true }
      .buttonStyle(.variant(.outline))
      .alertSheet(isPresented: $open, dismissible: dismissible, content: content)
  }
}

private struct AlertSheetBody: View {
  var body: some View {
    AlertSheetContent {
      AlertSheetGroup {
        AlertSheetHeader {
          AlertSheetTitle("Delete this photo?")
          AlertSheetDescription("This photo will be deleted from all of your devices.")
        }
        AlertSheetAction("Save to Files")
        AlertSheetAction("Delete Photo", variant: .destructive)
      }
      AlertSheetCancel("Cancel")
    }
  }
}
