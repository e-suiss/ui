import EsuissUI
import SwiftUI

enum DialogStories {
  static let group = StoryGroup(.components, "Dialog", stories: [
    Story("Default") {
      DialogEditProfile()
    },
    Story("OpenByDefault") {
      DialogEditProfile(open: true)
    },
    Story("Destructive") {
      DialogDestructive()
    },
    Story("WithoutCloseButton") {
      DialogWithoutCloseButton()
    },
    Story("WithCloseLabel") {
      DialogWithCloseLabel()
    },
  ])
}

private struct DialogEditProfile: View {
  @State private var open: Bool

  init(open: Bool = false) {
    _open = State(initialValue: open)
  }

  var body: some View {
    Button("Edit profile") { open = true }
      .buttonStyle(.variant(.outline))
      .dialog(isPresented: $open) {
        DialogEditProfileContent()
      }
  }
}

private struct DialogEditProfileContent: View {
  @State private var name = "Pedro Duarte"
  @State private var username = "@peduarte"

  var body: some View {
    DialogContent {
      DialogHeader {
        DialogTitle("Edit profile")
        DialogDescription("Make changes to your profile here. Tap save when you're done.")
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
      DialogFooter {
        DialogClose {
          Text("Cancel").frame(maxWidth: .infinity)
        }
        .buttonStyle(.variant(.secondary))
        Button {} label: {
          Text("Save changes").frame(maxWidth: .infinity)
        }
        .buttonStyle(.variant())
      }
    }
  }
}

private struct DialogDestructive: View {
  @State private var open = false

  var body: some View {
    Button("Delete account") { open = true }
      .buttonStyle(.variant(.destructive))
      .dialog(isPresented: $open) {
        DialogContent {
          DialogHeader {
            DialogTitle("Delete account")
            DialogDescription("This will permanently delete your account and all of its data.")
          }
          DialogFooter {
            DialogClose {
              Text("Cancel").frame(maxWidth: .infinity)
            }
            .buttonStyle(.variant(.secondary))
            DialogClose {
              Text("Delete").frame(maxWidth: .infinity)
            }
            .buttonStyle(.variant(.destructive))
          }
        }
      }
  }
}

private struct DialogWithoutCloseButton: View {
  @State private var open = false

  var body: some View {
    Button("Show terms") { open = true }
      .buttonStyle(.variant(.outline))
      .dialog(isPresented: $open) {
        DialogContent(showCloseButton: false) {
          DialogHeader {
            DialogTitle("Terms updated")
            DialogDescription("We have updated our terms of service. Please review the changes before continuing.")
          }
          DialogFooter(showCloseButton: true) {
            Button {} label: {
              Text("Accept").frame(maxWidth: .infinity)
            }
            .buttonStyle(.variant())
          }
        }
      }
  }
}

private struct DialogWithCloseLabel: View {
  @State private var open = false

  var body: some View {
    Button("Open settings") { open = true }
      .buttonStyle(.variant(.outline))
      .dialog(isPresented: $open) {
        DialogContent(closeLabel: "Done") {
          DialogHeader {
            DialogTitle("Notification settings")
            DialogDescription("Choose how you want to be notified about activity in your workspace.")
          }
        }
      }
  }
}
