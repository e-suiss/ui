import EsuissUI
import SwiftUI

enum InputStories {
  static let group = StoryGroup(.components, "Input", stories: [
    Story("Default") {
      InputDemo(placeholder: "Email")
    },
    Story("Types") {
      InputTypesDemo()
    },
    Story("Sizes") {
      VStack(alignment: .leading, spacing: 12) {
        InputDemo(placeholder: "Small", size: .sm)
        InputDemo(placeholder: "Medium", size: .md)
        InputDemo(placeholder: "Default")
      }
    },
    Story("WithValue") {
      InputDemo(placeholder: "Email", initial: "hello@example.com")
    },
    Story("WithLabel") {
      InputWithLabelDemo()
    },
    Story("Invalid") {
      InputInvalidDemo()
    },
    Story("Controlled") {
      InputControlledDemo()
    },
    Story("Disabled") {
      InputDemo(placeholder: "Disabled")
        .disabled(true)
    },
  ])
}

private struct InputDemo: View {
  let placeholder: LocalizedStringKey
  var size: InputStyle.Size = .default

  @State private var text: String

  init(placeholder: LocalizedStringKey, size: InputStyle.Size = .default, initial: String = "") {
    self.placeholder = placeholder
    self.size = size
    _text = State(initialValue: initial)
  }

  var body: some View {
    TextField(placeholder, text: $text)
      .textFieldStyle(.input(size: size))
  }
}

private struct InputTypesDemo: View {
  @State private var text = ""
  @State private var email = ""
  @State private var password = ""
  @State private var number = ""
  @State private var search = ""

  var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      TextField("Text", text: $text)
        .textFieldStyle(.input)
      TextField("Email", text: $email)
        .textFieldStyle(.input)
        .keyboardType(.emailAddress)
        .textInputAutocapitalization(.never)
      SecureField("Password", text: $password)
        .textFieldStyle(.input)
      TextField("Number", text: $number)
        .textFieldStyle(.input)
        .keyboardType(.numberPad)
      TextField("Search", text: $search)
        .textFieldStyle(.input)
        .submitLabel(.search)
    }
  }
}

private struct InputWithLabelDemo: View {
  @State private var email = ""

  var body: some View {
    Field {
      FieldLabel("Email")
        .accessibilityHidden(true)
      TextField(text: $email, prompt: Text(verbatim: "m@example.com")) {
        Text("Email")
      }
        .textFieldStyle(.input)
        .keyboardType(.emailAddress)
        .textInputAutocapitalization(.never)
        .accessibilityLabel(Text("Email"))
      FieldDescription("We will never share your email.")
    }
  }
}

private struct InputInvalidDemo: View {
  @State private var username = "x"

  var body: some View {
    Field(invalid: true) {
      FieldLabel("Username")
        .accessibilityHidden(true)
      TextField("", text: $username)
        .textFieldStyle(.input)
        .accessibilityLabel(Text("Username"))
      FieldError("Username must be at least 3 characters.")
    }
  }
}

private struct InputControlledDemo: View {
  @State private var value = ""

  var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      TextField(
        "Lowercase only",
        text: Binding(get: { value }, set: { value = $0.lowercased() })
      )
      .textFieldStyle(.input)
      .textInputAutocapitalization(.never)
      Text(verbatim: "Value: \(value)")
        .textVariant(.muted)
    }
  }
}
