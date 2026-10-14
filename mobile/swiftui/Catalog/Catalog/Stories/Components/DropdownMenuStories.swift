import EsuissUI
import PhosphorSwift
import SwiftUI

enum DropdownMenuStories {
  static let group = StoryGroup(.components, "Dropdown Menu", stories: [
    Story("Default") {
      DropdownMenuAccount()
    },
    Story("Checkboxes") {
      DropdownMenuCheckboxesDemo()
    },
    Story("RadioGroup") {
      DropdownMenuRadioGroupDemo()
    },
    Story("Inset") {
      DropdownMenu {
        DropdownMenuLabel("Actions", inset: true)
        DropdownMenuItem("Copy", inset: true) {}
        DropdownMenuItem("Paste", inset: true) {}
        DropdownMenuSeparator()
        DropdownMenuItem("Delete", variant: .destructive, inset: true) {}
      } label: {
        Text("Open menu")
      }
      .buttonStyle(.variant(.outline))
    },
    Story("OpenByDefault") {
      DropdownMenuAccount(open: true)
    },
  ])
}

private struct DropdownMenuAccount: View {
  @State private var open: Bool

  init(open: Bool = false) {
    _open = State(initialValue: open)
  }

  var body: some View {
    DropdownMenu(isPresented: $open) {
      DropdownMenuLabel("My account")
      DropdownMenuGroup {
        DropdownMenuItem("Profile", icon: Ph.user.regular) {}
        DropdownMenuItem("Billing", icon: Ph.creditCard.regular) {}
        DropdownMenuItem("Settings", icon: Ph.gear.regular) {}
      }
      DropdownMenuSeparator()
      DropdownMenuSub("Invite users", icon: Ph.userPlus.regular) {
        DropdownMenuItem("Email", icon: Ph.envelope.regular) {}
        DropdownMenuItem("Message", icon: Ph.chatCircle.regular) {}
      }
      DropdownMenuSeparator()
      DropdownMenuItem("Log out", icon: Ph.signOut.regular, variant: .destructive) {}
    } label: {
      Text("Open menu")
    }
    .buttonStyle(.variant(.outline))
  }
}

private struct DropdownMenuCheckboxesDemo: View {
  @State private var statusBar = true
  @State private var activityBar = false
  @State private var panel = false

  var body: some View {
    DropdownMenu {
      DropdownMenuLabel("Appearance")
      DropdownMenuSeparator()
      DropdownMenuCheckboxItem("Status bar", isOn: $statusBar)
      DropdownMenuCheckboxItem("Activity bar", isOn: $activityBar)
        .disabled(true)
      DropdownMenuCheckboxItem("Panel", isOn: $panel)
    } label: {
      Text("View")
    }
    .buttonStyle(.variant(.outline))
  }
}

private struct DropdownMenuRadioGroupDemo: View {
  @State private var position = "bottom"

  var body: some View {
    DropdownMenu {
      DropdownMenuLabel("Panel position")
      DropdownMenuSeparator()
      DropdownMenuRadioGroup(selection: $position) {
        DropdownMenuRadioItem("Top", value: "top")
        DropdownMenuRadioItem("Bottom", value: "bottom")
        DropdownMenuRadioItem("Right", value: "right")
      }
    } label: {
      Text("Panel position")
    }
    .buttonStyle(.variant(.outline))
  }
}
