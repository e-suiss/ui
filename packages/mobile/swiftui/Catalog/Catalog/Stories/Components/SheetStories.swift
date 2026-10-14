import EsuissUI
import SwiftUI

enum SheetStories {
  static let group = StoryGroup(.components, "Sheet", stories: [
    Story("Default") {
      ProfileSheet(title: "Open", side: .trailing)
    },
    Story("OpenByDefault") {
      ProfileSheet(title: "Open", side: .trailing, open: true)
    },
    Story("Sides") {
      VStack(alignment: .leading, spacing: 12) {
        ProfileSheet(title: "Top", side: .top)
        ProfileSheet(title: "Right", side: .trailing)
        ProfileSheet(title: "Bottom", side: .bottom)
        ProfileSheet(title: "Left", side: .leading)
      }
    },
    Story("WithCloseLabel") {
      CloseLabelSheet()
    },
  ])
}

private struct ProfileSheet: View {
  let title: LocalizedStringKey
  let side: Edge

  @State private var open: Bool

  init(title: LocalizedStringKey, side: Edge, open: Bool = false) {
    self.title = title
    self.side = side
    _open = State(initialValue: open)
  }

  var body: some View {
    Button(title) { open = true }
      .buttonStyle(.variant(.outline))
      .sheet(isPresented: $open, side: side) {
        ProfileContent()
      }
  }
}

private struct ProfileContent: View {
  @State private var name = "Pedro Duarte"
  @State private var username = "@peduarte"

  var body: some View {
    SheetContent {
      SheetHeader {
        SheetTitle("Edit profile")
        SheetDescription("Make changes to your profile here. Tap save when you're done.")
      }
      VStack(alignment: .leading, spacing: 16) {
        VStack(alignment: .leading, spacing: 8) {
          FieldLabel("Name")
            .accessibilityHidden(true)
          TextField("Name", text: $name)
            .textFieldStyle(.input)
        }
        VStack(alignment: .leading, spacing: 8) {
          FieldLabel("Username")
            .accessibilityHidden(true)
          TextField("Username", text: $username)
            .textFieldStyle(.input)
            .textInputAutocapitalization(.never)
        }
      }
      .padding(.horizontal, 24)
      SheetFooter {
        Button {} label: {
          Text("Save changes").frame(maxWidth: .infinity)
        }
        .buttonStyle(.variant())
        SheetClose {
          Text("Close").frame(maxWidth: .infinity)
        }
        .buttonStyle(.variant(.secondary))
      }
    }
  }
}

private struct CloseLabelSheet: View {
  @State private var open = false

  var body: some View {
    Button("Open with label") { open = true }
      .buttonStyle(.variant(.outline))
      .sheet(isPresented: $open, side: .bottom) {
        SheetContent(closeLabel: "Done") {
          SheetHeader {
            SheetTitle("Notifications")
            SheetDescription("Choose what you want to be notified about.")
          }
        }
      }
  }
}
