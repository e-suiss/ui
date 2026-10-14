import EsuissUI
import PhosphorSwift
import SwiftUI

enum ButtonGroupStories {
  static let group = StoryGroup(.components, "Button Group", stories: [
    Story("Default") {
      ButtonGroup {
        ButtonGroup {
          ButtonGroupIconButton(icon: Ph.arrowLeft.regular, label: "Go back", variant: .secondary)
        }
        ButtonGroup {
          Button("Archive") {}.buttonStyle(.variant(.secondary))
          ButtonGroupSeparator()
          Button("Report") {}.buttonStyle(.variant(.secondary))
        }
        ButtonGroup {
          Button("Snooze") {}.buttonStyle(.variant(.secondary))
          ButtonGroupSeparator()
          ButtonGroupMailMenu(variant: .secondary)
        }
      }
    },
    Story("Outline") {
      ButtonGroup {
        ButtonGroup {
          ButtonGroupIconButton(icon: Ph.arrowLeft.regular, label: "Go back", variant: .outline)
        }
        ButtonGroup {
          Button("Archive") {}.buttonStyle(.variant(.outline))
          Button("Report") {}.buttonStyle(.variant(.outline))
        }
        ButtonGroup {
          Button("Snooze") {}.buttonStyle(.variant(.outline))
          ButtonGroupMailMenu(variant: .outline)
        }
      }
    },
    Story("Orientation") {
      ButtonGroup(orientation: .vertical) {
        ButtonGroupIconButton(icon: Ph.plus.regular, label: "Zoom in", variant: .secondary)
        ButtonGroupSeparator(.horizontal)
        ButtonGroupIconButton(icon: Ph.minus.regular, label: "Zoom out", variant: .secondary)
      }
      .accessibilityLabel(Text("Media controls"))
    },
    Story("Sizes") {
      VStack(alignment: .leading, spacing: 24) {
        ButtonGroupSizeRow(title: "Small", size: .sm, iconSize: .iconSm)
        ButtonGroupSizeRow(title: "Default", size: .default, iconSize: .icon)
        ButtonGroupSizeRow(title: "Large", size: .lg, iconSize: .iconLg)
      }
    },
    Story("Nested") {
      ButtonGroup {
        ButtonGroup {
          ForEach(["1", "2", "3", "4", "5"], id: \.self) { page in
            Button {} label: { Text(verbatim: page) }
              .buttonStyle(.variant(.outline, size: .sm))
          }
        }
        ButtonGroup {
          ButtonGroupIconButton(icon: Ph.arrowLeft.regular, label: "Previous", variant: .outline, size: .iconSm)
          ButtonGroupIconButton(icon: Ph.arrowRight.regular, label: "Next", variant: .outline, size: .iconSm)
        }
      }
    },
    Story("WithSeparator") {
      ButtonGroup {
        Button {} label: {
          Label { Text("Copy") } icon: { Ph.copy.regular }
        }
        .buttonStyle(.variant(.secondary))
        ButtonGroupSeparator()
        Button {} label: {
          Label { Text("Share") } icon: { Ph.share.regular }
        }
        .buttonStyle(.variant(.secondary))
      }
    },
    Story("Plain") {
      ButtonGroup {
        Button {} label: {
          Label { Text("Back") } icon: { Ph.arrowLeft.regular }
        }
        .buttonStyle(.variant(.plain))
        Button {} label: {
          HStack(spacing: 6) {
            Text("Forward")
            Ph.arrowRight.regular
              .frame(width: VariantButtonStyle.Size.default.iconSize, height: VariantButtonStyle.Size.default.iconSize)
          }
        }
        .buttonStyle(.variant(.plain))
        Button {} label: {
          Label { Text("Share") } icon: { Ph.share.regular }
        }
        .buttonStyle(.variant(.plain))
      }
    },
    Story("SplitButton") {
      ButtonGroup {
        Button("Publish") {}.buttonStyle(.variant())
        ButtonGroupSeparator()
        ButtonGroupIconButton(icon: Ph.caretDown.regular, label: "More options", variant: .default)
      }
    },
    Story("WithInput") {
      ButtonGroupWithInputDemo()
    },
    Story("WithInputGroup") {
      ButtonGroupWithInputGroupDemo()
    },
    Story("WithText") {
      ButtonGroupWithTextDemo()
    },
    Story("WithDropdownMenu") {
      ButtonGroup {
        Button("Follow") {}.buttonStyle(.variant(.outline))
        DropdownMenu(align: .end) {
          DropdownMenuGroup {
            DropdownMenuItem("Mute conversation", icon: Ph.warningCircle.regular) {}
            DropdownMenuItem("Copy link", icon: Ph.copy.regular) {}
            DropdownMenuItem("Share conversation", icon: Ph.share.regular) {}
          }
          DropdownMenuSeparator()
          DropdownMenuGroup {
            DropdownMenuItem("Unfollow", icon: Ph.userCircleMinus.regular, variant: .destructive) {}
          }
        } label: {
          ButtonGroupIcon(icon: Ph.caretDown.regular, size: .icon)
        }
        .buttonStyle(.variant(.outline, size: .icon))
        .accessibilityLabel(Text("More options"))
      }
    },
    Story("WithSelect") {
      ButtonGroupCurrencyDemo()
    },
    Story("WithPopover") {
      ButtonGroupPopoverDemo()
    },
    Story("Pagination") {
      ButtonGroup {
        ButtonGroupIconButton(icon: Ph.caretLeft.regular, label: "Previous page", variant: .outline)
        Button {} label: { Text(verbatim: "1") }.buttonStyle(.variant(.outline))
        Button {} label: { Text(verbatim: "2") }
          .buttonStyle(.variant(.outline))
          .accessibilityAddTraits(.isSelected)
        Button {} label: { Text(verbatim: "3") }.buttonStyle(.variant(.outline))
        ButtonGroupIconButton(icon: Ph.caretRight.regular, label: "Next page", variant: .outline)
      }
      .accessibilityLabel(Text("Pagination"))
    },
  ])
}

private struct ButtonGroupIcon: View {
  let icon: Image
  let size: VariantButtonStyle.Size

  var body: some View {
    icon.frame(width: size.iconSize, height: size.iconSize)
  }
}

private struct ButtonGroupIconButton: View {
  let icon: Image
  let label: LocalizedStringKey
  let variant: VariantButtonStyle.Variant
  var size: VariantButtonStyle.Size = .icon

  var body: some View {
    Button {} label: {
      ButtonGroupIcon(icon: icon, size: size)
    }
    .buttonStyle(.variant(variant, size: size))
    .accessibilityLabel(Text(label))
  }
}

private struct ButtonGroupMailMenu: View {
  let variant: VariantButtonStyle.Variant

  var body: some View {
    DropdownMenu(align: .end) {
      DropdownMenuGroup {
        DropdownMenuItem("Mark as read", icon: Ph.listPlus.regular) {}
        DropdownMenuItem("Archive", icon: Ph.archive.regular) {}
      }
      DropdownMenuSeparator()
      DropdownMenuGroup {
        DropdownMenuItem("Snooze", icon: Ph.clock.regular) {}
        DropdownMenuItem("Add to calendar", icon: Ph.calendarPlus.regular) {}
        DropdownMenuItem("Label as", icon: Ph.tag.regular) {}
      }
      DropdownMenuSeparator()
      DropdownMenuGroup {
        DropdownMenuItem("Trash", icon: Ph.trash.regular, variant: .destructive) {}
      }
    } label: {
      ButtonGroupIcon(icon: Ph.dotsThree.bold, size: .icon)
    }
    .buttonStyle(.variant(variant, size: .icon))
    .accessibilityLabel(Text("More options"))
  }
}

private struct ButtonGroupSizeRow: View {
  let title: LocalizedStringKey
  let size: VariantButtonStyle.Size
  let iconSize: VariantButtonStyle.Size

  var body: some View {
    ButtonGroup {
      Button(title) {}.buttonStyle(.variant(.outline, size: size))
      Button("Button") {}.buttonStyle(.variant(.outline, size: size))
      Button("Group") {}.buttonStyle(.variant(.outline, size: size))
      ButtonGroupIconButton(icon: Ph.plus.regular, label: "Add", variant: .outline, size: iconSize)
    }
  }
}

private struct ButtonGroupWithInputDemo: View {
  @State private var query = ""

  var body: some View {
    ButtonGroup {
      TextField("Search", text: $query, prompt: Text("Search..."))
        .textFieldStyle(.input)
      ButtonGroupIconButton(icon: Ph.magnifyingGlass.regular, label: "Search", variant: .secondary, size: .iconLg)
    }
  }
}

private struct ButtonGroupWithInputGroupDemo: View {
  @State private var message = ""

  var body: some View {
    ButtonGroup {
      ButtonGroup {
        ButtonGroupIconButton(icon: Ph.plus.regular, label: "Add", variant: .outline, size: .iconLg)
      }
      ButtonGroup {
        InputGroup {
          InputGroupInput("Send a message...", text: $message)
            .accessibilityLabel(Text("Message"))
          InputGroupAddon(align: .inlineEnd) {
            InputGroupButton(size: .iconXs) {} label: {
              Ph.microphone.regular.frame(width: 14, height: 14)
            }
            .accessibilityLabel(Text("Voice mode"))
          }
        }
      }
    }
  }
}

private struct ButtonGroupWithTextDemo: View {
  @State private var url = ""

  var body: some View {
    ButtonGroup {
      ButtonGroupText {
        Label { Text(verbatim: "https://") } icon: { Ph.link.regular }
      }
      TextField("Website", text: $url, prompt: Text(verbatim: "example.com"))
        .textFieldStyle(.input)
        .keyboardType(.URL)
        .textInputAutocapitalization(.never)
      Button("Save") {}.buttonStyle(.variant(.secondary, size: .lg))
    }
  }
}

private struct ButtonGroupCurrencyDemo: View {
  @State private var currency: String? = "usd"
  @State private var amount = ""

  var body: some View {
    ButtonGroup {
      ButtonGroup {
        SelectField(selection: $currency) {
          SelectGroup {
            SelectItem(verbatim: "$", value: "usd")
            SelectItem(verbatim: "€", value: "eur")
            SelectItem(verbatim: "£", value: "gbp")
            SelectItem(verbatim: "₺", value: "try")
          }
        }
        .frame(width: 76)
        .accessibilityLabel(Text("Currency"))
        TextField("Amount", text: $amount, prompt: Text(verbatim: "10.00"))
          .textFieldStyle(.input)
          .keyboardType(.decimalPad)
      }
      ButtonGroup {
        ButtonGroupIconButton(icon: Ph.arrowRight.regular, label: "Send", variant: .outline, size: .iconLg)
      }
    }
  }
}

private struct ButtonGroupPopoverDemo: View {
  @State private var open = false
  @State private var task = ""

  var body: some View {
    ButtonGroup {
      Button {} label: {
        Label { Text("Assistant") } icon: { Ph.sparkle.regular }
      }
      .buttonStyle(.variant(.outline))
      Button { open = true } label: {
        ButtonGroupIcon(icon: Ph.caretDown.regular, size: .icon)
      }
      .buttonStyle(.variant(.outline, size: .icon))
      .accessibilityLabel(Text("Open popover"))
      .popover(isPresented: $open) {
        PopoverContent(width: 320) {
          PopoverHeader {
            PopoverTitle("Start a new task")
            PopoverDescription("Describe your task in natural language.")
          }
          TextField("Task description", text: $task, prompt: Text("I need to..."), axis: .vertical)
            .textFieldStyle(.textarea)
        }
      }
    }
  }
}
