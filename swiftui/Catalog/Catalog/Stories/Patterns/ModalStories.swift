import EsuissUI
import SwiftUI

enum ModalStories {
  static let group = StoryGroup(.patterns, "Modal", stories: [
    Story("Default") {
      ModalDemo(open: false)
    },
    Story("OpenByDefault") {
      ModalDemo(open: true)
    },
  ])
}

private struct ModalDemo: View {
  @State private var open: Bool

  init(open: Bool) {
    _open = State(initialValue: open)
  }

  var body: some View {
    Button("Edit profile") { open = true }
      .buttonStyle(.variant(.outline))
      .modal(isPresented: $open) {
        ModalDemoContent()
      }
  }
}

private struct ModalDemoContent: View {
  @State private var name = "Pedro Duarte"
  @State private var username = "@peduarte"

  var body: some View {
    ModalContent {
      ModalHeader {
        ModalTitle("Edit profile")
        ModalDescription("Make changes to your profile.")
      }
      ModalBody {
        VStack(spacing: 12) {
          TextField("Name", text: $name)
            .textFieldStyle(.input)
          TextField("Username", text: $username)
            .textFieldStyle(.input)
            .textInputAutocapitalization(.never)
        }
      }
      ModalFooter {
        ModalClose {
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
