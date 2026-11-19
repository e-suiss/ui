import EsuissUI
import PhosphorSwift
import SwiftUI

enum InputGroupStories {
  static let group = StoryGroup(.components, "Input Group", stories: [
    Story("Default") {
      InputGroupDefaultDemo()
    },
    Story("WithTextarea") {
      InputGroupTextareaDemo()
    },
    Story("BlockStart") {
      InputGroupBlockStartDemo()
    },
    Story("Large") {
      InputGroupLargeDemo()
    },
    Story("ButtonSizes") {
      InputGroupButtonSizesDemo()
    },
  ])
}

private struct InputGroupIcon: View {
  let image: Image

  var body: some View {
    image.frame(width: 16, height: 16)
  }
}

private struct InputGroupSearchDemo: View {
  @State private var value = ""

  var body: some View {
    InputGroup {
      InputGroupInput("Search", text: $value)
      InputGroupAddon {
        InputGroupIcon(image: Ph.magnifyingGlass.regular)
      }
      if !value.isEmpty {
        InputGroupAddon(align: .inlineEnd) {
          InputGroupButton(size: .iconXs) {
            value = ""
          } label: {
            InputGroupIcon(image: Ph.x.regular)
          }
          .accessibilityLabel(Text("Clear"))
        }
      }
    }
  }
}

private struct InputGroupDefaultDemo: View {
  @State private var domain = ""
  @State private var key = "sk_live_51H8"
  @State private var searching = ""
  @State private var email = "not-an-email"
  @State private var disabled = ""

  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      InputGroupSearchDemo()
      InputGroup {
        InputGroupAddon {
          InputGroupText("https://")
        }
        InputGroupInput("example.com", text: $domain)
          .textInputAutocapitalization(.never)
        InputGroupAddon(align: .inlineEnd) {
          InputGroupText(".com")
        }
      }
      InputGroup {
        InputGroupInput("", text: $key)
        InputGroupAddon(align: .inlineEnd) {
          InputGroupButton(size: .iconXs) {} label: {
            InputGroupIcon(image: Ph.copy.regular)
          }
          .accessibilityLabel(Text("Copy"))
        }
      }
      InputGroup {
        InputGroupInput("Searching...", text: $searching)
        InputGroupAddon(align: .inlineEnd) {
          Spinner()
        }
      }
      InputGroup {
        InputGroupInput("", text: $email)
        InputGroupAddon(align: .inlineEnd) {
          InputGroupText("Invalid")
        }
      }
      .invalid()
      InputGroup {
        InputGroupInput("Disabled", text: $disabled)
        InputGroupAddon {
          InputGroupIcon(image: Ph.magnifyingGlass.regular)
        }
      }
      .disabled(true)
    }
  }
}

private struct InputGroupTextareaDemo: View {
  @State private var message = ""

  var body: some View {
    InputGroup {
      InputGroupTextarea("Ask, search or chat...", text: $message, lineLimit: 3...8)
      InputGroupAddon(align: .blockEnd) {
        InputGroupText("52% used")
        Spacer(minLength: 0)
        InputGroupButton(variant: .default, size: .iconXs) {} label: {
          InputGroupIcon(image: Ph.arrowUp.regular)
        }
        .accessibilityLabel(Text("Send"))
      }
    }
  }
}

private struct InputGroupBlockStartDemo: View {
  @State private var name = ""

  var body: some View {
    InputGroup {
      InputGroupInput("Enter your name", text: $name)
      InputGroupAddon(align: .blockStart) {
        Text("Full name")
          .textStyle(.sm, weight: .medium)
          .foregroundStyle(EsuissColor.foreground)
      }
    }
  }
}

private struct InputGroupLargeDemo: View {
  @State private var phone = ""

  var body: some View {
    InputGroup(size: .lg) {
      InputGroupAddon {
        InputGroupText {
          Text(verbatim: "+90")
            .foregroundStyle(EsuissColor.foreground)
        }
        EsuissColor.border
          .frame(width: 1, height: 22)
          .padding(.leading, 4)
          .padding(.trailing, 6)
          .accessibilityHidden(true)
      }
      InputGroupInput("555 123 45 67", text: $phone)
        .keyboardType(.phonePad)
        .textContentType(.telephoneNumber)
        .accessibilityLabel(Text("Phone number"))
      InputGroupAddon(align: .inlineEnd) {
        InputGroupButton(variant: .default, size: .icon) {} label: {
          InputGroupIcon(image: Ph.caretRight.bold)
        }
        .accessibilityLabel(Text("Continue"))
      }
    }
  }
}

private struct InputGroupButtonSizesDemo: View {
  @State private var message = ""

  var body: some View {
    InputGroup {
      InputGroupInput("Type to search...", text: $message)
      InputGroupAddon(align: .inlineEnd) {
        InputGroupButton("Search", variant: .secondary, size: .xs) {}
        InputGroupButton(size: .iconXs) {} label: {
          InputGroupIcon(image: Ph.copy.regular)
        }
        .accessibilityLabel(Text("Copy"))
        InputGroupButton(size: .iconSm) {} label: {
          InputGroupIcon(image: Ph.paperclip.regular)
        }
        .accessibilityLabel(Text("Attach"))
        InputGroupButton(variant: .default, size: .icon) {} label: {
          InputGroupIcon(image: Ph.arrowUp.bold)
        }
        .accessibilityLabel(Text("Send"))
      }
    }
  }
}
